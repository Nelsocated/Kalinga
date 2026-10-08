import { Img, staticFile } from "remotion";
import { layout } from "../lib/captures";
import { SCREEN, toScreen } from "../lib/geometry";

/** The phone tab bar cut from profile-top.png, pinned to the bottom while the full-page profile scrolls under it. */
export function TabBar() {
  if (!layout.profile.tabBar) return null;
  const bar = toScreen(layout.profile.tabBar);
  return (
    <div style={{ position: "absolute", left: 0, top: bar.y, width: SCREEN.width, height: bar.height, overflow: "hidden" }}>
      <Img src={staticFile("captures/profile-top.png")} style={{ position: "absolute", left: 0, top: -bar.y, width: SCREEN.width }} />
    </div>
  );
}
