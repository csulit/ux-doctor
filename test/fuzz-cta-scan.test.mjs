// Property-based fuzzing of the cta-scan HTML/CSS parsers via the CLI (stdin).
// Invariant: for any input the process exits 0, 1 or 2 (never crashes with an uncaught exception or hangs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fc from "fast-check";

const SCRIPT = fileURLToPath(new URL("../skills/ux-doctor/scripts/cta-scan.mjs", import.meta.url));
const run = (input, args = []) => spawnSync(process.execPath, [SCRIPT, "-", "--timeout", "10", ...args], { input, encoding: "utf8", timeout: 20000 });
const ok = (r) => r.error == null && r.status !== null && [0, 1, 2].includes(r.status) && !/at .*\.mjs:\d+/.test(r.stderr.replace(/^.*cta-scan:.*$/gm, ""));

const frag = fc.oneof(
  fc.constantFrom("<a href=\"/x\">Go</a>", "<button class=\"bg-blue-500\">Buy</button>", "<main>", "</main>", "<header>", "<style>.a{color:red}", "</style>", "&amp;lt;", "&#99999999999;", "&#0;", "<!--", "-->", "<a href=", "\"", "'", "<svg>", "</svg>", "mailto:%E0%A4%A", "<link rel=stylesheet href=../../etc/passwd>"),
  fc.string({ maxLength: 40 }),
);

test("any HTML-ish input does not crash the scanner", () => {
  fc.assert(
    fc.property(fc.array(frag, { maxLength: 30 }).map((a) => a.join("")), (html) => { const r = run(html); assert.ok(ok(r), `status ${r.status}\n${r.stderr}`); }),
    { numRuns: 60 },
  );
});

test("any --filled value is handled without throwing", () => {
  const html = "<main><a class=\"btn-main\" href=\"/a\">A</a></main>";
  fc.assert(
    fc.property(fc.string({ maxLength: 250 }), (v) => { const r = run(html, ["--filled", v]); assert.ok(ok(r), `status ${r.status}\n${r.stderr}`); }),
    { numRuns: 40 },
  );
});

test("regression: unterminated CSS rule terminates (used to loop forever)", () => {
  const r = run("<main><a href=\"/x\" class=\"btn\">A</a><style>.a{color:red}{</style></main>");
  assert.ok(ok(r), `status ${r.status}\n${r.stderr}`);
});
