import type { CSSProperties, ReactNode } from "react";
import { SCREEN } from "../lib/geometry";
import { COLORS } from "../lib/theme";

const BEZEL = 14;

/** A plain rounded phone outline: no notch or fake status bar, the capture shows the real one. */
export function PhoneFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        left: SCREEN.x - BEZEL,
        top: SCREEN.y - BEZEL,
        width: SCREEN.width + BEZEL * 2,
        height: SCREEN.height + BEZEL * 2,
        borderRadius: SCREEN.radius + BEZEL,
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        boxShadow: "0 18px 40px -16px rgb(4 38 102 / 0.28)",
        padding: BEZEL,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: SCREEN.width,
          height: SCREEN.height,
          borderRadius: SCREEN.radius,
          overflow: "hidden",
          background: COLORS.ground,
        }}
      >
        {children}
      </div>
    </div>
  );
}
