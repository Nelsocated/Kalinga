import { OffthreadVideo, staticFile } from "remotion";
import { layout } from "../lib/captures";
import { toScreen } from "../lib/geometry";
import { COLORS } from "../lib/theme";
import { Screen } from "../parts/Screen";
import { PawHeartLike } from "../parts/PawHeartLike";

/**
 * The main pet in the feed: its real clip, then the capture on top (its video area is transparent,
 * so the name, caption, rail and tab bar sit over the clip as in the app), then the like icon.
 * `clipFrom` starts the clip partway in, so a later beat that redraws the feed carries on where it was.
 */
export function FeedScreen({ liked = 0, toes = [0, 0, 0], clipFrom = 0 }: { liked?: number; toes?: number[]; clipFrom?: number }) {
  const v = toScreen(layout.feed.video);
  return (
    <>
      <div style={{ position: "absolute", left: v.x, top: v.y, width: v.width, height: v.height, overflow: "hidden", background: COLORS.ink }}>
        <OffthreadVideo src={staticFile("clips/pet.mp4")} muted trimBefore={clipFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Screen src="feed-2.png" />
      <PawHeartLike box={layout.feed.likeIcon} progress={liked} toes={toes} />
    </>
  );
}
