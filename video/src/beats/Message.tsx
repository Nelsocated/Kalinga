import { useCurrentFrame } from "remotion";
import { layout } from "../lib/captures";
import { reveal, SCREEN, toScreen } from "../lib/geometry";
import { Screen } from "../parts/Screen";

/** The thread with the shelter slides in; the newest message arrives. */
export function Message() {
  const frame = useCurrentFrame();
  const slide = reveal(frame, 0, 22);
  const arrive = reveal(frame, 55, 20);
  const b = toScreen(layout.thread.bubble);
  const clip = `inset(${b.y - 4}px 0 ${SCREEN.height - (b.y + b.height + 4)}px 0)`;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", transform: `translateX(${(1 - slide) * SCREEN.width}px)` }}>
      <Screen src="thread-before.png" />
      <div style={{ position: "absolute", inset: 0, opacity: arrive, transform: `translateY(${(1 - arrive) * 12}px)` }}>
        <Screen src="thread-after.png" clip={clip} />
      </div>
    </div>
  );
}
