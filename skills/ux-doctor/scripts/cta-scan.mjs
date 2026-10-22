#!/usr/bin/env node
// cta-scan: repeated and competing calls to action, per page and per first viewport.
// Usage: node scripts/cta-scan.mjs <url | file.html | -> [--render] [--shots <dir>] [--json] [--timeout <s>]
//          [--desktop 1440x900] [--mobile 390x844] [--scheme light|dark] [--filled <class-list>] [--base <url>] [--help]
// Static (default): parses the HTML plus inline/linked CSS; "first viewport" ≈ header/banner + first block
//   of <main> (DOM order, approximate). APPROXIMATION: if finding the content container meant descending through
//   single-child wrappers (e.g. <main><section>…</section></main>, or main > div.container > sections), the first TWO
//   blocks of the final container count as the first viewport (a lone hero section is split into its children, so the
//   hero CTA is still seen). Elements that static analysis can see are off-canvas (-translate-x-full utilities,
//   translateX(-1xx%) / left:-9999px inline styles) are excluded from the first viewport.
//   --render: drives an installed Chrome/Chromium/Edge over CDP (nothing installed; Node ≥ 22) and measures real
//   boxes (must intersect the viewport vertically AND horizontally), computed fills and sticky/fixed ancestors.
//   Render reports the colour scheme in effect (prefers-color-scheme; set with --scheme); static ignores --scheme.
//   --shots <dir> (needs --render) saves <dir>/<page>-desktop.png and -mobile.png first-viewport screenshots.
//   --base <url> resolves relative links of a local file/stdin and decides which hosts count as "same site".
//   CHROME_PATH=<binary> picks the browser (if set but missing, the scan stops instead of guessing).
// Flags: DUP_IN_VIEWPORT = the SAME normalised label AND the same destination appears 2+ times in one first viewport
//   (at least one button-styled). MULTI_PRIMARY_IN_VIEWPORT = 2+ saturated-fill CTAs in one first viewport.
//   Not a flag, only a "note" line: DIFFERENT labels that point at the same destination while all are button-styled.
// Exit 0 = no flags, 1 = flags, 2 = bad input, page not loadable (render: navigation error or HTTP >= 400 on the main
//   document; static: fetch failure / HTTP error), no interactive elements found, browser failure or timeout.
// Robustness (--render): every CDP call times out after 20 s, JavaScript dialogs are auto-accepted, Chrome (and its
//   process group) is force-killed on SIGINT/SIGTERM/SIGHUP/exit, an overall watchdog (--timeout <s>, default 60) aborts with exit 2.
// Writes nothing except --shots <dir> and a temporary browser profile (deleted on exit).
// Limits: static mode only approximates the first viewport (header + first <main> block, no real layout, simple
//   selectors, no JS-rendered content; prefer --render when a dev server is running). Prominence is a heuristic
//   (saturated fill = primary, other fill = neutral-fill, border/inset shadow = outline, else ghost/link): a
//   saturated neutral brand colour or a gradient can be misjudged; --filled <class-list> forces "primary" for
//   class names containing any of the given literal substrings (comma/space separated, * = wildcard; NOT a regex). A hint of "major"/"minor" is a starting point for the auditor, not a verdict.
import { readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, realpathSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, resolve as resolvePath, relative as relativePath, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";

const USAGE = `usage: cta-scan.mjs <url|file.html|-> [--render] [--shots dir] [--json] [--timeout s] [--desktop WxH] [--mobile WxH]
                    [--scheme light|dark] [--filled class-list] [--base url] [--help]
  static (default): HTML+CSS heuristics, approximate first viewport
  --render          measure in an installed Chrome/Chromium/Edge (Node >= 22; CHROME_PATH overrides)
  --shots dir       with --render: save first-viewport screenshots <page>-desktop.png / -mobile.png
  --json            machine-readable output
  --timeout s       overall watchdog in seconds (default 60); exit 2 when exceeded
  --base url        base for relative links of a local file or stdin (e.g. https://example.com/)
  --filled list     class-name substrings (comma/space separated, * = wildcard, literal not regex; max 200 chars,
                    20 entries) whose elements always count as a primary (filled) CTA, e.g. --filled "btn-main,hero-*-cta"
exit: 0 no flags, 1 flags (DUP_IN_VIEWPORT, MULTI_PRIMARY_IN_VIEWPORT), 2 bad input / page not loadable / no interactive elements / browser failure / timeout`;
const die = (m) => { console.error(m); process.exit(2); };
const argv = process.argv.slice(2), VALUED = ["--desktop", "--mobile", "--filled", "--base", "--shots", "--scheme", "--timeout"], BOOL = ["--render", "--json", "--help", "-h"];
if (argv.includes("--help") || argv.includes("-h")) { console.log(USAGE); process.exit(0); }
const positional = [];
for (let i = 0; i < argv.length; i++) { const a = argv[i];
  if (VALUED.includes(a)) { if (argv[i + 1] == null || (argv[i + 1].startsWith("--"))) die(`${a} needs a value\n${USAGE}`); i++; }
  else if (BOOL.includes(a)) continue;
  else if (a === "-" || !a.startsWith("-")) positional.push(a);
  else die(`unknown option ${a}\n${USAGE}`); }
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const target = positional[0];
if (!target) die(USAGE);
if (positional.length > 1) die(`one target at a time (got ${positional.length}: ${positional.join(", ")})`);
const RENDER = argv.includes("--render");
if (opt("--shots") && !RENDER) die("--shots needs --render (screenshots come from the browser)");
if (RENDER && target === "-") die("--render needs a URL or a file, not stdin");
const wh = (s, k) => { const m = /^(\d{2,5})x(\d{2,5})$/.exec(s); if (!m) die(`${k} must look like 1440x900 (got "${s}")`); return { w: +m[1], h: +m[2] }; };
const VIEWS = { desktop: wh(opt("--desktop", "1440x900"), "--desktop"), mobile: wh(opt("--mobile", "390x844"), "--mobile") };
if (opt("--scheme") && !/^(light|dark)$/.test(opt("--scheme"))) die(`--scheme must be light or dark (got "${opt("--scheme")}")`);
// --filled is a list of literal class-name substrings ("*" = wildcard), never a raw regex: every segment is escaped.
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\\/-]/g, "\\$&");
const FILLED_RE = (() => { const raw = opt("--filled"); if (raw == null) return null;
  if (raw.length > 200) die(`--filled is too long (max 200 characters, got ${raw.length})`);
  const parts = raw.split(/[\s,]+/).filter(Boolean); if (!parts.length) die("--filled needs at least one class-name substring");
  if (parts.length > 20) die(`--filled takes at most 20 entries (got ${parts.length})`);
  return new RegExp(parts.map((p) => p.split(/\*+/).map((seg) => escapeRegExp(seg)).join("[^\\s]*")).join("|")); })();
