import { useCurrentFrame, useVideoConfig } from "remotion";
import { reveal, SCREEN } from "../lib/geometry";
import { COLORS } from "../lib/theme";

/**
 * One caption per beat, left of the phone; the verb gets the sunshine highlighter.
 * useVideoConfig() inside a Sequence gives that Sequence's length, so it exits before its beat ends.
 */
export function Caption({ verb, rest, fontFamily }: { verb: string; rest: string; fontFamily: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = reveal(frame, 8, 18);
  const mark = reveal(frame, 18, 16);
  const exit = reveal(frame, durationInFrames - 12, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        width: SCREEN.x - 64 - 56,
        top: "50%",
        transform: `translateY(calc(-50% + ${(1 - enter) * 24 - exit * 12}px))`,
        opacity: enter * (1 - exit),
        fontFamily,
        fontWeight: 700,
        fontSize: 68,
        lineHeight: 1.08,
        letterSpacing: "-0.02em",
        color: COLORS.ink,
        textWrap: "balance",
      }}
    >
      <span style={{ position: "relative", display: "inline-block" }}>
        <span
          style={{
            position: "absolute",
            left: -6,
            right: -6,
            bottom: 4,
            height: "42%",
            background: COLORS.sunshine,
            transformOrigin: "left",
            transform: `scaleX(${mark})`,
            borderRadius: 6,
          }}
        />
        <span style={{ position: "relative" }}>{verb}</span>
      </span>{" "}
      {rest}
    </div>
  );
}
