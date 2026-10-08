import { Img, staticFile } from "remotion";
import { SCREEN } from "../lib/geometry";

/** One capture, drawn at screen width; x/y shift it (slides and scrolls). */
export function Screen({
  src,
  x = 0,
  y = 0,
  opacity = 1,
  clip,
}: {
  src: string;
  x?: number;
  y?: number;
  opacity?: number;
  clip?: string;
}) {
  return (
    <Img
      src={staticFile(`captures/${src}`)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCREEN.width,
        transform: `translate(${x}px, ${y}px)`,
        opacity,
        clipPath: clip,
      }}
    />
  );
}
