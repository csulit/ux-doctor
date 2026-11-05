#!/usr/bin/env node
// Lints audit findings and computes final severities, dimension scores and the grade.
// Usage: node scripts/score.mjs <findings.json | -> [--json]
// Input: { "evidence": "rendered" | "code-only", "notChecked": ["ux-color"], "findings": [ { ...finding } ] }
// Finding: rule (ID or "general practice"), placement ("primary" | "secondary"), title, where, evidence, label, impact, fix,
//   optional: lower (reason for the one-level lowering), contested (true = print a grade range), blocker (reason),
//   advisory (reason), severity (major | minor, general practice only), dimension (general practice and extended web rules).
// Exit 0 = scored, 2 = bad input or lint errors (printed, nothing scored).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const USAGE = "usage: score.mjs <findings.json | -> [--json]";
const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) { console.log(USAGE); process.exit(0); }
const json = argv.includes("--json");
const target = argv.find((a) => !a.startsWith("--"));
const die = (m) => { console.error(m); process.exit(2); };
if (!target) die(USAGE);

let input, rules;
try { input = JSON.parse(readFileSync(target === "-" ? 0 : target, "utf8")); } catch (e) { die(`cannot read findings: ${e.message}`); }
try { rules = JSON.parse(readFileSync(fileURLToPath(new URL("../references/rules.json", import.meta.url)), "utf8")); } catch (e) { die(`cannot read ../references/rules.json: ${e.message}`); }

const DIMENSIONS = ["ux-hierarchy-clarity", "ux-layout-spacing", "ux-depth-craft", "ux-color", "ux-typography", "ux-interaction-cost", "ux-ui-patterns"];
const LEVELS = ["blocker", "major", "minor", "polish", "advisory"];
const POINTS = { blocker: 25, major: 12, minor: 5, polish: 2, advisory: 0 };
const TABLE = { high: { primary: "major", secondary: "major" }, medium: { primary: "major", secondary: "minor" }, low: { primary: "minor", secondary: "polish" } };
const LABELS = /^(verified|measured|inferred)( \(no render\))?$/;
const byId = new Map(rules.map((r) => [r.id, r]));
const alias = new Map(rules.flatMap((r) => (r.aliases || []).map((a) => [a, r.id])));

const findings = Array.isArray(input?.findings) ? input.findings : die("input needs a findings array");
const evidence = input.evidence ?? "rendered";
if (!["rendered", "code-only"].includes(evidence)) die(`evidence must be "rendered" or "code-only", got "${evidence}"`);
const notChecked = new Set(input.notChecked ?? []);
for (const d of notChecked) if (!DIMENSIONS.includes(d)) die(`notChecked: unknown dimension ${d}`);

