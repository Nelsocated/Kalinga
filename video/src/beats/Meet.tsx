import { useCurrentFrame } from "remotion";
import { layout } from "../lib/captures";
import { reveal, SCALE, SCREEN } from "../lib/geometry";
import { beat } from "../lib/timeline";
import { ProfileScreen } from "../parts/ProfileScreen";
import { TapMarker } from "../parts/TapMarker";
import { FeedScreen } from "./Watch";

/** Share of the profile's extra height the Meet beat scrolls through. */
export const PROFILE_SCROLL = 0.55;

export function profileExtra() {
  return (layout.profile.height - layout.viewport.height) * SCALE;
}

/** Tap the pet's name, the profile slides in, then a slow scroll over photos and details. */
export function Meet() {
  const frame = useCurrentFrame();
  const slide = reveal(frame, 18, 22);
  const scroll = reveal(frame, 60, 70) * profileExtra() * PROFILE_SCROLL;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-slide * 0.3 * SCREEN.width}px)` }}>
        {/* Carry the clip on from where the Like beat left it */}
        <FeedScreen liked={1} toes={[1, 1, 1]} clipFrom={beat("meet").from} />
        <TapMarker box={layout.feed.name} at={12} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `translateX(${(1 - slide) * SCREEN.width}px)`,
          boxShadow: "-12px 0 24px -12px rgb(4 38 102 / 0.25)",
        }}
      >
        <ProfileScreen scroll={scroll} />
      </div>
    </>
  );
}
