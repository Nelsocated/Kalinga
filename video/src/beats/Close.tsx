import { Img, staticFile, useCurrentFrame } from "remotion";
import { reveal } from "../lib/geometry";
import { COLORS } from "../lib/theme";

/** Everything fades to the ground, the paw logo shows, then fades so frame 0 follows cleanly. */
export function Close() {
  const frame = useCurrentFrame();
  const out = reveal(frame, 0, 30);
  const logoIn = reveal(frame, 30, 20);
  const logoOut = reveal(frame, 68, 20);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.ground,
        opacity: out,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("logo.svg")} style={{ width: 220, opacity: logoIn * (1 - logoOut), transform: `scale(${0.92 + 0.08 * logoIn})` }} />
    </div>
  );
}
