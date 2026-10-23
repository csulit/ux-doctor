// slop-scan: fixtures, exit codes and fuzzing via the CLI.
// Invariants: the AI-look fixture trips every line-based tell; the plain fixture trips none; any input exits 0, 1 or 2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, symlinkSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import fc from "fast-check";

const SCRIPT = fileURLToPath(new URL("../skills/ux-doctor/scripts/slop-scan.mjs", import.meta.url));
const FIX = (n) => fileURLToPath(new URL(`../reference/fixtures/${n}`, import.meta.url));
const run = (args, input) => spawnSync(process.execPath, [SCRIPT, ...args, "--timeout", "10"], { input, encoding: "utf8", timeout: 20000 });
const json = (r) => JSON.parse(r.stdout);
const ok = (r) => r.error == null && [0, 1, 2].includes(r.status) && !/at .*\.mjs:\d+/.test(r.stderr);

test("AI-look fixture: exit 1, tier high, every static tell found, W5-04 listed apart as a defect", () => {
  const r = run([FIX("ai-slop.html"), "--json"]);
  assert.equal(r.status, 1, r.stderr);
  const j = json(r);
  assert.equal(j.tier, "high");
  const found = new Set(j.flags.map((f) => f.tell));
  for (const t of ["GRADIENT_TEXT", "BLUR_BLOB", "PURPLE_GRADIENT", "BUZZWORD_COPY", "TRUSTED_BY_COUNT", "SCROLL_REVEAL",
    "ACCENT_WORD", "EYEBROW_LABEL", "ARROW_LABELS", "EDGE_STRIPE", "EMOJI_ICONS", "ICON_TILE", "DEFAULT_KIT_THEME"]) assert.ok(found.has(t), `missing ${t}`);
  assert.equal(j.tells, j.flags.length);
  assert.deepEqual(j.defects.map((d) => d.tell), ["HIDDEN_UNTIL_SCROLL"]);
  for (const f of [...j.flags, ...j.defects]) assert.ok(f.rules.every((id) => /^(W1-8[0-4]|W5-\d\d)$/.test(id)), `${f.tell} cites ${f.rules}`);
});

test("a lone hidden-until-scroll section exits 1 as a defect, not a general-practice note", () => {
  const j = json(run(["-", "--json"], '<section data-aos="fade-up"><h2>Pricing</h2></section>'));
  assert.equal(j.tells, 0);
  assert.equal(j.defects[0].tell, "HIDDEN_UNTIL_SCROLL");
  assert.match(j.defects[0].note, /score it on its own/);
  assert.equal(run(["-"], '<section data-aos="fade-up"><h2>Pricing</h2></section>').status, 1);
});

test("--list names every tell with rule IDs and exits 0", () => {
  const r = run(["--list"]);
  assert.equal(r.status, 0, r.stderr);
  const l = JSON.parse(r.stdout);
  assert.ok(l.length >= 15 && l.every((t) => t.rules.length && t.rules.every((id) => /^W\d-\d\d$/.test(id))));
});

test("line numbers survive long minified lines; content past 2000 characters is still scanned", () => {
  const svg = "<svg>" + "<path d=\"M0 0\"/>".repeat(300) + "</svg>";
  const css = "<style>" + ".a{color:red}".repeat(400) + ".t{-webkit-background-clip:text}</style>";
  const j = json(run(["-", "--json"], [svg, css, "<p>ok</p>", "<h1 class=\"bg-clip-text text-transparent\">x</h1>"].join("\n")));
  const g = j.flags.find((f) => f.tell === "GRADIENT_TEXT");
  assert.deepEqual(g.where.map((w) => w.line), [2, 4]);
});

test("eyebrows with Tailwind arbitrary values count", () => {
  const html = Array.from({ length: 3 }, (_, i) => `<p class="uppercase tracking-[0.2em] text-[11px]">Label ${i}</p>`).join("\n");
  assert.ok(json(run(["-", "--json"], html)).flags.some((f) => f.tell === "EYEBROW_LABEL"));
});

test("a self-closing <Card /> inside a <Card> is nesting", () => {
  assert.ok(json(run(["-", "--json"], "<Card>\n  <Card />\n</Card>")).flags.some((f) => f.tell === "NESTED_CARD"));
  assert.equal(run(["-"], "<Card />\n<Card>x</Card>").status, 0);
});

test("an unreadable file exits 2 without a stack trace", { skip: process.platform === "win32" || process.getuid?.() === 0 }, () => {
  const d = mkdtempSync(join(tmpdir(), "slop-scan-"));
  try { const f = join(d, "locked.html"); writeFileSync(f, "<p>x</p>"); chmodSync(f, 0o000);
    const r = run([f]); assert.equal(r.status, 2); assert.ok(ok(r), r.stderr); assert.match(r.stderr, /cannot read/);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test("plain fixture: Inter, a rounded quote with a left border and real copy are not tells", () => {
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
    "<Card><Card /></Card>", // self-closing inner card nests too (also tested alone below)
  ].join("\n");
  const j = json(run(["-", "--json"], src));
  const found = new Set([...j.flags, ...j.defects].map((f) => f.tell));
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
