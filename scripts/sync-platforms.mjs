#!/usr/bin/env node
// Generates Codex custom-agent TOML (platforms/codex/agents/*.toml) from the canonical agents/*.md.
// Codex has no plugin-distributed agents/commands: copy platforms/codex/agents/* to .codex/agents/ (project) or ~/.codex/agents/.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "platforms", "codex", "agents");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// TOML basic string: escape backslash, quote, control chars.
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
const q = (s) => `"${esc(s)}"`;
const unq = (s) => { try { return s.startsWith('"') ? JSON.parse(s) : s; } catch { return s; } };
for (const f of readdirSync(join(root, "agents")).filter((n) => n.endsWith(".md"))) {
  const m = readFileSync(join(root, "agents", f), "utf8").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${f}: no frontmatter`);
  const fm = Object.fromEntries(m[1].split("\n").map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  const readonly = fm.readonly === "true";
  // multi-line basic string: same escaping, then newlines are literal
  const body = esc(m[2].trim());
  const toml = `name = ${q(unq(fm.name))}\ndescription = ${q(unq(fm.description))}\n${readonly ? 'sandbox_mode = "read-only"\n' : ""}developer_instructions = """\n${body}\n"""\n`;
  writeFileSync(join(out, f.replace(/\.md$/, ".toml")), toml);
  console.log("wrote", join("platforms/codex/agents", f.replace(/\.md$/, ".toml")));
}

// Version: package.json is the single source of truth; mirror it into each plugin manifest (formatting preserved).
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
for (const m of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
  const p = join(root, m), txt = readFileSync(p, "utf8");
  const next = txt.replace(/^(\s*"version":\s*)"[^"]*"/m, `$1${JSON.stringify(version)}`);
  if (next === txt) continue;
  writeFileSync(p, next);
  console.log("synced version", version, "->", m);
}
