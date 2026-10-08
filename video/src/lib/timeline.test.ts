import { test } from "node:test";
import assert from "node:assert/strict";
import { BEATS, FPS, TOTAL_FRAMES, beatAt } from "./timeline.ts";

test("beats are contiguous and fill the video", () => {
  let next = 0;
  for (const beat of BEATS) {
    assert.equal(beat.from, next, `${beat.id} starts where the previous beat ends`);
    next = beat.from + beat.frames;
  }
  assert.equal(next, TOTAL_FRAMES);
  assert.equal(TOTAL_FRAMES / FPS, 28);
});

test("every captioned beat holds at least 4 seconds", () => {
  for (const beat of BEATS.filter((b) => b.caption)) {
    assert.ok(beat.frames >= 4 * FPS, `${beat.id} is ${beat.frames} frames`);
  }
});

test("captions read as the storyboard says, with no dashes", () => {
  const lines = BEATS.flatMap((b) => (b.caption ? [`${b.caption.verb} ${b.caption.rest}`] : []));
  assert.deepEqual(lines, [
    "Watch short videos of shelter pets",
    "Like the ones you fall for",
    "See their profile and their shelter",
    "Apply to adopt from the profile",
    "Talk with the shelter",
  ]);
  for (const line of lines) assert.doesNotMatch(line, /[–—]/);
});

test("beatAt finds the beat at its edges", () => {
  assert.equal(beatAt(0).id, "watch");
  assert.equal(beatAt(179).id, "watch");
  assert.equal(beatAt(180).id, "like");
  assert.equal(beatAt(TOTAL_FRAMES - 1).id, "close");
  assert.equal(beatAt(TOTAL_FRAMES + 50).id, "close");
});
