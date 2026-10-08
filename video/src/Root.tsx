import { Composition } from "remotion";
import { Tour } from "./Tour";
import { CANVAS } from "./lib/geometry";
import { FPS, TOTAL_FRAMES } from "./lib/timeline";

export const Root = () => (
  <Composition id="Tour" component={Tour} durationInFrames={TOTAL_FRAMES} fps={FPS} width={CANVAS.width} height={CANVAS.height} />
);
