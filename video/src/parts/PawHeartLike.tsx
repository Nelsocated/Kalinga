import { AS_PAD, HEART_PATH, PAW_VIEWBOX, TOE_PATHS } from "../../../src/components/ui/pawHeartPaths";
import { toScreen, type Box } from "../lib/geometry";
import { COLORS } from "../lib/theme";

/**
 * The app's like morph driven by numbers: progress 0 is the white outline heart on the video,
 * 1 is the sunshine paw pad; `toes` (0..1 each) pop the three toes in.
 */
export function PawHeartLike({ box, progress, toes }: { box: Box; progress: number; toes: number[] }) {
  const s = toScreen(box);
  const scale = 1 + (AS_PAD.scale - 1) * progress;
  return (
    <svg
      viewBox={PAW_VIEWBOX}
      fill="none"
      style={{ position: "absolute", left: s.x, top: s.y, width: s.width, height: s.height, overflow: "visible" }}
    >
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `translate(${AS_PAD.x * progress}px, ${AS_PAD.y * progress}px) scale(${scale})`,
        }}
      >
        <path d={HEART_PATH} stroke={COLORS.card} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={1 - progress} />
        <path d={HEART_PATH} fill={COLORS.sunshine} stroke={COLORS.sunshineDeep} strokeWidth={2} strokeLinejoin="round" opacity={progress} />
      </g>
      {TOE_PATHS.map((d, i) => (
        <path
          key={d}
          d={d}
          fill={COLORS.sunshine}
          opacity={toes[i]}
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 100%",
            transform: `translateY(${(1 - toes[i]) * 8}px) scale(${0.2 + 0.8 * toes[i]})`,
          }}
        />
      ))}
    </svg>
  );
}
