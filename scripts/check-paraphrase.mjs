#!/usr/bin/env node
// Dev tool: flags web-pattern entries that copy the source too closely (shared word windows).
// Usage: node scripts/check-paraphrase.mjs [file...]   (defaults to reference/extracted-web/*.md; needs reference/web/source-*.md)
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = 7, MAX = 1; // an entry fails if it shares more than MAX windows of N consecutive words with the source
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9% ]+/g, " ").split(/\s+/).filter(Boolean);
const strip = (s) => s.replace(/`[^`]*`/g, " | ");
const src = norm(readdirSync(join(root, "reference/web")).filter((f) => f.startsWith("source-")).map((f) => readFileSync(join(root, "reference/web", f), "utf8")).map(strip).join(" "));
const grams = new Set(); for (let i = 0; i + N <= src.length; i++) grams.add(src.slice(i, i + N).join(" "));
const files = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(root, "reference/extracted-web")).map((f) => join(root, "reference/extracted-web", f));
let bad = 0, total = 0;
for (const f of files) for (const e of readFileSync(f, "utf8").split(/^### /m).slice(1)) {
  total++;
  const t = norm(e.replace(/\*\*Audit check\*\*[\s\S]*$/m, "").replace(/`[^`]*`/g, " | ")); // audit/restyle lines are our own additions
  let n = 0; for (let i = 0; i + N <= t.length; i++) if (grams.has(t.slice(i, i + N).join(" "))) n++;
  if (n > MAX) { bad++; console.log(`${n}\t${e.split("\n")[0].slice(0, 80)}`); }
}
console.log(`${bad}/${total} entries too close to source`);
process.exit(bad ? 1 : 0);
