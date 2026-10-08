import { VIEWPORT, type Box } from "./geometry.ts";

export type Layout = {
  viewport: { width: 390; height: 844 };
  feed: { video: Box; likeIcon: Box; name: Box };
  profile: { height: number; apply: Box; likeIcon: Box; tabBar: Box | null };
  apply: { fields: Box[] };
  thread: { bubble: Box };
};

function assertBox(value: unknown, path: string): asserts value is Box {
  const b = value as Partial<Box> | undefined;
  const ok =
    !!b &&
    [b.x, b.y, b.width, b.height].every((n) => typeof n === "number" && Number.isFinite(n)) &&
    b.width! > 0 &&
    b.height! > 0;
  if (!ok) throw new Error(`layout.json: ${path} is missing or empty; re-run capture`);
}

/** Checks capture/layout.json before the video uses it. */
export function parseLayout(json: unknown): Layout {
  const l = json as Layout;
  if (l?.viewport?.width !== VIEWPORT.width || l.viewport.height !== VIEWPORT.height) {
    throw new Error(`layout.json: captures must be taken at ${VIEWPORT.width}x${VIEWPORT.height}`);
  }
  assertBox(l.feed?.video, "feed.video");
  assertBox(l.feed?.likeIcon, "feed.likeIcon");
  assertBox(l.feed?.name, "feed.name");
  assertBox(l.profile?.apply, "profile.apply");
  assertBox(l.profile?.likeIcon, "profile.likeIcon");
  if (l.profile.tabBar !== null) assertBox(l.profile.tabBar, "profile.tabBar");
  if (!(l.profile.height >= VIEWPORT.height)) throw new Error("layout.json: profile.height is too small");
  if (!Array.isArray(l.apply?.fields) || l.apply.fields.length !== 4) {
    throw new Error("layout.json: apply.fields needs exactly 4 boxes");
  }
  l.apply.fields.forEach((b, i) => assertBox(b, `apply.fields[${i}]`));
  assertBox(l.thread?.bubble, "thread.bubble");
  return l;
}
