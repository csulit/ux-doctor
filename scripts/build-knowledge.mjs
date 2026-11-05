#!/usr/bin/env node
// Builds skills/*/references/* and skills/ux-doctor/references/rules.json from reference/extracted/*.md (the PDF extraction).
// Hand-written files in skills/ux-doctor/references (finding-format.md, rule-tensions.md) are never written or deleted by this script.
// Run: node scripts/build-knowledge.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDirs = [join(root, "reference", "extracted"), join(root, "reference", "extracted-web")];

// section-title regex -> knowledge skill (first match wins)
const MAP = [
  ["ux-web-patterns", /^Web patterns/i],
  ["ux-hierarchy-clarity", /^(Intro|UI design principles overview|Visual hierarchy|Proximity|Clarity|Contrast|Simplicity|Visual cues|Sender representation)/i],
  ["ux-layout-spacing", /^(Alignment|Whitespace|Layout|Balance|Consistency|Bonus tips: whitespace)/i],
  ["ux-depth-craft", /^(Depth and texture|Use shadows|Shadow|Depth through|Borders|Glass|Bonus tips: imagery)/i],
  ["ux-color", /^Color/i],
  ["ux-typography", /^Typography/i],
  ["ux-interaction-cost", /^(Interaction cost|Minimizing interaction)/i],
  ["ux-ui-patterns", /^(Forms|Bonus tips|Expose content|Form fields|Passwords|Destructive|Long text)/i],
];
const TITLES = {
  "ux-web-patterns": "Extended web-pattern reference (lookup only): motion, components, data, overlays, navigation (paraphrased)",
  "ux-hierarchy-clarity": "Visual hierarchy, proximity, clarity, contrast, simplicity, visual cues",
  "ux-layout-spacing": "Alignment, whitespace, layout, balance & harmony, consistency",
  "ux-depth-craft": "Depth & texture: shadows, outlines, borders, glass, imagery",
  "ux-color": "Colour: palette, backgrounds, dark mode, status colours",
  "ux-typography": "Typography: fonts, scale, line-height, contrast, alignment",
  "ux-interaction-cost": "Interaction cost: reducing clicks, effort and friction",
  "ux-ui-patterns": "Component patterns: forms, passwords, dialogs, product pages, mobile, states, navigation",
};

