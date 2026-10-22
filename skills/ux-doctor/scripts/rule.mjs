#!/usr/bin/env node
// Look up playbook/web rules without opening the whole rules file.
// Usage: node scripts/rule.mjs <ID | tag | keyword...> [--limit 5] [--json]
//   ID       exact rule ID, case-insensitive (F-06, e-22, W2-71); several IDs may be given
//   tag      exact tag (typography, contrast, navigation, ...)
//   keyword  every word must appear in title + rule + auditCheck (case-insensitive)
// Order: playbook rules before web-pattern rules, then best title match, then severity.
// Citation token (field "citation", from rules.json "citation" when present): playbook = p.N, web = web:<slug>.
//   Web rules have no page: the output says "no page" (field pageNote); a "url" is printed only if rules.json carries one.
//   Reads ../references/rules.json.
// Exit 0 = found, 1 = no match, 2 = bad usage or unreadable rules file.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const USAGE = "usage: rule.mjs <ID|tag|keyword...> [--limit 5] [--json]   (e.g. rule.mjs F-06 | rule.mjs contrast | rule.mjs line length)";
const die = (m) => { console.error(m); process.exit(2); };
const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) { console.log(USAGE); process.exit(0); }
let limit = 5, json = false; const words = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--json") json = true;
  else if (argv[i] === "--limit") { limit = Number(argv[++i]); if (!Number.isInteger(limit) || limit < 1) die(`--limit needs a positive integer\n${USAGE}`); }
  else if (/^--[a-z]/.test(argv[i])) die(`unknown option ${argv[i]}\n${USAGE}`);
  else words.push(argv[i]);
}
if (!words.length) die(USAGE);

let rules;
try { rules = JSON.parse(readFileSync(fileURLToPath(new URL("../references/rules.json", import.meta.url)), "utf8")); }
catch (e) { die(`cannot read ../references/rules.json: ${e.message}`); }

const low = (s) => String(s ?? "").toLowerCase();
const cite = (r) => r.source === "web" ? (r.citation || `web:${String(r.pages).replace(/^web:\s*/, "")}`) : (r.citation || `p.${r.pages}`);
const webNote = (r) => (r.source === "web" ? { url: r.url || null, pageNote: "no page" } : {});
const SEV = { critical: 0, high: 1, medium: 2, low: 3 };
let hits = [], by = "";
const ids = words.map(low);
if (ids.every((w) => rules.some((r) => low(r.id) === w))) { by = "id"; hits = ids.map((w) => rules.find((r) => low(r.id) === w)); }
else {
  const tag = low(words.join("-")), tag1 = low(words.join(" ")).replace(/\s+/g, "-");
  const t = words.length === 1 ? [low(words[0])] : [tag, tag1];
  const tagged = rules.filter((r) => (r.tags || []).some((g) => t.includes(low(g))));
  if (tagged.length) { by = "tag"; hits = tagged; }
  else {
    const ws = words.flatMap((w) => low(w).split(/\s+/)).filter(Boolean);
    by = "keyword";
    hits = rules.filter((r) => { const h = low(`${r.title} ${r.rule} ${r.auditCheck}`); return ws.every((w) => h.includes(w)); });
    const score = (r) => ws.filter((w) => low(r.title).includes(w)).length;
    hits.sort((a, b) => score(b) - score(a)); // stable: keeps file order otherwise
  }
}
if (by !== "id") hits = hits.map((r, i) => [r, i]).sort(([a, i], [b, j]) => ((a.source === "playbook" ? 0 : 1) - (b.source === "playbook" ? 0 : 1)) || (by === "tag" ? (SEV[a.severity] ?? 9) - (SEV[b.severity] ?? 9) : 0) || i - j).map(([r]) => r);
if (!hits.length) { console.error(`no rule matches "${words.join(" ")}" (tried ID, tag, keyword)`); process.exit(1); }
const total = hits.length, shown = by === "id" ? hits : hits.slice(0, limit);
if (json) console.log(JSON.stringify({ matchedBy: by, total, rules: shown.map((r) => ({ id: r.id, title: r.title, citation: cite(r), ...webNote(r), severity: r.severity, tags: r.tags, rule: r.rule, doDont: r.doDont, auditCheck: r.auditCheck, restyleFix: r.restyleFix })) }, null, 1));
else {
  for (const r of shown) console.log(`${r.id}  ${r.title}\n  cite: ${cite(r)} | severity: ${r.severity} | tags: ${(r.tags || []).join(", ")}\n${r.source === "web" ? `  no page${r.url ? ` | url: ${r.url}` : ""}\n` : ""}  rule: ${r.rule}\n  do/don't: ${r.doDont}\n  audit: ${r.auditCheck}\n  restyle: ${r.restyleFix}\n`);
  if (total > shown.length) console.log(`(${total - shown.length} more match by ${by}; raise --limit or narrow the query)`);
}
