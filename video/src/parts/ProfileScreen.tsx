import { layout } from "../lib/captures";
import { Screen } from "./Screen";
import { PawHeartLike } from "./PawHeartLike";
import { TabBar } from "./TabBar";

/**
 * The full-page pet profile scrolled by `scroll` px, with its like icon drawn already liked
 * (the capture hides it) and the tab bar pinned on top, as on the phone.
 */
export function ProfileScreen({ scroll }: { scroll: number }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-scroll}px)` }}>
        <Screen src="profile.png" />
        <PawHeartLike box={layout.profile.likeIcon} progress={1} toes={[1, 1, 1]} />
      </div>
      <TabBar />
    </>
  );
}
