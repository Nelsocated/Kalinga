import { useCurrentFrame } from "remotion";
import { layout } from "../lib/captures";
import { reveal, SCREEN, toScreen } from "../lib/geometry";
import { Screen } from "../parts/Screen";
import { ProfileScreen } from "../parts/ProfileScreen";
import { TapMarker } from "../parts/TapMarker";
import { PROFILE_SCROLL, profileExtra } from "./Meet";

const TAP_AT = 26;
const TYPE_START = 50;
const PER_FIELD = 20;

/** Scroll back up, tap Apply to adopt, the sheet rises, four fields fill in at a calm pace. */
export function Apply() {
  const frame = useCurrentFrame();
  const back = 1 - reveal(frame, 0, 18);
  const sheet = reveal(frame, TAP_AT + 4, 18);
  return (
    <>
      <ProfileScreen scroll={back * profileExtra() * PROFILE_SCROLL} />
      <TapMarker box={layout.profile.apply} at={TAP_AT} />
      <div style={{ position: "absolute", inset: 0, opacity: sheet, transform: `translateY(${(1 - sheet) * 80}px)` }}>
        <Screen src="apply-0.png" />
        {layout.apply.fields.map((field, i) => {
          const s = toScreen(field);
          const typed = reveal(frame, TYPE_START + i * PER_FIELD, PER_FIELD - 4);
          if (typed === 0) return null;
          // The filled capture, revealed left to right inside the field box: reads as typing
          const clip = `inset(${s.y}px ${SCREEN.width - (s.x + s.width * typed)}px ${SCREEN.height - (s.y + s.height)}px ${s.x}px)`;
          return <Screen key={i} src={`apply-${i + 1}.png`} clip={clip} />;
        })}
      </div>
    </>
  );
}