const KINDS = ["check", "default", "principle"];
const rules = [];
const blocks = [];
const numeric = [];
const actionable = (l) => { const c = l.split("|").map((x) => x.trim()); return c.length >= 5 && /\d\s*(px|ms|:1|%|em|rem|ch|pt)\b|\([1-9]00\)|\b1\.\d+\b|#[0-9a-f]{3,6}\b/i.test(c[1]) && !/illustrative|\$|£|reasons|principles/i.test(l) && !/^value$/i.test(c[1]); };
const coverage = [];

for (const [src, f] of srcDirs.filter((d) => existsSync(d)).flatMap((d) => readdirSync(d).filter((n) => n.endsWith(".md")).sort().map((n) => [d, n]))) {
  const text = readFileSync(join(src, f), "utf8");
  const parts = text.split(/^(?=## )/m);
  for (const part of parts) {
    const title = (part.match(/^## (.+)$/m) || [])[1];
    if (!title) continue;
    if (/^Numeric cheat-sheet/i.test(title)) { numeric.push(...part.split("\n").filter(actionable).map((l) => l.replace(/\|\s*([^|]*?)\s*\|\s*$/, `| ${f.match(/^[A-H]/)[0]}: p.$1 |`))); continue; }
    if (/^Page coverage/i.test(title)) { coverage.push(`### ${f}\n\n${part.replace(/^## .+\n/, "").trim()}\n`); continue; }
    const sectionSkill = MAP.find(([, re]) => re.test(title))?.[0];
    if (!sectionSkill) throw new Error(`Unmapped section: "${title}" in ${f}`);
    for (const e of part.split(/^(?=### )/m).filter((x) => x.startsWith("### "))) {
      const h = e.match(/^### ([A-H]-\d+) (.+?)\s+\(p\.([^)]+)\)/) || e.match(/^### (W\d-\d+) (.+?)\s+\(src: ([^)]+)\)/);
      if (!h) throw new Error(`Bad entry heading: ${e.split("\n")[0]}`);
      const field = (n) => (e.match(new RegExp(`- \\*\\*${n}\\*\\*: ([\\s\\S]*?)(?=\\n- \\*\\*|\\n\\n|$)`)) || [])[1]?.trim() ?? "";
      const sev = (e.match(/\*\*Severity\*\*: *(high|medium|low)/) || [])[1];
      const tags = ((e.match(/\*\*Tags\*\*: *\[?([^\]\n]*)\]?/) || [])[1] || "").split(",").map((t) => t.trim()).filter(Boolean);
      const skill = field("Skill") || sectionSkill, kind = field("Kind") || "check", scope = field("Scope");
      if (!TITLES[skill]) throw new Error(`${h[1]}: unknown skill "${skill}"`);
      if (!KINDS.includes(kind)) throw new Error(`${h[1]}: unknown kind "${kind}"`);
      if (tags.length > 2 || tags.includes("craft")) throw new Error(`${h[1]}: at most 2 tags and no "craft" tag`);
      blocks.push({ skill, section: title, text: e.replace(/^- \*\*Skill\*\*: .*\n/m, "").trim() });
      const aliases = field("Also cited as").replace(/\([^)]*\)/g, "").split(/[,;]/).map((x) => (x.trim().match(/^([A-H]-\d{2}|W\d-\d{2})\b/) || [])[1]).filter(Boolean);
      rules.push({ id: h[1], title: h[2], source: h[1].startsWith("W") ? "web" : "playbook", pages: h[3], citation: h[1].startsWith("W") ? `web:${h[3]}` : `p.${h[3]}`, section: title, skill, kind, severity: sev, tags,
        rule: field("Rule"), why: field("Why"), doDont: field("Do / Don't"), auditCheck: field("Audit check"), restyleFix: field("Restyle fix"), ...(scope ? { scope } : {}), ...(aliases.length ? { aliases } : {}) });
    }
  }
}

for (const skill of Object.keys(TITLES)) {
  const dir = join(root, "skills", skill, "references");
  mkdirSync(dir, { recursive: true });
  const mine = rules.filter((r) => r.skill === skill);
  const sections = [...new Set(blocks.filter((b) => b.skill === skill).map((b) => b.section))];
  writeFileSync(join(dir, "rules.md"),
    `# ${TITLES[skill]} — full rule set\n\nSources: The UI/UX Playbook (uxpeak; IDs A-… to H-…, page numbers are PDF pages) and, for W-… IDs, paraphrased tips from public UX pattern pages (cited as web:<slug>, no page; label findings \`source: web\`). Kind: check (yields findings), default (a value to build with), principle (background, never a finding). Generated by scripts/build-knowledge.mjs — do not edit by hand.\n\n` +
    sections.map((s) => `## ${s}\n\n` + blocks.filter((b) => b.skill === skill && b.section === s).map((b) => b.text).join("\n\n")).join("\n\n") + "\n");
  writeFileSync(join(dir, "index.md"),
    `# ${TITLES[skill]} — rule index\n\n| ID | Rule | Page/Src (p.N = playbook PDF page; web:slug = web rule, no page) | Kind | Severity | Tags |\n|---|---|---|---|---|---|\n` +
    mine.map((r) => `| ${r.id} | ${r.title} | ${r.citation} | ${r.kind} | ${r.severity} | ${r.tags.join(", ")} |`).join("\n") + "\n");
}

mkdirSync(join(root, "skills", "ux-doctor", "references"), { recursive: true });
writeFileSync(join(root, "skills", "ux-doctor", "references", "numeric-cheatsheet.md"),
  "# Numeric cheat-sheet (actionable playbook values)\n\nGenerated from the playbook extraction, keeping only values with a unit, ratio, weight or colour (example data and counts are left out). Page numbers = PDF pages. For the one value to build with per property, use `defaults.md`.\n\n| value | applies to | source |\n|---|---|---|\n" + numeric.join("\n") + "\n");
writeFileSync(join(root, "skills", "ux-doctor", "references", "rules.json"), JSON.stringify(rules, null, 1) + "\n");
writeFileSync(join(root, "reference", "page-coverage.md"), "# Page coverage per extractor\n\n" + coverage.join("\n"));
console.log(`rules: ${rules.length}`, Object.fromEntries(Object.keys(TITLES).map((k) => [k, rules.filter((r) => r.skill === k).length])));
