// slop-scan: fixtures, exit codes and fuzzing via the CLI.
// Invariants: the AI-look fixture trips every line-based tell; the plain fixture trips none; any input exits 0, 1 or 2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import fc from "fast-check";

const SCRIPT = fileURLToPath(new URL("../skills/ux-doctor/scripts/slop-scan.mjs", import.meta.url));
const FIX = (n) => fileURLToPath(new URL(`../reference/fixtures/${n}`, import.meta.url));
const run = (args, input) => spawnSync(process.execPath, [SCRIPT, ...args, "--timeout", "10"], { input, encoding: "utf8", timeout: 20000 });
const json = (r) => JSON.parse(r.stdout);
const ok = (r) => r.error == null && [0, 1, 2].includes(r.status) && !/at .*\.mjs:\d+/.test(r.stderr);

test("AI-look fixture: exit 1, tier high, every static tell found", () => {
  const r = run([FIX("ai-slop.html"), "--json"]);
  assert.equal(r.status, 1, r.stderr);
  const j = json(r);
  assert.equal(j.tier, "high");
  const found = new Set(j.flags.map((f) => f.tell));
  for (const t of ["GRADIENT_TEXT", "BLUR_BLOB", "PURPLE_GRADIENT", "BUZZWORD_COPY", "TRUSTED_BY_COUNT", "SCROLL_REVEAL", "HIDDEN_UNTIL_SCROLL",
    "ACCENT_WORD", "EYEBROW_LABEL", "ARROW_LABELS", "EDGE_STRIPE", "EMOJI_ICONS", "ICON_TILE", "DEFAULT_KIT_THEME"]) assert.ok(found.has(t), `missing ${t}`);
  for (const f of j.flags) assert.ok(f.rules.every((id) => /^(W1-8[0-4]|W5-\d\d)$/.test(id)), `${f.tell} cites ${f.rules}`);
});

test("plain fixture: Inter, a quote with a left border and real copy are not tells", () => {
  const r = run([FIX("plain-landing.html"), "--json"]);
  assert.equal(r.status, 0, r.stdout);
  assert.equal(json(r).tells, 0);
});

test("JSX via stdin: nested Card, hidden-until-scroll and accent word across lines", () => {
  const src = [
    "export const A = () => <Card><CardHeader /><Card className=\"p-4\">x</Card></Card>;",
    "<motion.div",
    "  initial={{ opacity: 0, y: 20 }}",
    "  whileInView={{ opacity: 1 }}>",
    "<h2 className=\"text-4xl\">Close books",
    "  <em className=\"font-serif italic\">faster</em></h2>",
    "<Card><Card /></Card>", // self-closing inner card still nests
  ].join("\n");
  const j = json(run(["-", "--json"], src));
  const found = new Set(j.flags.map((f) => f.tell));
  for (const t of ["NESTED_CARD", "HIDDEN_UNTIL_SCROLL", "ACCENT_WORD"]) assert.ok(found.has(t), `missing ${t}`);
});

test("thresholds: two buzzwords and a couple of arrows stay below the line", () => {
  const html = "<p>A seamless setup.</p><p>Effortless export.</p><a href=/a>Docs →</a><a href=/b>API →</a><a href=/c>Blog</a>";
  const r = run(["-", "--json"], html);
  assert.equal(r.status, 0, r.stdout);
  assert.deepEqual(json(r).belowThreshold.map((b) => b.tell).sort(), ["ARROW_LABELS", "BUZZWORD_COPY"]);
});

test("code identifiers and comments are not copy", () => {
  const src = "// seamless effortless supercharge\nconst unlockTheDoor = () => mutex.unlock(); streamline_x(); obj.empower();\n";
  assert.equal(run(["-"], src).status, 0);
});

test("directory walk skips node_modules, hidden dirs, tests and symlinks", () => {
  const d = mkdtempSync(join(tmpdir(), "slop-scan-"));
  try {
    const slop = "<p>Trusted by 10,000+ teams</p>";
    for (const p of ["node_modules/x", ".pi/x", "src"]) mkdirSync(join(d, p), { recursive: true });
    writeFileSync(join(d, "node_modules/x/a.html"), slop);
    writeFileSync(join(d, ".pi/x/a.html"), slop);
    writeFileSync(join(d, "src/a.test.tsx"), slop);
    writeFileSync(join(d, "src/ok.tsx"), "<p>Close the books in three hours</p>");
    writeFileSync(join(d, "outside.txt"), slop); // not a scanned extension; the link below points at it with one
    try { symlinkSync(join(d, "outside.txt"), join(d, "src/link.html")); } catch {} // symlinks may be unavailable (Windows without privilege)
    const r = run([d, "--json"]);
    assert.equal(r.status, 0, r.stdout);
    assert.equal(json(r).filesScanned, 1);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("bad input exits 2", () => {
  assert.equal(run([FIX("no-such-file.html")]).status, 2);
  assert.equal(run([]).status, 2);
  assert.equal(run(["a", "b"]).status, 2);
  assert.equal(run([FIX("ai-slop.html"), "--max-files", "0"]).status, 2);
  assert.equal(run(["http://127.0.0.1:9/"]).status, 2);
});

const frag = fc.oneof(
  fc.constantFrom("<h1>", "</h1>", "<em class=\"italic\">", "<Card>", "</Card>", "<Card/>", "whileInView", "opacity-0", "data-aos=", "→</a>", "✨", "🚀",
    "rounded-full blur-3xl", "border-l-4 border-indigo-500 rounded", "bg-clip-text text-transparent", "uppercase tracking-widest text-xs", "\n", "\r\n",
    "from-indigo-500 to-blue-500", "linear-gradient(", "Trusted by ", "10,000+", "\u{1F600}", "\uD800", "<".repeat(50), "a".repeat(3000)),
  fc.string({ maxLength: 40 }),
);
test("any input exits 0/1/2 without a stack trace or hang", () => {
  fc.assert(fc.property(fc.array(frag, { maxLength: 40 }).map((a) => a.join("")), (s) => { const r = run(["-"], s); assert.ok(ok(r), `status ${r.status}\n${r.stderr}`); }), { numRuns: 60 });
});