const errs = [];
const scored = findings.map((f, i) => {
  const at = `finding ${i + 1}${f.title ? ` (${f.title})` : ""}`;
  const err = (m) => errs.push(`${at}: ${m}`);
  for (const k of ["rule", "title", "where", "evidence", "label", "impact", "fix"]) if (!f[k] || typeof f[k] !== "string") err(`missing ${k}`);
  if (f.label && !LABELS.test(f.label)) err(`label must be verified, measured or inferred, got "${f.label}"`);
  if (evidence === "code-only" && f.label === "measured") err(`label "measured" needs a render; the evidence is code-only`);
  let rule = null, dimension = f.dimension;
  if (f.rule === "general practice") {
    if (!f.advisory && !f.blocker && !["major", "minor"].includes(f.severity)) err(`a general-practice finding states its severity (major or minor)`);
    if (!DIMENSIONS.includes(dimension)) err(`a general-practice finding needs a dimension (${DIMENSIONS.join(", ")})`);
  } else if (f.rule) {
    rule = byId.get(f.rule);
    if (!rule && alias.has(f.rule)) err(`${f.rule} was merged into ${alias.get(f.rule)}: cite ${alias.get(f.rule)}`);
    else if (!rule) err(`unknown rule ${f.rule}`);
    else if (rule.kind !== "check") err(`${rule.id} is a ${rule.kind}, not a check: cite the rule that the problem actually breaks`);
    else if (DIMENSIONS.includes(rule.skill)) {
      if (dimension && dimension !== rule.skill) err(`${rule.id} belongs to ${rule.skill}; drop "dimension" or cite a rule of ${dimension}`);
      dimension = rule.skill;
    } else if (!DIMENSIONS.includes(dimension)) err(`${rule.id} is an extended web rule: give the dimension it is scored in (${DIMENSIONS.join(", ")})`);
  }
  if (!f.blocker && !f.advisory && !(f.rule === "general practice") && !["primary", "secondary"].includes(f.placement)) err(`placement must be "primary" (primary flow, above the fold or repeated 3+ times) or "secondary"`);
  if (f.blocker && f.advisory) err("a finding is either a blocker or advisory");
  if (f.lower !== undefined && (typeof f.lower !== "string" || !f.lower.trim())) err("lower needs a one-line reason");
  if (f.lower && f.blocker) err("blockers are not lowered");
  let table;
  if (f.blocker) table = "blocker";
  else if (f.advisory) table = "advisory";
  else if (f.rule === "general practice") table = f.severity;
  else table = rule && TABLE[rule.severity]?.[f.placement];
  const severity = table && f.lower ? LEVELS[Math.min(LEVELS.indexOf(table) + 1, LEVELS.length - 1)] : table;
  return { n: i + 1, ...f, rule: rule?.id ?? f.rule, source: rule?.source ?? "general practice", citation: rule?.citation ?? "", dimension, table, severity };
});
if (errs.length) die(errs.join("\n"));

const grade = (s) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 55 ? "D" : "F");
const score = (useLowering) => {
  const dims = {};
  for (const d of DIMENSIONS) {
    const mine = scored.filter((f) => f.dimension === d);
    if (notChecked.has(d)) { dims[d] = { score: null, note: "n/a — not checked" }; continue; }
    if (evidence === "code-only" && !mine.length && ["ux-hierarchy-clarity", "ux-layout-spacing"].includes(d)) { dims[d] = { score: null, note: "n/a — no render" }; continue; }
    const lost = mine.reduce((s, f) => s + POINTS[useLowering || !f.contested ? f.severity : f.table], 0);
    dims[d] = { score: Math.max(0, 100 - lost), findings: mine.length };
  }
  const vals = Object.values(dims).filter((d) => d.score !== null).map((d) => d.score);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  return { dims, overall, grade: overall === null ? null : grade(overall) };
};
const main = score(true), strict = score(false);
const range = strict.overall !== main.overall ? { low: strict.overall, high: main.overall, grades: `${grade(main.overall)}–${grade(strict.overall)}` } : null;
const counts = Object.fromEntries(LEVELS.map((l) => [l, scored.filter((f) => f.severity === l).length]));
const order = (f) => LEVELS.indexOf(f.severity);
const sorted = [...scored].sort((a, b) => order(a) - order(b) || a.n - b.n);
const out = { evidence, overall: main.overall, grade: main.grade, range, counts, dimensions: main.dims, findings: sorted.map(({ n, rule, citation, source, dimension, table, severity, lower, title }) => ({ n, rule, citation, source, dimension, table, severity, ...(lower ? { lower } : {}), title })) };

if (json) console.log(JSON.stringify(out, null, 1));
else {
  const r = range ? `, range ${range.grades} (${range.low}–${range.high})` : "";
  console.log(`Grade: ${main.grade ?? "n/a"} (${main.overall ?? "n/a"}/100)${r}  ·  ${LEVELS.map((l) => `${l} ${counts[l]}`).join(" · ")}`);
  for (const [d, v] of Object.entries(main.dims)) console.log(`  ${d.padEnd(22)} ${v.score === null ? v.note : `${v.score}  (${v.findings} finding${v.findings === 1 ? "" : "s"})`}`);
  for (const f of out.findings) console.log(`#${f.n} [${f.severity}] ${f.rule}${f.citation ? ` (${f.citation})` : ""}${f.source === "web" ? " source: web" : ""} — ${f.title}${f.lower ? `  (table: ${f.table} — ${f.lower})` : ""}`);
}
