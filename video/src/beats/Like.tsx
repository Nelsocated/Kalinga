import { useCurrentFrame } from "remotion";
import { layout } from "../lib/captures";
import { reveal, SCREEN } from "../lib/geometry";
import { Screen } from "../parts/Screen";
import { TapMarker } from "../parts/TapMarker";
import { FeedScreen } from "./Watch";

const LIKE_TAP = 180 + 24; // 0.8s into the Like beat

/** Frames 0-299 in one piece so the clip never restarts: swipe into the main pet, it plays, then the like lands. */
export function WatchAndLike() {
  const frame = useCurrentFrame();
  const swipe = reveal(frame, 24, 22);
  const liked = reveal(frame, LIKE_TAP + 2, 14);
  const toes = [0, 1, 2].map((i) => reveal(frame, LIKE_TAP + 6 + i * 2, 10));
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - swipe) * SCREEN.height}px)` }}>
        <FeedScreen liked={liked} toes={toes} />
        <TapMarker box={layout.feed.likeIcon} at={LIKE_TAP} />
      </div>
      {swipe < 1 ? <Screen src="feed-1.png" y={-swipe * SCREEN.height} /> : null}
    </>
  );
}
