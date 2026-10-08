// Checks the rendered files against the size budget, then copies them into the site.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BUDGET = { "tour.mp4": 3.5e6, "tour-poster.jpg": 200e3 };
const from = (file) => fileURLToPath(new URL(`../out/${file}`, import.meta.url));
const to = fileURLToPath(new URL("../../public/landing/", import.meta.url));

let over = false;
for (const [file, max] of Object.entries(BUDGET)) {
  const size = statSync(from(file)).size;
  const ok = size <= max;
  over ||= !ok;
  console.log(`${ok ? "ok  " : "OVER"} ${file} ${(size / 1e6).toFixed(2)} MB (max ${(max / 1e6).toFixed(2)} MB)`);
}
if (over) {
  console.error("Over budget: raise --crf in package.json (+2) and render again.");
  process.exit(1);
}
mkdirSync(to, { recursive: true });
for (const file of Object.keys(BUDGET)) copyFileSync(from(file), to + file);
console.log("Copied to public/landing/.");
