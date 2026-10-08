import { test } from "node:test";
import assert from "node:assert/strict";
import { CANVAS, SCALE, SCREEN, VIEWPORT, reveal, toScreen } from "./geometry.ts";

test("the screen keeps the phone's aspect ratio and fits the canvas", () => {
  assert.ok(Math.abs(SCREEN.height / SCREEN.width - VIEWPORT.height / VIEWPORT.width) < 0.002);
  assert.ok(SCREEN.x + SCREEN.width <= CANVAS.width - 40);
  assert.ok(SCREEN.y + SCREEN.height <= CANVAS.height - 40);
});

test("toScreen scales CSS pixels into the screen", () => {
  assert.deepEqual(toScreen({ x: 0, y: 0, width: 390, height: 844 }), {
    x: 0,
    y: 0,
    width: SCREEN.width,
    height: 844 * SCALE,
  });
  assert.equal(toScreen({ x: 195, y: 10, width: 10, height: 10 }).x, 240);
});

test("reveal is clamped and eased", () => {
  assert.equal(reveal(0, 10, 20), 0);
  assert.equal(reveal(10, 10, 20), 0);
  assert.equal(reveal(30, 10, 20), 1);
  assert.equal(reveal(99, 10, 20), 1);
  const mid = reveal(20, 10, 20);
  assert.ok(mid > 0.5 && mid < 1, "expo-out is past halfway at the midpoint");
});
