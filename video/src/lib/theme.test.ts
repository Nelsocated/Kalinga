import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COLORS, ease } from "./theme.ts";

const css = readFileSync(new URL("../../../src/app/globals.css", import.meta.url), "utf8");
const token = (name: string) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];

test("video colors match the site tokens", () => {
  const map: Record<keyof typeof COLORS, string> = {
    sunshine: "sunshine",
    sunshineDeep: "sunshine-deep",
    sunshineSoft: "sunshine-soft",
    sunshineWash: "sunshine-wash",
    ink: "ink",
    inkSoft: "ink-soft",
    ground: "ground",
    card: "card",
    line: "line",
    muted: "muted",
  };
  for (const [key, name] of Object.entries(map)) {
    assert.equal(COLORS[key as keyof typeof COLORS].toLowerCase(), token(name), key);
  }
});

test("ease runs 0 to 1 and front-loads the motion", () => {
  assert.equal(ease(0), 0);
  assert.equal(Math.round(ease(1) * 1000) / 1000, 1);
  assert.ok(ease(0.3) > 0.6);
});
