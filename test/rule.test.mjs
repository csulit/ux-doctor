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

test("--json marks the merged ID and keeps live IDs unmarked", () => {
  const r = run("f-10", "E-19", "--json");
  assert.equal(r.status, 0, r.stderr);
  const [a, b] = JSON.parse(r.stdout).rules;
  assert.deepEqual([a.id, a.mergedFrom], ["A-24", "F-10"]);
  assert.equal(b.id, "E-19");
  assert.equal("mergedFrom" in b, false);
});

test("every alias resolves to its owner and none shadows a live ID", () => {
  const ids = new Set(RULES.map((r) => r.id));
  const aliases = RULES.flatMap((r) => (r.aliases || []).map((a) => [a, r.id]));
  assert.ok(aliases.length >= 11);
  for (const [a, owner] of aliases) {
    assert.equal(ids.has(a), false, `${a} is still live`);
    const j = JSON.parse(run(a, "--json").stdout);
    assert.deepEqual([j.rules[0].id, j.rules[0].mergedFrom], [owner, a]);
  }
});

test("an unknown ID still exits 1", () => {
  assert.equal(run("Z-99").status, 1);
});
