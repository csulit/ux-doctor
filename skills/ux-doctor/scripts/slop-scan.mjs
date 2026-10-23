#!/usr/bin/env node
// slop-scan: counts "AI-look tells" (unchosen generated-design defaults, rules W1-80..W1-84 and W5-01..W5-14) in
// markup, components and stylesheets. It flags patterns, not provenance: a tell the brief or the project's tokens
// chose on purpose is not a finding (W5-01), and nothing here proves a page was AI-generated.
// Usage: node scripts/slop-scan.mjs <url | file | dir | -> [--json] [--max-files N] [--timeout s] [--help]
//   url   fetches the HTML of one page (no JavaScript is run; linked CSS is not fetched)
//   file  scans one file; dir scans source files recursively (html, htm, jsx, tsx, js, ts, mjs, cjs, vue, svelte, astro,
//         mdx, css, scss), skipping node_modules, build output, VCS and test/story files; symlinks are not followed
//   -     reads stdin
// Line-based heuristics (deterministic regexes on each line, plus a short window for multi-line headings and hidden
// entrances). Lines longer than 2000 characters (minified files) are cut into pieces at tag/rule boundaries, then into
// 2000-character chunks; hits keep the original line number, and a pattern split across two chunks is missed.
// Every tell lists rule IDs, a hit count and up to 5 locations. Tier by distinct tells (W5-01, after the
// design-slop-score source): 0–1 low, 2–3 medium, 4+ high; report one grouped finding only at 3+ tells.
// HIDDEN_UNTIL_SCROLL (W5-04) is a defect candidate, not a style tell: it is listed apart, outside the tell count, and
// is scored on its own once a render without JS or with reduced motion confirms it.
// Not checked (needs a render or a judgement): nested non-Card containers, stat rows (W5-14), demo-sized content
// (W5-13), whether a look was chosen (W5-02). Inter is never a tell (the playbook recommends it, E-17).
// Exit 0 = no tells or defect candidates, 1 = found, 2 = bad input, unreadable target (in a directory scan: any
// unreadable file, after printing the partial result), fetch failure or timeout.
// --list prints every tell with its rule IDs as JSON (used by validate.mjs) and exits 0.
// Writes nothing.
import { readFileSync, readdirSync, lstatSync, existsSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const USAGE = `usage: slop-scan.mjs <url|file|dir|-> [--json] [--max-files N] [--timeout s] [--list] [--help]
  url        fetch one page's HTML (static; no JavaScript, no linked CSS)
  file|dir   scan one file or a source tree (symlinks not followed)
  -          read stdin
  --json     machine-readable output
  --max-files N   cap for directory scans (default 4000)
  --timeout s     overall watchdog in seconds (default 60)
  --list     print every tell and its rule IDs as JSON, then exit 0
exit: 0 nothing found, 1 tells or defect candidates found, 2 bad input / unreadable / fetch failure / timeout`;
const die = (m) => { console.error(m); process.exit(2); };
const argv = process.argv.slice(2), VALUED = ["--max-files", "--timeout"], BOOL = ["--json", "--list", "--help", "-h"];
if (argv.includes("--help") || argv.includes("-h")) { console.log(USAGE); process.exit(0); }
const positional = [];
for (let i = 0; i < argv.length; i++) { const a = argv[i];
  if (VALUED.includes(a)) { if (argv[i + 1] == null || argv[i + 1].startsWith("--")) die(`${a} needs a value\n${USAGE}`); i++; }
  else if (BOOL.includes(a)) continue;
  else if (a === "-" || !a.startsWith("-")) positional.push(a);
  else die(`unknown option ${a}\n${USAGE}`); }
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const target = positional[0];
const LIST = argv.includes("--list");
if (!target && !LIST) die(USAGE);
if (positional.length > 1) die(`one target at a time (got ${positional.length}: ${positional.join(", ")})`);
const MAX_FILES = Number(opt("--max-files", "4000")), TIMEOUT_S = Number(opt("--timeout", "60"));
if (!(Number.isInteger(MAX_FILES) && MAX_FILES > 0)) die(`--max-files needs a positive integer (got "${opt("--max-files")}")`);
if (!(TIMEOUT_S > 0)) die(`--timeout needs a positive number of seconds (got "${opt("--timeout")}")`);
setTimeout(() => { console.error(`slop-scan: timed out after ${TIMEOUT_S}s (raise --timeout)`); process.exit(2); }, TIMEOUT_S * 1000).unref();

const MAX_FILE_BYTES = 1_000_000, MAX_LINE = 2000, MAX_TOTAL_BYTES = 50_000_000;
const EXT = new Set([".html", ".htm", ".jsx", ".tsx", ".js", ".ts", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".mdx", ".css", ".scss"]);
const SKIP_DIR = new Set(["node_modules", ".git", ".hg", ".svn", "dist", "build", "out", ".next", ".nuxt", ".svelte-kit", ".astro", ".output", ".vercel", ".netlify", ".turbo", ".cache", "coverage", "vendor", ".ux-doctor"]);
const SKIP_FILE = /\.(min|test|spec|stories|story|d)\.[a-z]+$/i;

// ---------- tells: one entry per pattern; `min` = hits needed (per scan) before it counts as a tell ----------
// Each `line` test gets one line or one piece of a long line (at most MAX_LINE characters). Regexes are anchored on literal tokens with bounded
// repetition only (no nested quantifiers), so worst-case time stays linear in the line length.
const ACCENT_FAMILIES = "(?:purple|violet|indigo|fuchsia)";
const NEUTRAL = "(?:gray|grey|slate|zinc|neutral|stone|white|black|transparent|current|inherit|border|muted|input|background|foreground|card|secondary)";
const has = (re) => (l) => re.test(l);
const all = (...res) => (l) => res.every((re) => re.test(l));
const isComment = (l) => /^\s*(?:\/\/|\/\*|\*|<!--|#)/.test(l);
const TELLS = [
  { id: "GRADIENT_TEXT", rules: ["W1-80", "W5-05"], label: "gradient-clipped text", min: 1,
    line: (l) => (/\bbg-clip-text\b/.test(l) && /\btext-transparent\b/.test(l)) || /(?:-webkit-)?background-clip\s*:\s*text\b/i.test(l) },
  { id: "BLUR_BLOB", rules: ["W1-81"], label: "blurred decorative blob/glow", min: 1,
    line: (l) => (/\bblur-(?:2xl|3xl|\[\d{2,3}px\])/.test(l) && /\brounded-full\b/.test(l)) || /\bfilter\s*:\s*blur\(\s*(?:[4-9]\d|\d{3})px/i.test(l) },
  { id: "PURPLE_GRADIENT", rules: ["W1-81", "W5-12"], label: "purple/indigo-to-blue gradient", min: 1,
    line: (l) => (new RegExp(`\\bfrom-${ACCENT_FAMILIES}-\\d{2,3}\\b`).test(l) && /\bto-(?:blue|pink|cyan|sky|indigo|purple|violet|fuchsia)-\d{2,3}\b/.test(l))
      || /linear-gradient\([^)]{0,200}(?:#8b5cf6|#7c3aed|#6366f1|#4f46e5|#a855f7|#9333ea|\bpurple\b|\bviolet\b|\bindigo\b)/i.test(l) },
  { id: "BUZZWORD_COPY", rules: ["W1-80", "W5-11"], label: "generic marketing phrases", min: 3, skipComments: true,
    line: (l) => /(?<![.\w-])(?:seamless(?:ly)?|effortless(?:ly)?|supercharge[sd]?|unleash(?:es)?|revolutioni[sz]e[sd]?|game[- ]?chang(?:er|ing)|cutting[- ]edge|next[- ]gen(?:eration)?|empower(?:s|ing)?|streamline[sd]?|build the future|ship faster|ai[- ]native|in today'?s (?:fast[- ]paced|digital)|to the next level|unlock (?:your|the|new)|elevate (?:your|the))(?![\w(])/i.test(l) },
  { id: "TRUSTED_BY_COUNT", rules: ["W1-83"], label: "\"Trusted by N+\" claim", min: 1, skipComments: true,
    line: has(/trusted by\s{1,3}(?:over\s{1,3})?(?:[\d][\d,.]{0,12}\s?[kKmM+]|thousands|millions|teams|leading|the world)/i) },
  { id: "SCROLL_REVEAL", rules: ["W5-03"], label: "scroll-triggered entrance hooks", min: 3,
    line: has(/\bwhileInView\b|\bdata-aos=|\bAOS\.init\b|\buseInView\(|\bScrollReveal\(|\bdata-scroll-reveal\b|\banimate-on-scroll\b/) },
  { id: "HIDDEN_UNTIL_SCROLL", rules: ["W5-04"], label: "content hidden until a scroll trigger fires (confirm: render without JS / reduced motion)", min: 1, defect: true,
    // AOS hides [data-aos] elements in its own CSS until its script runs; observer-based entrances need a hidden start nearby (±2 lines)
    near: 2, trigger: /\bdata-aos=|\bwhileInView\b|\buseInView\(|\bIntersectionObserver\b/,
    need: (l, w) => /\bdata-aos=/.test(l) || /\bopacity-0\b|opacity\s*:\s*0(?![.\d])|initial=\{\{\s*opacity\s*:\s*0\b/.test(w) },
  { id: "ACCENT_WORD", rules: ["W5-05"], label: "one styled word inside a headline", min: 1,
    window: 6, start: /<h[12][\s>]/i, end: /<\/h[12]>/i,
    block: (w) => /<(?:em|i|span)\b[^>]{0,200}class(?:Name)?=["'{`][^"'`]{0,300}(?:\bitalic\b|\bfont-serif\b|\bbg-clip-text\b|\btext-(?:primary|accent|brand)\b|\btext-(?:purple|violet|indigo|fuchsia|blue|pink|orange|amber|emerald|teal|cyan|sky|rose|red|green|lime|yellow)-[3-7]00\b)/i.test(w) },
  { id: "EYEBROW_LABEL", rules: ["W5-06"], label: "tracked all-caps eyebrow labels", min: 3,
    line: all(/\buppercase\b/, /\btracking-(?:wide|wider|widest|\[[\d.]+em\])(?![\w-])/, /\btext-(?:xs|sm|\[1[0-3]px\])(?![\w-])/) },
  { id: "ARROW_LABELS", rules: ["W5-07"], label: "arrow appended to link/button labels", min: 4, skipComments: true, ratio: 0.3, skipPath: /(?:^|\/)components\/ui\//,
    line: has(/(?:→|&rarr;|-&gt;)\s{0,3}<\/(?:a|button|Link|Button)>|<ArrowRight(?:Icon)?\b/) },
  { id: "EDGE_STRIPE", rules: ["W5-08"], label: "coloured left/top stripe on cards", min: 1,
    line: (l) => !/<blockquote\b|\balert\b|role=["']alert/i.test(l) && (
      (/\brounded/.test(l) && /\bborder-[lt]-(?:[2-8]|\[\d{1,2}px\])(?![\w-])/.test(l)
        && (new RegExp(`\\bborder-(?:[lt]-)?(?!${NEUTRAL}\\b)[a-z]{3,8}-\\d{2,3}\\b`).test(l) || /\bborder-(?:[lt]-)?(?:primary|accent|brand)\b/.test(l)))
      || /\bborder-(?:left|top)\s*:\s*[3-9]px\s+solid\s+(?:#|rgb|hsl|oklch|var\()/i.test(l)) },
  { id: "NESTED_CARD", rules: ["W5-09"], label: "<Card> nested inside <Card>", min: 1, nesting: true },
  { id: "EMOJI_ICONS", rules: ["W5-10"], label: "emoji used as icons/bullets", min: 3, skipComments: true,
    line: has(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{2604}\u{2607}-\u{2712}\u{2719}-\u{27BF}\u{2B50}\u{2B55}]/u) },
  { id: "ICON_TILE", rules: ["W1-84", "W5-10"], label: "icon in a tinted rounded tile (feature-card header)", min: 3, skipPath: /(?:^|\/)components\/ui\//,
    // square (size-N, or h-N with the same w-N), centred, tinted with an accent hue or gradient; not a button (no px-*) and not a neutral avatar
    line: (l) => { const sq = /\bsize-(8|9|10|11|12|14|16)\b/.exec(l) || /\bh-(8|9|10|11|12|14|16)\b/.exec(l); if (!sq) return false;
      if (!/\bsize-/.test(sq[0]) && !new RegExp(`\\bw-${sq[1]}\\b`).test(l)) return false;
      return /\brounded-(?:full|md|lg|xl|2xl)\b/.test(l) && /\b(?:items-center|place-items-center)\b/.test(l) && !/\bpx-\d/.test(l)
        && (new RegExp(`\\bbg-(?!${NEUTRAL}\\b)[a-z]{3,8}-(?:50|100|200|[4-6]00\\/\\d{1,2})\\b`).test(l) || /\bbg-(?:primary|accent|brand)\/\d{1,2}\b|\bbg-gradient-to-/.test(l)); } },
  { id: "DEFAULT_KIT_THEME", rules: ["W5-12"], label: "UI kit default theme left unchanged", min: 1,
    line: has(/--primary\s*:\s*(?:222\.2\s+47\.4%\s+11\.2%|oklch\(\s*0\.205\s+0\s+0\s*\))/) },
];

if (LIST) { console.log(JSON.stringify(TELLS.map((t) => ({ tell: t.id, rules: t.rules, label: t.label, min: t.min, defect: !!t.defect })), null, 1)); process.exit(0); }

// ---------- input ----------
const files = []; let skippedLarge = 0, unreadable = 0, truncatedWalk = false, totalBytes = 0;
function walk(dir) {
  let ents; try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  ents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const e of ents) {
    if (files.length >= MAX_FILES) { truncatedWalk = true; return; }
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name) && !e.name.startsWith(".")) walk(p); continue; }
    if (!e.isFile() || !EXT.has(extname(e.name).toLowerCase()) || SKIP_FILE.test(e.name)) continue;
    let st; try { st = lstatSync(p); } catch { continue; }
    if (st.size > MAX_FILE_BYTES) { skippedLarge++; continue; }
    if (totalBytes + st.size > MAX_TOTAL_BYTES) { truncatedWalk = true; return; }
    totalBytes += st.size; files.push(p);
  }
}
const sources = []; // { name, text }
if (/^https?:\/\//i.test(target)) {
  try { new URL(target); } catch { die(`not a valid URL: ${target}`); }
  const r = await fetch(target, { signal: AbortSignal.timeout(8000), redirect: "follow" }).catch((e) => die(`fetch failed: ${target} (${e.cause?.code || e.message})`));
  if (!r.ok) die(`HTTP ${r.status} for ${target}`);
  const text = await r.text(); sources.push({ name: target, text: text.slice(0, MAX_TOTAL_BYTES) });
} else if (target === "-") sources.push({ name: "stdin", text: readFileSync(0, "utf8").slice(0, MAX_TOTAL_BYTES) });
else {
  if (!existsSync(target)) die(`no such file or directory: ${target}`);
  let st; try { st = lstatSync(target); } catch (e) { die(`cannot read ${target} (${e.code || e.message})`); }
  if (st.isDirectory()) { walk(target); if (!files.length) die(`no scannable source files under ${target} (extensions: ${[...EXT].join(" ")})`);
    for (const f of files) { try { sources.push({ name: relative(target, f) || basename(f), text: readFileSync(f, "utf8") }); } catch { unreadable++; } }
    if (!sources.length) die(`cannot read any of the ${files.length} source file(s) under ${target}`); }
  else if (st.isFile()) { if (st.size > MAX_TOTAL_BYTES) die(`file too large: ${target}`);
    let text; try { text = readFileSync(target, "utf8"); } catch (e) { die(`cannot read ${target} (${e.code || e.message})`); }
    sources.push({ name: basename(target), text }); }
  else die(`not a file or directory: ${target}`);
}

// ---------- scan ----------
const hits = Object.fromEntries(TELLS.map((t) => [t.id, []]));
const excerpt = (s) => s.trim().replace(/\s+/g, " ").slice(0, 120);
for (const { name, text } of sources) {
  // minified single-line files: cut long lines at tag/rule boundaries, then into MAX_LINE chunks; `lns` keeps each
  // piece's original line number so reported file:line anchors stay exact
  const lines = [], lns = [];
  text.split(/\r?\n/).forEach((l, i) => {
    const parts = l.length > MAX_LINE ? l.split(/(?<=>)(?=<)|(?<=\})/) : [l]; // tags and CSS rules; never inside an entity like &rarr;
    for (const p of parts) for (let k = 0; k < Math.max(1, p.length); k += MAX_LINE) { lines.push(p.slice(k, k + MAX_LINE)); lns.push(i + 1); } });
  for (const t of TELLS) {
    if (t.nesting) { // <Card ...> depth tracking (JSX/Vue/Svelte component names only)
      let depth = 0;
      lines.forEach((l, i) => { for (const m of l.matchAll(/<(\/?)Card(?=[\s>/])([^>]{0,300}?)(\/?)>/g)) {
        if (m[1]) { depth = Math.max(0, depth - 1); continue; }
        if (depth >= 1) hits[t.id].push({ file: name, line: lns[i], text: excerpt(l) }); // an inner <Card> or <Card /> inside an open <Card>
        if (!m[3]) depth++; } });
      continue;
    }
    if (t.near) { // trigger line + its neighbours (multi-line JSX props)
      lines.forEach((l, i) => { if (t.trigger.test(l) && t.need(l, lines.slice(Math.max(0, i - t.near), i + t.near + 1).join("\n"))) hits[t.id].push({ file: name, line: lns[i], text: excerpt(l) }); });
      continue;
    }
    if (t.window) { // a block that starts on a `start` line and runs to `end` or `window` lines (multi-line headings)
      for (let i = 0; i < lines.length; i++) {
        if (!t.start.test(lines[i])) continue;
        let w = lines[i];
        for (let k = 1; k < t.window && i + k < lines.length && !t.end.test(w); k++) w += "\n" + lines[i + k];
        if (t.block(w)) hits[t.id].push({ file: name, line: lns[i], text: excerpt(lines[i]) });
      }
      continue;
    }
    if (t.skipPath && t.skipPath.test(name.replaceAll("\\", "/"))) continue;
    lines.forEach((l, i) => { if (t.skipComments && isComment(l)) return; if (t.line(l)) hits[t.id].push({ file: name, line: lns[i], text: excerpt(l) }); });
  }
}
// ARROW_LABELS counts only when arrows sit on a sizeable share of the links/buttons scanned (W5-07: "on every control")
const controls = sources.reduce((n, s) => n + (s.text.match(/<(?:a|button|Link|Button)\b/g) || []).length, 0);
// ICON_TILE also counts when a single tile line sits in a file with a 3-column grid (one mapped component renders the row)
const gridFiles = new Set(sources.filter((s) => /\b(?:[a-z0-9]+:)?grid-cols-3\b/.test(s.text)).map((s) => s.name));
const found = TELLS.map((t) => ({ t, h: hits[t.id] }))
  .filter(({ t, h }) => (h.length >= t.min && (!t.ratio || h.length >= t.ratio * controls)) || (t.id === "ICON_TILE" && h.some((x) => gridFiles.has(x.file))))
  .map(({ t, h }) => ({ tell: t.id, rules: t.rules, label: t.label, count: h.length, where: h.slice(0, 5), defect: !!t.defect }));
const tells = found.filter((x) => !x.defect), defects = found.filter((x) => x.defect);
const below = TELLS.filter((t) => hits[t.id].length && !found.some((x) => x.tell === t.id)).map((t) => ({ tell: t.id, count: hits[t.id].length, min: t.min, ...(t.ratio ? { ofControls: controls } : {}) }));
const n = tells.length, tier = n >= 4 ? "high" : n >= 2 ? "medium" : "low";
const verdict = n >= 3 ? "report one grouped \"AI-look tells\" finding (W5-01); drop tells the brief or project tokens chose on purpose"
  : n ? "mention as one (general practice) note, not a scored finding (W5-01)" : "no tells";
const scanned = sources.length;

const defectNote = "defect candidate (W5-04): not a style tell and not in the count; confirm with a render without JS or with reduced motion, then score it on its own";
if (argv.includes("--json")) console.log(JSON.stringify({ target, filesScanned: scanned, skippedLarge, unreadable, truncated: truncatedWalk, tells: n, tier, verdict, flags: tells, defects: defects.map((d) => ({ ...d, note: defectNote })), belowThreshold: below }, null, 1));
else {
  console.log(`slop-scan ${target}\nfiles scanned: ${scanned}${skippedLarge ? ` (skipped ${skippedLarge} over 1 MB)` : ""}${unreadable ? ` (${unreadable} unreadable)` : ""}${truncatedWalk ? " (walk truncated: raise --max-files)" : ""}`);
  console.log(`AI-look tells: ${n}  tier: ${tier}  → ${verdict}\n`);
  for (const x of tells) { console.log(`[${x.tell}] ${x.label} ×${x.count}  rules: ${x.rules.join(", ")}`);
    for (const w of x.where) console.log(`    ${w.file}:${w.line}  ${w.text}`); }
  for (const x of defects) { console.log(`\nDEFECT CANDIDATE [${x.tell}] ${x.label} ×${x.count}  rules: ${x.rules.join(", ")}\n    ${defectNote}`);
    for (const w of x.where) console.log(`    ${w.file}:${w.line}  ${w.text}`); }
  if (below.length) console.log(`\nbelow threshold (not counted): ${below.map((b) => `${b.tell} ${b.count} hit(s), needs ${b.min}${b.ofControls != null ? ` and ≥30% of ${b.ofControls} links/buttons` : ""}`).join("; ")}`);
  console.log("\nHeuristic hints, not verdicts: confirm each against the code or a render. Not checked: stat rows (W5-14), demo-sized content (W5-13), whether the look was chosen (W5-02). Inter is never a tell (E-17).");
}
if (unreadable) { console.error(`slop-scan: incomplete scan, ${unreadable} file(s) could not be read`); process.exit(2); }
process.exit(n || defects.length ? 1 : 0);