const isUrl = /^https?:\/\//i.test(target);
const base = opt("--base", isUrl ? target : "http://local.invalid/");
try { new URL(base); } catch { die(`--base must be an absolute URL (got "${base}")`); }
const TIMEOUT_S = opt("--timeout") == null ? 60 : Number(opt("--timeout"));
if (!(TIMEOUT_S > 0)) die(`--timeout needs a positive number of seconds (got "${opt("--timeout")}")`);
let killBrowser = () => {}; // set by renderScan; synchronous, idempotent
process.on("exit", () => killBrowser());
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => { console.error(`cta-scan: ${sig}, stopping`); process.exit(2); });
setTimeout(() => { console.error(`cta-scan: timed out after ${TIMEOUT_S}s (raise --timeout)`); process.exit(2); }, TIMEOUT_S * 1000);

// ---------- normalisation & prominence ----------
const normLabel = (s) => (s || "").replace(/\s+/g, " ").replace(/^[\s→›»↗←‹«·•|:–—-]+|[\s→›»↗←‹«·•|:.!–—-]+$/g, "").trim().toLowerCase();
const normHref = (h) => {
  if (h == null) return null; h = h.trim();
  if (/^mailto:/i.test(h)) return "mailto:" + decodeURIComponent(h.slice(7).split("?")[0]).toLowerCase();
  if (/^tel:/i.test(h)) return "tel:" + h.replace(/[^\d+]/g, "");
  if (!h || h === "#" || /^javascript:/i.test(h)) return null;
  try {
    const u = new URL(h, base), b = new URL(base);
    for (const k of [...u.searchParams.keys()]) if (/^(utm_|ref$|fbclid|gclid)/i.test(k)) u.searchParams.delete(k);
    let p = u.pathname.replace(/\/index\.html?$/, "/"); if (p.length > 1) p = p.replace(/\/$/, "");
    return (u.host === b.host ? "" : `${u.protocol}//${u.host}`) + p + u.search + u.hash;
  } catch { return h; }
};
const rgba = (c) => {
  c = (c || "").trim().toLowerCase();
  if (!c || c === "transparent" || c === "none" || /^(initial|inherit|unset|currentcolor)$/.test(c)) return [0, 0, 0, 0];
  if (c === "white") return [255, 255, 255, 1]; if (c === "black") return [0, 0, 0, 1];
  let m = c.match(/^#([0-9a-f]{3,8})$/);
  if (m) { let h = m[1]; if (h.length <= 4) h = [...h].map((x) => x + x).join(""); const n = h.match(/../g).map((x) => parseInt(x, 16)); return [n[0], n[1], n[2], n.length > 3 ? n[3] / 255 : 1]; }
  m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]];
  m = c.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) { const s = m[2] / 100, l = m[3] / 100, a = m[4] == null ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4]; return ["hsl", s, l, a]; }
  return null; // unknown (gradient, color-mix, unresolved var)
};
const fillKind = (c) => { // saturated fill = primary, any other opaque fill = neutral-fill
  const v = rgba(c); if (!v) return null; if (v[3] < 0.5) return "none";
  let s, l; if (v[0] === "hsl") [s, l] = [v[1], v[2]];
  else { const [r, g, b] = v.slice(0, 3).map((x) => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b); l = (mx + mn) / 2; s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)); }
  return s > 0.3 && l > 0.15 && l < 0.85 ? "primary" : "neutral-fill";
};
const tokens = (cls) => String(cls || "").split(/\s+/).filter((t) => t && !t.includes(":"));
const byClassName = (cls, tag) => {
  const t = tokens(cls);
  if (FILLED_RE && FILLED_RE.test(cls)) return "primary";
  if (t.some((x) => /(?:^|[-_])(outline|outlined|bordered)(?:$|-[a-z0-9]+$)/.test(x))) return "outline";
  if (t.some((x) => /(?:^|[-_])(ghost|tertiary|link|subtle|plain|quiet|flat|transparent)(?:$|-[a-z0-9]+$)/.test(x))) return "ghost/link";
  if (t.some((x) => /(?:^|[-_])secondary$/.test(x))) return "neutral-fill";
  if (t.some((x) => !/^(text|border|ring|outline|fill|stroke|shadow)-/.test(x) && /(?:^|[-_])(primary|solid|filled|cta|default|accent|brand)$/.test(x))) return "primary";
  const bg = t.find((x) => /^bg-/.test(x) && !/^bg-(transparent|none|inherit|current|opacity|clip|cover|contain|center|no-repeat|fixed)/.test(x));
  if (bg) return /^bg-(white|black|(gray|grey|slate|zinc|neutral|stone)-|muted|secondary|background|card)/.test(bg) ? "neutral-fill" : "primary";
  return tag === "button" || t.some((x) => /(?:^|[-_])(btn|button)$/.test(x)) ? "unknown" : "ghost/link";
};
const isCTA = (p) => p === "primary" || p === "neutral-fill" || p === "outline" || p === "unknown";

