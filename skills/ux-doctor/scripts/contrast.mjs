#!/usr/bin/env node
// WCAG contrast ratio.
// Usage: node scripts/contrast.mjs <fg> <bg> [--large] [--over <opaque-hex>]
//   colours: #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba(), hsl()/hsla()
//   --large        threshold 3:1 instead of 4.5:1
//   --over <hex>   page/surface colour behind a translucent fg or bg: flattens them (bg over <hex>, then fg over
//                  that result) before measuring. Without --over a translucent colour is rejected (exit 2).
// Exit 0 if the pair meets the threshold, 1 if not, 2 on bad input.
const num = (v) => (String(v).endsWith("%") ? parseFloat(v) / 100 : parseFloat(v));
const hslToRgb = (h, s, l) => { h = ((h % 360) + 360) % 360; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map((x) => Math.round(x * 255)); };
// -> { rgb: [0-255 x3], a: 0..1 }
const parse = (s) => {
  const t = String(s).trim();
  let m = t.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (m) return { rgb: m.slice(1, 4).map((v) => Math.min(255, +v)), a: m[4] === undefined ? 1 : Math.min(1, num(m[4])) };
  m = t.match(/^hsla?\(\s*([\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (m) return { rgb: hslToRgb(+m[1], Math.min(100, +m[2]) / 100, Math.min(100, +m[3]) / 100), a: m[4] === undefined ? 1 : Math.min(1, num(m[4])) };
  let h = t.replace(/^#/, "");
  if (/^[0-9a-f]{3,4}$/i.test(h)) h = [...h].map((c) => c + c).join("");
  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h) && (t.startsWith("#") || /^[0-9a-f]+$/i.test(t)))
    return { rgb: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  throw new Error(`Unsupported colour "${s}" (use #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() or hsl()/hsla(); named colours and var() are not resolved)`);
};
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const flatten = (c, under) => ({ rgb: c.rgb.map((v, i) => v * c.a + under.rgb[i] * (1 - c.a)), a: 1 });
const hexOut = (c) => "#" + c.rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const die = (m) => { console.error(m); process.exit(2); };

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) { console.log("usage: contrast.mjs <fg> <bg> [--large] [--over <opaque-hex>]\nexit 0 = passes (4.5:1, or 3:1 with --large), 1 = fails, 2 = bad input"); process.exit(0); }
const large = args.includes("--large");
let over = null; const pos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--large") continue;
  if (args[i] === "--over") { if (args[i + 1] == null) die("--over needs an opaque colour, e.g. --over '#ffffff'"); over = args[++i]; continue; }
  if (/^--[a-z]/.test(args[i])) die(`unknown option ${args[i]}`);
  pos.push(args[i]);
}
const [fg, bg] = pos;
if (pos.length !== 2) die("usage: contrast.mjs <fg> <bg> [--large] [--over <opaque-hex>]");
let ratio, flattened = false, effFg, effBg;
try {
  let f = parse(fg), b = parse(bg);
  if (f.a < 1 || b.a < 1) {
    if (over == null) die(`"${f.a < 1 ? fg : bg}" has alpha < 1: flatten it over its real background first (contrast of a translucent colour is undefined), or pass --over <opaque-hex> with the colour behind it`);
    const o = parse(over);
    if (o.a < 1) die(`--over must be opaque (got "${over}")`);
    b = flatten(b, o); f = flatten(f, b); flattened = true;
  } else if (over != null && parse(over).a < 1) die(`--over must be opaque (got "${over}")`);
  [effFg, effBg] = [f, b];
  const [l1, l2] = [lum(f.rgb), lum(b.rgb)];
  ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
} catch (e) { die(e.message); }
const r = Math.round(ratio * 100) / 100;
console.log(JSON.stringify({ fg, bg, ...(flattened ? { over, flattenedFg: hexOut(effFg), flattenedBg: hexOut(effBg) } : {}), ratio: r, AA_normal: ratio >= 4.5, AA_large: ratio >= 3, AAA_normal: ratio >= 7 }));
process.exit(ratio >= (large ? 3 : 4.5) ? 0 : 1);
