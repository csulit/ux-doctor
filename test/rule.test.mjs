import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("../skills/ux-doctor/scripts/rule.mjs", import.meta.url));
const RULES = JSON.parse(readFileSync(new URL("../skills/ux-doctor/references/rules.json", import.meta.url), "utf8"));
const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", timeout: 10000 });

test("a retired ID resolves to the rule it was merged into and says so", () => {
  const r = run("F-13");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^\(F-13 was merged into E-31\)\nE-31 /);
});

test("every alias resolves to its owner in one call, and a live owner ID in the same call stays unmarked", () => {
  const aliases = RULES.flatMap((r) => (r.aliases || []).map((a) => [a, r.id]));
  assert.ok(aliases.length >= 11);
  const [, firstOwner] = aliases[0];
  const r = run(firstOwner, ...aliases.map(([a]) => a.toLowerCase()), "--json");
  assert.equal(r.status, 0, r.stderr);
  const [live, ...merged] = JSON.parse(r.stdout).rules;
  assert.deepEqual([live.id, "mergedFrom" in live], [firstOwner, false]);
  assert.deepEqual(merged.map((x) => [x.mergedFrom, x.id]), aliases);
});

test("text mode notes the merge only above the retired lookup", () => {
  const out = run("E-31", "F-13").stdout;
  assert.equal(out.match(/was merged into/g).length, 1);
  assert.match(out, /^E-31 .*[\s\S]*\(F-13 was merged into E-31\)\nE-31 /);
});

test("an unknown ID still exits 1", () => {
  assert.equal(run("Z-99").status, 1);
});
