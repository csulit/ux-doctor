#!/usr/bin/env node
// Structural checks: skills/commands/agents frontmatter, manifests, rule coverage. Exit 1 on failure.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errs = [];
const fm = (p) => { const m = readFileSync(p, "utf8").match(/^---\n([\s\S]*?)\n---\n/); if (!m) { errs.push(`${p}: no frontmatter`); return {}; }
  return Object.fromEntries(m[1].split("\n").filter((l) => /^[\w-]+:/.test(l)).map((l) => { const i = l.indexOf(":"); const v = l.slice(i + 1).trim();
    // strict YAML (Pi, Codex) rejects an unquoted scalar containing ": " or " #"
    if (v && !/^["'\[{>|]/.test(v) && /(: | #)/.test(v)) errs.push(`${p}: unquoted frontmatter value with ': ' or ' #' in "${l.slice(0, i)}" — wrap it in double quotes`);
    return [l.slice(0, i), v]; })); };
const skills = readdirSync(join(root, "skills")).filter((d) => statSync(join(root, "skills", d)).isDirectory());
for (const s of skills) {
  const p = join(root, "skills", s, "SKILL.md");
  if (!existsSync(p)) { errs.push(`${s}: missing SKILL.md`); continue; }
  const f = fm(p);
  if (f.name !== s) errs.push(`${s}: name "${f.name}" != dir`);
  if (!f.description || f.description.length > 1024) errs.push(`${s}: bad description`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) || s.length > 64) errs.push(`${s}: invalid skill name`);
}
const cmds = readdirSync(join(root, "commands")).filter((n) => n.endsWith(".md"));
if (cmds.length > 4) errs.push(`more than 4 commands: ${cmds.length}`);
for (const c of cmds) if (!fm(join(root, "commands", c)).description) errs.push(`${c}: no description`);
for (const a of readdirSync(join(root, "agents")).filter((n) => n.endsWith(".md"))) { const f = fm(join(root, "agents", a)); if (!f.name || !f.description) errs.push(`${a}: needs name+description`); }
for (const j of [".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json", "package.json", "skills/ux-doctor/references/rules.json"]) { try { JSON.parse(readFileSync(join(root, j), "utf8")); } catch (e) { errs.push(`${j}: ${e.message}`); } }
const rules = JSON.parse(readFileSync(join(root, "skills/ux-doctor/references/rules.json"), "utf8"));
const ids = new Set(rules.map((r) => r.id));
if (ids.size !== rules.length) errs.push("duplicate rule IDs");
// every rule ID cited in SKILL.md/agents/commands and in hand-written references/*.md (finding-format.md, rule-tensions.md, ...) must exist;
// only the generated reference files are skipped
const GENERATED = new Set(["rules.md", "index.md", "numeric-cheatsheet.md", "rules.json"]);
const handMd = (dir) => readdirSync(join(root, dir), { recursive: true }).map((n) => n.replaceAll("\\", "/")).filter((n) => /\.md$/.test(n) && !(/(^|\/)references\//.test(n) && GENERATED.has(n.split("/").pop()))); // "/" paths on Windows too
for (const dir of ["skills", "commands", "agents"]) for (const f of handMd(dir)) {
  const txt = readFileSync(join(root, dir, f), "utf8");
  for (const m of txt.matchAll(/\b([A-H]-\d{2}|W\d-\d{2})\b/g)) if (!ids.has(m[1]) && !/^[A-H]-00$/.test(m[1])) errs.push(`${dir}/${f}: unknown rule ${m[1]}`);
}
// duplicate-CTA guidance has one canonical home (ux-hierarchy-clarity); other files point to it instead of restating it
{
  const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");
  const canon = "skills/ux-hierarchy-clarity/SKILL.md", low = read(canon).toLowerCase(), phrase = "outline-only only lowers major to minor", restated = [phrase, "hero cta a different job", "hide the header copy until"];
  const weak = ["same-destination test", phrase, "never a resolution", "persistent conversion route", "at top:", "both scroll states", "prefers-reduced-motion", "no empty slot"].filter((c) => !low.includes(c));
  if (weak.length) errs.push(`${canon}: canonical duplicate-CTA guidance was removed or weakened (missing: ${weak.join("; ")})`);
  for (const dir of ["skills", "commands", "agents"]) for (const f of handMd(dir))
    if (`${dir}/${f}` !== canon && restated.some((c) => read(`${dir}/${f}`).toLowerCase().includes(c))) errs.push(`${dir}/${f}: restates the duplicate-CTA fix — point to the same-destination test in ux-hierarchy-clarity instead`);
  for (const p of ["skills/restyle-method/SKILL.md", "skills/ux-web-patterns/SKILL.md", "skills/ux-doctor/references/rule-tensions.md"])
    if (!read(p).includes("same-destination test")) errs.push(`${p}: must point to the same-destination test in ux-hierarchy-clarity`);
  if (!read("skills/restyle-method/SKILL.md").includes("keeps: verified")) errs.push("skills/restyle-method/SKILL.md: must require verifying audit `keeps:` claims (`keeps: verified`)");
}
// each skill's references/index.md lists every rule of that skill
for (const s of skills.filter((x) => existsSync(join(root, "skills", x, "references/index.md")))) {
  const idx = readFileSync(join(root, "skills", s, "references/index.md"), "utf8");
  for (const r of rules.filter((r) => r.skill === s)) if (!idx.includes(`| ${r.id} |`)) errs.push(`${s}: index missing ${r.id}`);
}
// every PDF page 3..142 appears in at least one rule's pages
const covered = new Set();
for (const r of rules) { if (!/^[\d,\s-]+$/.test(r.pages)) continue;
for (const part of r.pages.split(",")) { const [a, b] = part.trim().split("-").map(Number); for (let i = a; i <= (b || a); i++) covered.add(i); } }
for (const m of readFileSync(join(root, "reference/page-coverage.md"), "utf8").matchAll(/(?:^|\n)\s*[-*|]\s*\**p\.?\s*(\d+)/g)) covered.add(Number(m[1]));
const gaps = []; for (let p = 3; p <= 142; p++) if (!covered.has(p)) gaps.push(p);
if (gaps.length) errs.push(`pages with neither a rule entry nor a coverage line: ${gaps.join(",")}`);
// every scripts/<name> mentioned in SKILL.md/agents/commands must exist in skills/ux-doctor/scripts/
const scriptDir = join(root, "skills/ux-doctor/scripts");
const docs = [...skills.map((s) => `skills/${s}/SKILL.md`), ...readdirSync(join(root, "agents")).filter((n) => n.endsWith(".md")).map((n) => `agents/${n}`), ...cmds.map((n) => `commands/${n}`)];
for (const d of docs) { if (!existsSync(join(root, d))) continue;
  for (const m of new Set([...readFileSync(join(root, d), "utf8").matchAll(/\bscripts\/([\w.-]+\.(?:mjs|cjs|js|sh|py))\b/g)].map((x) => x[1])))
    if (!existsSync(join(scriptDir, m))) errs.push(`${d}: references scripts/${m} but skills/ux-doctor/scripts/${m} does not exist`); }
// regression tests for the bundled scripts (each runs in well under a second)
const run = (script, args) => spawnSync(process.execPath, [join(scriptDir, script), ...args], { encoding: "utf8", timeout: 10000, cwd: root });
const fixture = join(root, "reference/fixtures/dup-cta.html");
if (!existsSync(join(scriptDir, "cta-scan.mjs")) || !existsSync(fixture)) errs.push("cta-scan.mjs or reference/fixtures/dup-cta.html missing");
else { const r = run("cta-scan.mjs", [fixture, "--base", "https://example.com/", "--json"]); let j = null; try { j = JSON.parse(r.stdout); } catch {}
  if (r.status !== 1) errs.push(`cta-scan on dup-cta.html: expected exit 1, got ${r.status} ${r.stderr.slice(0, 200)}`);
  else if (!j?.flags?.some((f) => f.flag === "DUP_IN_VIEWPORT" && f.hint === "major")) errs.push("cta-scan on dup-cta.html: no DUP_IN_VIEWPORT flag with hint major"); }
{ const bad = rules.filter((r) => !/^(p\.\d[^\n]*|web:[a-z0-9-]+)$/.test(String(r.citation ?? ""))); // citation token: starts with p.<digit> (page list, may add "reaffirmed p.N") or is exactly web:<slug> (url and "no page" live elsewhere)
  if (bad.length) errs.push(`rules.json: ${bad.length} citation(s) not matching p.N / web:<slug>: ${bad.slice(0, 8).map((r) => `${r.id}="${r.citation}"`).join(", ")}${bad.length > 8 ? ", ..." : ""}`); }
const single = join(root, "reference/fixtures/single-section-dup.html");
if (!existsSync(join(scriptDir, "cta-scan.mjs"))) { /* reported above */ }
else {
  const m = run("cta-scan.mjs", [join(root, "reference/fixtures/no-such-file.html")]); if (m.status !== 2) errs.push(`cta-scan on a missing file: expected exit 2, got ${m.status}`);
  const u = run("cta-scan.mjs", ["http://127.0.0.1:9/"]); if (u.status !== 2) errs.push(`cta-scan on an unreachable port (static): expected exit 2, got ${u.status}`);
  if (!existsSync(single)) errs.push("reference/fixtures/single-section-dup.html missing");
  else { const r = run("cta-scan.mjs", [single, "--json"]); let j = null; try { j = JSON.parse(r.stdout); } catch {}
    if (r.status !== 1 || !j?.flags?.some((f) => f.flag === "DUP_IN_VIEWPORT")) errs.push(`cta-scan on single-section-dup.html: expected exit 1 with a DUP_IN_VIEWPORT flag, got exit ${r.status} ${r.stderr.slice(0, 200)}`); } }
{ const slop = join(root, "reference/fixtures/ai-slop.html"), plain = join(root, "reference/fixtures/plain-landing.html");
  if (!existsSync(join(scriptDir, "slop-scan.mjs")) || !existsSync(slop) || !existsSync(plain)) errs.push("slop-scan.mjs or reference/fixtures/{ai-slop,plain-landing}.html missing");
  else { const r = run("slop-scan.mjs", [slop, "--json"]); let j = null; try { j = JSON.parse(r.stdout); } catch {}
    if (r.status !== 1 || j?.tier !== "high") errs.push(`slop-scan on ai-slop.html: expected exit 1 and tier high, got exit ${r.status} tier ${j?.tier} ${r.stderr.slice(0, 200)}`);
    for (const id of new Set((j?.flags ?? []).flatMap((f) => f.rules))) if (!ids.has(id)) errs.push(`slop-scan cites unknown rule ${id}`);
    const c = run("slop-scan.mjs", [plain]); if (c.status !== 0) errs.push(`slop-scan on plain-landing.html: expected exit 0 (no tells), got ${c.status}`);
    const m = run("slop-scan.mjs", [join(root, "reference/fixtures/no-such-file.html")]); if (m.status !== 2) errs.push(`slop-scan on a missing file: expected exit 2, got ${m.status}`); } }
if (!existsSync(join(scriptDir, "contrast.mjs"))) errs.push("contrast.mjs missing");
else { const a = run("contrast.mjs", ["rgba(0,0,0,.2)", "#fff"]); if (a.status !== 2) errs.push(`contrast rgba without --over: expected exit 2, got ${a.status}`);
  const b = run("contrast.mjs", ["rgba(0,0,0,.2)", "#fff", "--over", "#fff"]); let j = null; try { j = JSON.parse(b.stdout); } catch {}
  if (![0, 1].includes(b.status) || typeof j?.ratio !== "number") errs.push(`contrast --over: expected exit 0/1 and a numeric ratio, got exit ${b.status} ${b.stderr.slice(0, 200)}`);
  const c = run("contrast.mjs", ["#626262", "#fff"]); if (c.status !== 0 || !/"ratio":6\.1\b/.test(c.stdout)) errs.push("contrast #626262/#fff: expected exit 0 and ratio 6.1"); }
if (!existsSync(join(scriptDir, "rule.mjs"))) errs.push("rule.mjs missing");
else { const a = run("rule.mjs", ["F-06"]); if (a.status !== 0 || !a.stdout.includes("F-06")) errs.push(`rule.mjs F-06: expected exit 0 and output containing F-06, got exit ${a.status}`);
  const b = run("rule.mjs", ["zzzz-nomatch"]); if (b.status !== 1) errs.push(`rule.mjs zzzz-nomatch: expected exit 1, got ${b.status}`); }
// Versioning: package.json is the source of truth; manifests must match, be valid semver, and have a CHANGELOG entry.
{
  const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/; // semver.org official regex
  const v = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  if (!SEMVER.test(v ?? "")) errs.push(`package.json: invalid semver "${v}"`);
  for (const m of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
    const mv = JSON.parse(readFileSync(join(root, m), "utf8")).version;
    if (mv !== v) errs.push(`${m}: version "${mv}" != package.json "${v}" (run npm run build)`);
  }
  const cl = existsSync(join(root, "CHANGELOG.md")) ? readFileSync(join(root, "CHANGELOG.md"), "utf8") : "";
  if (!cl.split("\n").some((l) => l === `## [${v}]` || l.startsWith(`## [${v}] `))) errs.push(`CHANGELOG.md: missing "## [${v}]" section`);
}
console.log(`skills ${skills.length}, commands ${cmds.length}, rules ${rules.length}`);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("ok");