// ---------- tiny HTML tree ----------
const ENTITIES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
// single pass: each entity is decoded exactly once ("&amp;lt;" -> "&lt;", never "<")
const decode = (s) => s.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#0?39|#160|#\d+);/g, (m) => {
  const name = m.slice(1, -1); if (name in ENTITIES) return ENTITIES[name];
  const n = Number(name.slice(1)); return n === 160 ? " " : n > 0x10ffff ? "\ufffd" : String.fromCodePoint(n); });
const attrsOf = (s) => { const o = {}; for (const m of (s || "").matchAll(/([^\s=/"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) o[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? ""); return o; };
const VOID = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
function parseHTML(html) {
  const root = { tag: "#root", attrs: {}, kids: [], parent: null }, styles = [], links = []; let cur = root, m;
  const re = /<!--[\s\S]*?-->|<(script|style|svg|template|noscript|textarea)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1\s*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  while ((m = re.exec(html))) {
    if (m[1]) { const t = m[1].toLowerCase(); if (t === "style") styles.push(m[3]); cur.kids.push({ tag: t, attrs: attrsOf(m[2]), kids: [], parent: cur }); }
    else if (m[4]) { const t = m[4].toLowerCase(); let n = cur; while (n && n.tag !== t) n = n.parent; if (n && n.parent) cur = n.parent; }
    else if (m[5]) { const t = m[5].toLowerCase(), el = { tag: t, attrs: attrsOf(m[6]), kids: [], parent: cur }; cur.kids.push(el);
      if (t === "link" && /stylesheet/i.test(el.attrs.rel || "") && el.attrs.href) links.push(el.attrs.href);
      if (!VOID.has(t) && !m[7]) cur = el; }
    else if (m[8]) cur.kids.push({ text: decode(m[8]) });
  }
  return { root, styles, links };
}
const textOf = (n) => n.text ?? (["svg", "script", "style", "template", "noscript"].includes(n.tag) ? "" : n.tag === "img" ? (n.attrs.alt || "") : n.kids.map(textOf).join(" "));
const walk = (n, f) => { if (n.tag) { f(n); n.kids.forEach((k) => walk(k, f)); } };
const classesOf = (el) => (el.attrs?.class || "").split(/\s+/).filter(Boolean);

// ---------- tiny CSS cascade (simple selectors, media by width, specificity + order) ----------
function parseCSS(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@(import|charset|namespace)[^;]*;|@layer[^{;]*;/g, "");
  const rules = []; let i = 0, order = 0;
  const skip = () => { let d = 1; while (i < css.length && d) { if (css[i] === "{") d++; else if (css[i] === "}") d--; i++; } };
  (function block(media) {
    while (i < css.length) {
      const open = css.indexOf("{", i), close = css.indexOf("}", i);
      if (close !== -1 && (open === -1 || close < open)) { i = close + 1; return; }
      if (open === -1) { i = css.length; return; }
      const head = css.slice(i, open).trim(); i = open + 1;
      if (/^@media/i.test(head)) block([...media, head.slice(6).trim()]);
      else if (/^@(supports|layer|container|scope)/i.test(head)) block(media);
      else if (head.startsWith("@")) skip();
      else { const close2 = css.indexOf("}", i), end = close2 === -1 ? css.length : close2, body = css.slice(i, end); i = end + 1; // unterminated rule: consume to EOF (never rewind)
        const decl = {};
        for (const d of body.split(";")) { const k = d.indexOf(":"); if (k > 0) decl[d.slice(0, k).trim().toLowerCase()] = d.slice(k + 1).replace(/!important/i, "").trim(); }
        for (const sel of head.split(/,(?![^(]*\))/)) { const mt = matcher(sel.trim()); if (mt) rules.push({ mt, decl, media, order: order++, spec: spec(sel) }); } }
    }
  })([]);
  return rules;
}
const spec = (s) => [(s.match(/#[\w-]+/g) || []).length, (s.match(/\.[\w\\:-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) || []).length, (s.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length];
function matcher(sel) {
  const s = sel.replace(/\\:/g, "\u0001").replace(/\\(.)/g, "$1");
  if (s === ":root") return (el) => el.tag === "html";
  if (/[+~]|::?(?!root)[a-z]/i.test(s)) return null; // pseudo-classes/elements and sibling combinators: skip (approximation)
  const preds = s.replace(/\s*>\s*/g, " ").trim().split(/\s+/).map((c) => {
    const tag = c.match(/^[a-z][\w-]*/i)?.[0]?.toLowerCase(), ids = [...c.matchAll(/#([\w-]+)/g)].map((x) => x[1]);
    const cls = [...c.matchAll(/\.([\w\u0001\/-]+)/g)].map((x) => x[1].replace(/\u0001/g, ":"));
    const at = [...c.matchAll(/\[([\w-]+)(?:([~|^$*]?=)\s*["']?([^"'\]]*)["']?)?\]/g)];
    return (el) => !!el.attrs && (!tag || el.tag === tag) && ids.every((x) => el.attrs.id === x) && cls.every((x) => classesOf(el).includes(x))
      && at.every(([, a, op, v]) => a in el.attrs && (!op || (op === "=" ? el.attrs[a] === v : el.attrs[a].includes(v))));
  });
  return (el) => { if (!preds.at(-1)(el)) return false; let i = preds.length - 2;
    for (let n = el.parent; n && i >= 0; n = n.parent) if (preds[i](n)) i--; return i < 0; };
}
const mediaOK = (list, view) => list.every((q) => q.split(",").some((part) => {
  part = part.toLowerCase(); const w = view.w;
  if (/^\s*print\b/.test(part) || /prefers-reduced-motion:\s*reduce/.test(part)) return false;
  if (/\(pointer:\s*coarse\)|\(hover:\s*none\)/.test(part)) return w < 600;
  if (/\(pointer:\s*fine\)|\(hover:\s*hover\)/.test(part)) return w >= 600;
  for (const m of part.matchAll(/\((min|max)-width:\s*([\d.]+)(px|em|rem)\)/g)) { const v = +m[2] * (m[3] === "px" ? 1 : 16); if (m[1] === "min" ? w < v : w > v) return false; }
  for (const m of part.matchAll(/\(width\s*(<=|>=|<|>)\s*([\d.]+)(px|em|rem)\)/g)) { const v = +m[2] * (m[3] === "px" ? 1 : 16);
    if (!({ "<=": w <= v, ">=": w >= v, "<": w < v, ">": w > v })[m[1]]) return false; }
  return true;
}));
const TW = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
function cascade(rules) {
  const cache = new Map();
  const value = (el, prop, view) => {
    const key = prop + view.w; let c = cache.get(el); if (!c) cache.set(el, (c = {})); if (key in c) return c[key];
    const inline = (el.attrs.style || "").match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i"));
    let best = null;
    for (const r of rules) if (prop in r.decl && mediaOK(r.media, view) && r.mt(el)) {
      if (!best || cmp(r, best) >= 0) best = r; }
    let v = inline ? inline[1].trim() : best ? best.decl[prop] : null;
    if (v == null && prop === "display") { // Tailwind-style utilities when no stylesheet covers them
      for (const t of classesOf(el)) { const [bp, u] = t.includes(":") ? t.split(":") : [null, t];
        if ((!bp || (TW[bp] && view.w >= TW[bp])) && /^(hidden|block|flex|inline-flex|inline-block|grid|inline|table|contents)$/.test(u)) v = u === "hidden" ? "none" : u; } }
    if (v == null && prop === "position") v = classesOf(el).find((t) => t === "sticky" || t === "fixed") || null;
    return (c[key] = v);
  };
  const cmp = (a, b) => { for (let i = 0; i < 3; i++) if (a.spec[i] !== b.spec[i]) return a.spec[i] - b.spec[i]; return a.order - b.order; };
  return value;
}

// ---------- static scan ----------
async function loadRemote(t) {
  const r = await fetch(t, { signal: AbortSignal.timeout(8000) }).catch((e) => die(`fetch failed: ${t} (${e.cause?.code || e.message}) — try http://localhost and http://[::1]`)); if (!r.ok) die(`HTTP ${r.status} for ${t}`); return r.text();
}
function loadLocal(t) {
  if (t === "-") return readFileSync(0, "utf8");
  if (!existsSync(t)) die(`no such file: ${t}`); return readFileSync(t, "utf8");
}
// Linked CSS, local file: only paths inside the HTML file's directory are read; nothing read here is ever sent over the network.
function readLocalCss(htmlPath, links) {
  if (htmlPath === "-") return "";
  let dir; try { dir = realpathSync(dirname(resolvePath(htmlPath))); } catch { return ""; }
  let css = "";
  for (const href of links.slice(0, 12)) { if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) continue;
    // root-relative hrefs ("/css/a.css") are resolved against the HTML file's directory, never the filesystem root; missing files are skipped
    let rel = href.split(/[?#]/)[0].replace(/^\/+/, ""); try { rel = decodeURIComponent(rel); } catch {}
    try { const f = realpathSync(resolvePath(dir, rel)), up = relativePath(dir, f);
      if (up === "" || up.startsWith("..") || isAbsolute(up)) continue; // escapes the HTML file's directory (.. or symlink)
      css += "\n" + readFileSync(f, "utf8"); } catch {} }
  return css;
}
// Linked CSS, URL target: hrefs come from the fetched remote page only; http(s) same-origin as the target, redirects must stay there.
async function fetchRemoteCss(pageUrl, links) {
  let origin; try { const o = new URL(pageUrl); if (!/^https?:$/.test(o.protocol)) return ""; origin = o.origin; } catch { return ""; }
  let css = "";
  for (const href of links.slice(0, 12)) { try { const u = new URL(href, pageUrl); if (!/^https?:$/.test(u.protocol) || u.origin !== origin) continue;
    const r = await fetch(u, { signal: AbortSignal.timeout(5000) }); if (new URL(r.url).origin !== origin) continue; css += "\n" + await r.text(); } catch {} }
  return css;
}
function srcOf(el) {
  const a = el.attrs, f = a["data-astro-source-file"]; if (f) return `${f.replace(process.cwd() + "/", "")}:${(a["data-astro-source-loc"] || "").split(":")[0]}`;
  const v = a["data-v-inspector"] || a["data-inspector-relative-path"] && `${a["data-inspector-relative-path"]}:${a["data-inspector-line"]}` || a["data-source"] || a["data-source-loc"]; return v || "";
}
// URL target: HTML comes from the network, linked CSS may be fetched (same origin). Local file/stdin: linked CSS is read from disk only.
const scanRemote = async (html) => staticScan(html, await fetchRemoteCss(target, parseHTML(html).links));
const scanLocal = (html) => staticScan(html, readLocalCss(target, parseHTML(html).links));
async function staticScan(html, linkedCss) {
  const { root, styles } = parseHTML(html); const css = [styles.join("\n"), linkedCss].join("\n");
  const rules = parseCSS(css), val = cascade(rules); let htmlEl = null; walk(root, (n) => { if (n.tag === "html") htmlEl = n; });
  const vars = {}; if (htmlEl) for (const r of rules) if (!r.media.length && r.mt(htmlEl)) for (const [k, v] of Object.entries(r.decl)) if (k.startsWith("--")) vars[k] = v;
  const resolve = (v, d = 0) => d > 6 || !v ? v : resolve(v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g, (_, n, fb) => vars[n] ?? fb ?? ""), d + 1);
  const all = []; walk(root, (n) => { if ((n.tag === "a" && "href" in n.attrs) || n.tag === "button" || n.tag === "summary" || n.attrs.role === "button" || (n.tag === "input" && /^(submit|button)$/i.test(n.attrs.type || ""))) all.push(n); });
  const anc = (el, f) => { for (let n = el.parent; n; n = n.parent) if (n.tag && f(n)) return n; return null; };
  const blocks = (n) => n.kids.filter((k) => k.tag && !["script", "style", "template", "noscript", "header", "footer", "nav", "link", "meta"].includes(k.tag) && !/skip/.test(k.attrs.class || ""));
  let descended = false;
  const container = (() => { let main = null; walk(root, (n) => { if (!main && (n.tag === "main" || n.attrs.role === "main")) main = n; }); let c = main;
    if (!c) walk(root, (n) => { if (!c && n.tag === "body") c = n; }); c ||= root; while (blocks(c).length === 1) { c = blocks(c)[0]; descended = true; } return c; })();
  const sectionLike = (k) => ["section", "article", "aside"].includes(k.tag) || !!k.attrs.id;
  const place = (el) => { // { region label, in first viewport (approximation, see header comment) }
    const outer = (n) => !anc(n, (a) => ["main", "article", "section", "aside"].includes(a.tag));
    const h = el.tag === "header" ? el : anc(el, (a) => a.tag === "header" || a.attrs.role === "banner"); if (h && outer(h)) return { region: "header", first: true };
    const f = anc(el, (a) => a.tag === "footer" || a.attrs.role === "contentinfo"); if (f && outer(f)) return { region: "footer", first: false };
    const ks = blocks(container), i = ks.findIndex((k) => k === el || anc(el, (a) => a === k));
    if (i < 0) return { region: "body", first: false };
    const first = i === 0 || (descended && i === 1);
    return { region: i === 0 || (first && !sectionLike(ks[i])) ? "hero" : `§${i + 1}${ks[i].attrs.id ? "#" + ks[i].attrs.id : ""}`, first };
  };
  const offcanvas = (el, view) => { // statically visible off-canvas drawers: translate-x utilities / inline translateX(-1xx%) / left:-9999px
    for (let n = el; n && n.tag !== "#root"; n = n.parent) {
      const st = n.attrs.style || "";
      if (/translatex?\(\s*-?1\d\d%/i.test(st) || /(^|;)\s*(left|inset-inline-start)\s*:\s*-\d{4,}px/i.test(st)) return true;
      let best = null; for (const t of classesOf(n)) { const [bp, u] = t.includes(":") ? t.split(":") : [null, t]; if (bp && !(TW[bp] && view.w >= TW[bp])) continue;
        const off = /^(-?translate-x-full|-translate-x-\d{2,})$/.test(u), on = /^-?translate-x-(0|px|\d(\.\d+)?)$/.test(u); if (!off && !on) continue;
        const rank = bp ? TW[bp] : 0; if (!best || rank >= best.rank) best = { off, rank }; }
      if (best?.off) return true; }
    return false;
  };
  const state = (el, view) => {
    for (let n = el; n && n.tag !== "#root"; n = n.parent) { const a = n.attrs;
      if ("hidden" in a || a["aria-hidden"] === "true" || /(^|\s)(sr-only|visually-hidden)(\s|$)/.test(a.class || "")) return "hidden";
      if (n.parent?.tag === "details" && !("open" in n.parent.attrs) && n.tag !== "summary") return "collapsed";
      if (n.tag === "dialog" && !("open" in a)) return "collapsed";
      if (val(n, "display", view) === "none" || val(n, "visibility", view) === "hidden") return "hidden"; }
    return "visible";
  };
  const prominence = (el) => {
    if (FILLED_RE && FILLED_RE.test(el.attrs.class || "")) return "primary";
    if (el.tag === "a" && anc(el, (n) => n.tag === "nav" || n.attrs.role === "navigation") && (el.attrs["aria-current"] != null || !/(^|[-_\s])(btn|button|cta)([-_\s]|$)/i.test(el.attrs.class || ""))) return "ghost/link"; // plain/active nav links are not CTAs
    const v = VIEWS.desktop, bg = resolve(val(el, "background-color", v) ?? val(el, "background", v));
    if (bg != null) { if (/gradient\(/.test(bg)) return "primary"; const k = fillKind(bg.split(/\s+(?![^(]*\))/)[0]);
      if (k && k !== "none") return k;
      if (k === "none") { const sh = resolve(val(el, "box-shadow", v) || ""), bd = resolve(val(el, "border", v) || val(el, "border-width", v) || "");
        return /inset/.test(sh) || /\d+(\.\d+)?px/.test(bd) && !/^0|none/.test(bd) ? "outline" : "ghost/link"; } }
    return byClassName(el.attrs.class, el.tag);
  };
  return all.map((el) => { const pl = place(el); return {
    tag: el.tag, label: normLabel(textOf(el)) || normLabel(el.attrs["aria-label"] || el.attrs.title || el.attrs.value || ""),
    href: normHref(el.attrs.href), cls: el.attrs.class || "", region: pl.region, prominence: prominence(el), src: srcOf(el),
    sticky: [el, ...(function* () { for (let n = el.parent; n && n.tag !== "#root"; n = n.parent) yield n; })()].some((n) => /^(sticky|fixed)$/.test(val(n, "position", VIEWS.desktop) || "")),
    skip: /skip/i.test(el.attrs.class || "") || /^#(main|content)/.test(el.attrs.href || ""),
    views: Object.fromEntries(Object.entries(VIEWS).map(([k, v]) => { const st = state(el, v); return [k, { state: st, first: st === "visible" && pl.first && !offcanvas(el, v) }]; })),
  }; });
}

// ---------- rendered scan (Chrome over CDP; no install) ----------
function findChrome() {
  if (process.env.CHROME_PATH) return existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : null;
  for (const p of ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"]) if (p && existsSync(p)) return p;
  for (const n of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"]) { try { return execFileSync("which", [n], { encoding: "utf8" }).trim(); } catch {} }
  return null;
}
const PROBE = function () {
  const blocks = (n) => [...n.children].filter((k) => !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|HEADER|FOOTER|NAV|LINK)$/.test(k.tagName) && k.getBoundingClientRect().height > 0);
  let c = document.querySelector("main,[role=main]") || document.body, descended = false; while (blocks(c).length === 1) { c = blocks(c)[0]; descended = true; } const ks = blocks(c);
  const sectionLike = (k) => /^(SECTION|ARTICLE|ASIDE)$/.test(k.tagName) || !!k.id;
  const region = (el) => { const h = el.closest("header,[role=banner]"); if (h && !h.parentElement.closest("main,article,section,aside")) return "header";
    const f = el.closest("footer,[role=contentinfo]"); if (f && !f.parentElement.closest("main,article,section,aside")) return "footer";
    const i = ks.findIndex((k) => k.contains(el)); return i === 0 || (i === 1 && descended && !sectionLike(ks[1])) ? "hero" : i > 0 ? "§" + (i + 1) + (ks[i].id ? "#" + ks[i].id : "") : "body"; };
  return [...document.querySelectorAll("a[href],button,summary,[role=button],input[type=submit],input[type=button]")].map((el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el), clone = el.cloneNode(true); clone.querySelectorAll("svg,script,style").forEach((n) => n.remove());
    let sticky = false; for (let n = el; n && n !== document.documentElement; n = n.parentElement) if (/fixed|sticky/.test(getComputedStyle(n).position)) { sticky = true; break; }
    const vis = (el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : true) && r.width > 1 && r.height > 1;
    const inDetails = el.closest("details:not([open])") && !el.closest("summary");
    const f = el.getAttribute("data-astro-source-file");
    return { tag: el.tagName.toLowerCase(), text: clone.textContent, aria: el.getAttribute("aria-label") || el.title || el.value || "", href: el.getAttribute("href"),
      cls: typeof el.className === "string" ? el.className : "", region: region(el), sticky, bg: cs.backgroundColor, bgImg: cs.backgroundImage,
      outline: (cs.borderTopStyle !== "none" && parseFloat(cs.borderTopWidth) > 0) || /inset/.test(cs.boxShadow),
      navLink: el.tagName === "A" && !!el.closest("nav,[role=navigation]") && (el.getAttribute("aria-current") != null || !/(^|[-_\s])(btn|button|cta)([-_\s]|$)/i.test(el.className && el.className.toString())),
      state: inDetails ? "collapsed" : vis ? "visible" : "hidden", first: vis && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, top: Math.round(r.top),
      src: f ? f + ":" + (el.getAttribute("data-astro-source-loc") || "").split(":")[0] : el.getAttribute("data-v-inspector") || "" };
  });
};
async function renderScan(url) {
  if (typeof WebSocket === "undefined") die("--render needs Node ≥ 22 (global WebSocket)");
  const chrome = findChrome(); if (!chrome) die(process.env.CHROME_PATH ? `--render: CHROME_PATH="${process.env.CHROME_PATH}" does not exist. Fix CHROME_PATH or unset it, or drop --render to use static mode (approximate first viewport).`
    : "--render: no Chrome/Chromium/Edge found. Set CHROME_PATH to a browser binary, or drop --render to use static mode (approximate first viewport).");
  const dir = mkdtempSync(join(tmpdir(), "cta-scan-")), shots = opt("--shots"), detached = process.platform !== "win32";
  const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "about:blank"], { stdio: ["ignore", "ignore", "pipe"], detached });
  const exited = new Promise((r) => { proc.on("exit", r); proc.on("error", r); });
  killBrowser = () => { // synchronous so it also works from the process 'exit' event and signal handlers
    try { if (detached && proc.pid) process.kill(-proc.pid, "SIGKILL"); } catch {}
    try { proc.kill("SIGKILL"); } catch {}
    try { rmSync(dir, { recursive: true, force: true, maxRetries: 3 }); } catch {} };
  const cleanup = async () => { try { if (detached && proc.pid) process.kill(-proc.pid, "SIGKILL"); } catch {} try { proc.kill("SIGKILL"); } catch {}
    await Promise.race([exited, new Promise((r) => setTimeout(r, 2000))]); killBrowser(); };
  try {
    const wsUrl = await new Promise((res, rej) => { let b = ""; const t = setTimeout(() => rej(new Error("Chrome did not start in 15s")), 15000);
      proc.stderr.on("data", (d) => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } }); proc.on("exit", () => rej(new Error("Chrome exited before it was ready"))); proc.on("error", (e) => rej(new Error(`cannot start ${chrome}: ${e.message}`))); });
    const ws = new WebSocket(wsUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error("CDP connect failed")); });
    let id = 0; const pending = new Map(), waiters = new Set();
    const send = (method, params = {}, sessionId) => new Promise((ok, ko) => { const i = ++id;
      const t = setTimeout(() => { pending.delete(i); ko(new Error(`CDP ${method} timed out after 20s`)); }, 20000);
      pending.set(i, [(v) => { clearTimeout(t); ok(v); }, (e) => { clearTimeout(t); ko(e); }]);
      try { ws.send(JSON.stringify({ id: i, method, params, sessionId })); } catch (e) { pending.delete(i); clearTimeout(t); ko(e); } });
    ws.onmessage = (e) => { const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { const [ok, ko] = pending.get(m.id); pending.delete(m.id); m.error ? ko(new Error(m.error.message)) : ok(m.result); return; }
      if (m.method === "Page.javascriptDialogOpening") send("Page.handleJavaScriptDialog", { accept: true }, m.sessionId).catch(() => {}); // alert()/confirm()/beforeunload must not hang the scan
      for (const w of [...waiters]) w(m); };
    ws.onclose = () => { for (const [, [, ko]] of [...pending]) ko(new Error("CDP connection closed")); pending.clear(); };
    const once = (method, s, ms) => new Promise((ok) => { const w = (m) => { if (m.method === method && m.sessionId === s) { waiters.delete(w); clearTimeout(t); ok(true); } }; waiters.add(w); const t = setTimeout(() => { waiters.delete(w); ok(false); }, ms); });
    const out = {}; let scheme = null;
    for (const [name, v] of Object.entries(VIEWS)) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" }), { sessionId: s } = await send("Target.attachToTarget", { targetId, flatten: true });
      await send("Page.enable", {}, s); await send("Network.enable", {}, s); await send("Emulation.setDeviceMetricsOverride", { width: v.w, height: v.h, deviceScaleFactor: 1, mobile: v.w < 600 }, s);
      if (opt("--scheme")) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: opt("--scheme") }] }, s);
      const docs = []; const track = (m) => { if (m.sessionId === s && m.method === "Network.responseReceived" && m.params.type === "Document") docs.push(m.params); }; waiters.add(track);
      const loaded = once("Page.loadEventFired", s, 15000), nav = await send("Page.navigate", { url }, s);
      if (nav.errorText) throw new Error(`cannot load ${url}: ${nav.errorText}`);
      const sawLoad = await loaded; await new Promise((r) => setTimeout(r, 600)); waiters.delete(track);
      const doc = [...docs].reverse().find((d) => !nav.loaderId || d.loaderId === nav.loaderId) || null, status = doc?.response?.status;
      if (status >= 400) throw new Error(`HTTP ${status} for ${url} (${name} view)`);
      if (!sawLoad) console.error(`cta-scan: warning: load event not seen within 15s (${name} view); measuring what is there`);
      await send("Runtime.evaluate", { expression: "document.querySelectorAll('astro-dev-toolbar,nextjs-portal,vite-error-overlay').forEach((n) => n.remove())" }, s); // dev overlays
      const info = (await send("Runtime.evaluate", { expression: "({ href: location.href, dark: matchMedia('(prefers-color-scheme: dark)').matches })", returnByValue: true }, s)).result.value;
      if (/^chrome-error:/.test(info.href)) throw new Error(`cannot load ${url}: browser error page`);
      if (name === "desktop") scheme = info.dark ? "dark" : "light";
      const { result } = await send("Runtime.evaluate", { expression: `(${PROBE})()`, returnByValue: true }, s); out[name] = result.value;
      if (shots) { mkdirSync(shots, { recursive: true }); const { data } = await send("Page.captureScreenshot", { format: "png" }, s);
        const pn = new URL(url).pathname.replace(/\/+$/, ""), slug = ((url.startsWith("file:") ? decodeURIComponent(pn).split("/").pop().replace(/\.[a-z0-9]+$/i, "") : pn.replace(/^\//, "")).replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"); writeFileSync(join(shots, `${slug}-${name}.png`), Buffer.from(data, "base64")); }
      await send("Target.closeTarget", { targetId });
    }
    ws.close();
    const mk = (x) => `${normLabel(x.text) || normLabel(x.aria)}|${normHref(x.href)}`, seenM = {}, mobile = new Map();
    for (const x of out.mobile) { const k = mk(x), n = (seenM[k] = (seenM[k] ?? -1) + 1); mobile.set(`${k}#${n}`, x); }
    const seenD = {};
    const list = out.desktop.map((d) => { const k = mk(d), n = (seenD[k] = (seenD[k] ?? -1) + 1), m = mobile.get(`${k}#${n}`) || { state: "hidden", first: false };
      const p = (x) => (FILLED_RE && FILLED_RE.test(x.cls)) ? "primary" : x.navLink ? "ghost/link" : x.bgImg !== "none" && /gradient/.test(x.bgImg) ? "primary" : (fillKind(x.bg) !== "none" ? fillKind(x.bg) : x.outline ? "outline" : "ghost/link");
      return { tag: d.tag, label: normLabel(d.text) || normLabel(d.aria), href: normHref(d.href), cls: d.cls, region: d.region, prominence: p(d), src: d.src, sticky: d.sticky,
        skip: /skip/i.test(d.cls) || /^#(main|content)/.test(d.href || ""), views: { desktop: { state: d.state, first: d.first }, mobile: { state: m.state, first: !!m.first } } }; });
    return { list, scheme };
  } finally { await cleanup(); }
}

// ---------- analysis & report ----------
if (RENDER && !isUrl && !existsSync(target)) die(`no such file: ${target}`);
let scheme = null;
const items = await (async () => { try {
  let list; if (RENDER) { const r = await renderScan(isUrl ? target : pathToFileURL(resolvePath(target)).href); list = r.list; scheme = r.scheme; } else list = isUrl ? await scanRemote(await loadRemote(target)) : await scanLocal(loadLocal(target));
  return list.filter((x) => !x.skip); }
  catch (e) { return die(`${RENDER ? "render" : "scan"} failed: ${e.message}`); } })();
if (!items.length) die(`no interactive elements found in ${target} (${RENDER ? "rendered page is empty, blocked or an error page" : "static HTML has no links/buttons — JS-rendered page? try --render"})`);
const schemeLine = RENDER ? `${scheme} (from prefers-color-scheme, set with --scheme)` : "not applicable (static ignores --scheme)";
const key = (x) => `${x.label} → ${x.href ?? "(no href)"}`;
if (RENDER && isUrl && items.some((x) => !x.src)) { const st = (await scanRemote(await loadRemote(target)).catch(() => [])).filter((x) => !x.skip), seen = {};
  for (const x of items) { const k = key(x), n = (seen[k] = (seen[k] ?? -1) + 1), m = st.filter((y) => key(y) === k)[n]; if (!x.src && m) x.src = m.src; } }
const flags = [], views = {};
for (const name of Object.keys(VIEWS)) {
  const first = items.filter((x) => x.views[name].first), groups = {};
  for (const x of first) (groups[key(x)] ||= []).push(x);
  for (const [k, g] of Object.entries(groups)) if (g.length > 1 && g.some((x) => isCTA(x.prominence))) {
    const prim = g.filter((x) => x.prominence === "primary").length;
    flags.push({ flag: "DUP_IN_VIEWPORT", view: name, cta: k, count: g.length, primary: prim, hint: prim >= 2 ? "major" : "minor",
      where: g.map((x) => ({ region: x.region, prominence: x.prominence, sticky: x.sticky, src: x.src })) }); }
  const prims = first.filter((x) => x.prominence === "primary");
  if (prims.length > 1) flags.push({ flag: "MULTI_PRIMARY_IN_VIEWPORT", view: name, count: prims.length, hint: "major", where: prims.map((x) => ({ cta: key(x), region: x.region, prominence: x.prominence, sticky: x.sticky, src: x.src })) });
  const byHref = {}; for (const x of first.filter((x) => x.href && isCTA(x.prominence))) (byHref[x.href] ||= new Set()).add(x.label);
  views[name] = { size: `${VIEWS[name].w}x${VIEWS[name].h}`, first, sameHrefDiffLabel: Object.entries(byHref).filter(([, s]) => s.size > 1).map(([h, s]) => ({ href: h, labels: [...s] })) };
}
const page = {}; for (const x of items) if (x.href || isCTA(x.prominence)) (page[key(x)] ||= []).push(x);
const repeated = Object.entries(page).filter(([, g]) => g.length > 1 && g.some((x) => isCTA(x.prominence))).map(([k, g]) => ({ cta: k, count: g.length,
  where: g.map((x) => ({ region: x.region, prominence: x.prominence, sticky: x.sticky, desktop: x.views.desktop.state, mobile: x.views.mobile.state, src: x.src })) }));
const persistent = items.filter((x) => x.sticky && x.views.desktop.state === "visible" && isCTA(x.prominence)).map(key);
const mode = RENDER ? "rendered (Chrome, measured boxes and computed fills)" : "static HTML+CSS (first viewport = header + first <main> block(s); approximate)";
if (argv.includes("--json")) console.log(JSON.stringify({ target, mode, scheme: RENDER ? scheme : "not applicable (static ignores --scheme)", flags, views: Object.fromEntries(Object.entries(views).map(([k, v]) => [k, { ...v, first: v.first.map((x) => ({ cta: key(x), region: x.region, prominence: x.prominence, sticky: x.sticky, src: x.src })) }])), persistent, repeated }, null, 1));
else {
  const loc = (w) => `${w.region}${w.sticky ? " (sticky)" : ""} ${w.prominence ?? ""}${w.src ? "  " + w.src : ""}`;
  console.log(`cta-scan ${target}\nmode: ${mode}\nscheme: ${schemeLine}\ninteractive elements: ${items.length}\n`);
  console.log(flags.length ? "FLAGS" : "FLAGS: none");
  for (const f of flags) { console.log(f.flag === "DUP_IN_VIEWPORT" ? `[DUP_IN_VIEWPORT] ${f.view}: "${f.cta}" ×${f.count} (${f.primary} primary)  hint: ${f.hint}` : `[MULTI_PRIMARY_IN_VIEWPORT] ${f.view}: ${f.count} primary-filled CTAs  hint: ${f.hint}`);
    for (const w of f.where) console.log(`    ${w.cta ? `"${w.cta}"  ` : ""}${loc(w)}`); }
  for (const [name, v] of Object.entries(views)) { console.log(`\nFIRST VIEWPORT ${name} ${v.size}`);
    for (const x of v.first) console.log(`  ${x.region.padEnd(9)} ${x.prominence.padEnd(12)} ${x.sticky ? "sticky " : "       "}"${x.label}" → ${x.href ?? "-"}${x.src ? "  " + x.src : ""}`);
    for (const s of v.sameHrefDiffLabel) console.log(`  note (not a flag): ${s.href} reached by ${s.labels.length} different button-styled labels in this viewport: ${s.labels.map((l) => `"${l}"`).join(", ")}`); }
  console.log(`\nPERSISTENT (sticky/fixed) CTAs: ${persistent.length ? persistent.map((p) => `"${p}"`).join(", ") : "none"}`);
  console.log("\nREPEATED ON PAGE (same label + destination, ≥1 button-styled)");
  for (const r of repeated) { console.log(`  "${r.cta}" ×${r.count}`); for (const w of r.where) console.log(`    ${w.region.padEnd(9)} ${w.prominence.padEnd(12)} desktop:${w.desktop} mobile:${w.mobile}${w.sticky ? " sticky" : ""}${w.src ? "  " + w.src : ""}`); }
}
process.exit(flags.length ? 1 : 0);
