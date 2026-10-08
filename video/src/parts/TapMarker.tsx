import { useCurrentFrame } from "remotion";
import { reveal, toScreen, type Box } from "../lib/geometry";
import { COLORS } from "../lib/theme";

const SIZE = 56;

/** A finger-sized dot that lands at `at`, then ripples out; shows where the next tap happens. */
export function TapMarker({ box, at }: { box: Box; at: number }) {
  const frame = useCurrentFrame();
  const s = toScreen(box);
  const land = reveal(frame, at - 6, 6);
  const ripple = reveal(frame, at, 14);
  const gone = reveal(frame, at + 10, 8);
  if (frame < at - 6 || gone >= 1) return null;
  const left = s.x + s.width / 2 - SIZE / 2;
  const top = s.y + s.height / 2 - SIZE / 2;
  const ring = { position: "absolute", left, top, width: SIZE, height: SIZE, borderRadius: 999, boxSizing: "border-box" } as const;
  return (
    <>
      <div
        style={{
          ...ring,
          // Light fill plus a soft navy shadow reads on the dark video and on light screens alike
          background: "rgb(255 253 247 / 0.6)",
          border: `2px solid ${COLORS.ink}`,
          boxShadow: "0 2px 12px rgb(4 38 102 / 0.4)",
          opacity: land * (1 - gone),
          transform: `scale(${0.6 + 0.4 * land})`,
        }}
      />
      <div
        style={{
          ...ring,
          border: `2px solid ${COLORS.card}`,
          boxShadow: "0 0 0 1px rgb(4 38 102 / 0.35)",
          opacity: (1 - ripple) * 0.8,
          transform: `scale(${1 + ripple * 0.8})`,
        }}
      />
    </>
  );
}
