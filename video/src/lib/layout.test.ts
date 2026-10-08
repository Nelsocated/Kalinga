import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLayout } from "./layout.ts";

const box = { x: 10, y: 20, width: 30, height: 40 };
const good = {
  viewport: { width: 390, height: 844 },
  feed: { video: box, likeIcon: box, name: box },
  profile: { height: 2400, apply: box, likeIcon: box, tabBar: null },
  apply: { fields: [box, box, box, box] },
  thread: { bubble: box },
};

test("accepts a complete layout", () => {
  assert.deepEqual(parseLayout(good), good);
});

test("rejects a capture taken at another viewport", () => {
  assert.throws(() => parseLayout({ ...good, viewport: { width: 1440, height: 900 } }), /390x844/);
});

test("rejects missing or empty boxes with the path in the message", () => {
  assert.throws(() => parseLayout({ ...good, feed: { ...good.feed, likeIcon: undefined } }), /feed\.likeIcon/);
  assert.throws(
    () => parseLayout({ ...good, thread: { bubble: { ...box, width: 0 } } }),
    /thread\.bubble/,
  );
});

test("needs the profile's like icon so the video can show it liked", () => {
  assert.throws(() => parseLayout({ ...good, profile: { ...good.profile, likeIcon: undefined } }), /profile\.likeIcon/);
});

test("needs exactly four form fields", () => {
  assert.throws(() => parseLayout({ ...good, apply: { fields: [box] } }), /apply\.fields/);
});
