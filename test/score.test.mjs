import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("../skills/ux-doctor/scripts/score.mjs", import.meta.url));
const score = (input) => spawnSync(process.execPath, [SCRIPT, "-", "--json"], { encoding: "utf8", input: JSON.stringify(input), timeout: 10000 });
const base = { title: "t", where: "src/a.css · .btn · line 3 @ abc1234", evidence: "e", label: "verified", impact: "i", fix: "f — keeps: x" };

test("severity follows the rule severity × placement table and a lowering drops exactly one level", () => {
  const r = score({ findings: [
    { ...base, rule: "F-09", placement: "secondary" },
    { ...base, rule: "B-15", placement: "primary" },
    { ...base, rule: "B-15", placement: "secondary" },
    { ...base, rule: "B-15", placement: "primary", lower: "passes the project scale" },
  ] });
  assert.equal(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout);
  assert.deepEqual(out.findings.map((f) => [f.n, f.severity]), [[1, "major"], [2, "major"], [3, "minor"], [4, "minor"]]);
  assert.equal(out.dimensions["ux-typography"].score, 88);
  assert.equal(out.dimensions["ux-layout-spacing"].score, 100 - 12 - 5 - 5);
});

test("a contested lowering prints a grade range", () => {
  const r = score({ findings: Array.from({ length: 4 }, () => ({ ...base, rule: "F-06", placement: "primary", lower: "dense tool UI", contested: true })) });
  const out = JSON.parse(r.stdout);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual([out.range.low, out.range.high], [Math.round((6 * 100 + 52) / 7), Math.round((6 * 100 + 80) / 7)]);
});

test("lint rejects merged IDs, principles, missing fields and extended web rules without a dimension", () => {
  const r = score({ findings: [
    { ...base, rule: "W1-12", placement: "primary" },
    { ...base, rule: "A-04", placement: "primary" },
    { ...base, rule: "W1-01", placement: "primary" },
    { rule: "A-07", placement: "primary" },
  ] });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /W1-12 was merged into F-09/);
  assert.match(r.stderr, /A-04 is a principle/);
  assert.match(r.stderr, /W1-01 is an extended web rule/);
  assert.match(r.stderr, /finding 4: missing where/);
});

test("code-only evidence leaves hierarchy and layout unscored when they have no findings", () => {
  const r = score({ evidence: "code-only", findings: [{ ...base, rule: "F-09", placement: "primary", label: "inferred (no render)" }] });
  const out = JSON.parse(r.stdout);
  assert.equal(out.dimensions["ux-hierarchy-clarity"].score, null);
  assert.equal(out.dimensions["ux-layout-spacing"].score, null);
  assert.equal(out.dimensions["ux-color"].score, 100);
});
