import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Rubik";
import { BEATS, beat } from "./lib/timeline";
import { reveal } from "./lib/geometry";
import { COLORS } from "./lib/theme";
import { PhoneFrame } from "./parts/PhoneFrame";
import { Caption } from "./parts/Caption";
import { WatchAndLike } from "./beats/Like";
import { Meet } from "./beats/Meet";
import { Apply } from "./beats/Apply";
import { Message } from "./beats/Message";
import { Close } from "./beats/Close";

const { fontFamily } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });

export function Tour() {
  const frame = useCurrentFrame();
  // The loop seam: frame 0 fades the band and phone in from the same ground the Close beat ends on
  const fadeIn = reveal(frame, 0, 12);
  const meet = beat("meet");
  const apply = beat("apply");
  const message = beat("message");
  const close = beat("close");
  return (
    <AbsoluteFill style={{ background: COLORS.ground }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "38%", background: COLORS.sunshine, opacity: fadeIn }} />
      <PhoneFrame style={{ opacity: fadeIn }}>
        <Sequence from={0} durationInFrames={meet.from} layout="none">
          <WatchAndLike />
        </Sequence>
        <Sequence from={meet.from} durationInFrames={meet.frames} layout="none">
          <Meet />
        </Sequence>
        <Sequence from={apply.from} durationInFrames={apply.frames} layout="none">
          <Apply />
        </Sequence>
        {/* The thread stays on screen while Close fades over everything */}
        <Sequence from={message.from} durationInFrames={message.frames + close.frames} layout="none">
          <Message />
        </Sequence>
      </PhoneFrame>
      {BEATS.map((b) =>
        b.caption ? (
          <Sequence key={b.id} from={b.from} durationInFrames={b.frames}>
            <Caption verb={b.caption.verb} rest={b.caption.rest} fontFamily={fontFamily} />
          </Sequence>
        ) : null,
      )}
      <Sequence from={close.from} durationInFrames={close.frames}>
        <Close />
      </Sequence>
    </AbsoluteFill>
  );
}
