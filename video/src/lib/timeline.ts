export const FPS = 30;

export type BeatId = "watch" | "like" | "meet" | "apply" | "message" | "close";
export type Beat = {
  id: BeatId;
  from: number;
  frames: number;
  caption: { verb: string; rest: string } | null;
};

/** One action per beat; the verb gets the sunshine highlighter. */
export const BEATS: Beat[] = [
  { id: "watch", from: 0, frames: 180, caption: { verb: "Watch", rest: "short videos of shelter pets" } },
  { id: "like", from: 180, frames: 120, caption: { verb: "Like", rest: "the ones you fall for" } },
  { id: "meet", from: 300, frames: 150, caption: { verb: "See", rest: "their profile and their shelter" } },
  { id: "apply", from: 450, frames: 150, caption: { verb: "Apply", rest: "to adopt from the profile" } },
  { id: "message", from: 600, frames: 150, caption: { verb: "Talk", rest: "with the shelter" } },
  { id: "close", from: 750, frames: 90, caption: null },
];

export const TOTAL_FRAMES = BEATS.reduce((sum, beat) => sum + beat.frames, 0);

export function beatAt(frame: number): Beat {
  return BEATS.find((b) => frame >= b.from && frame < b.from + b.frames) ?? BEATS[BEATS.length - 1];
}

export function beat(id: BeatId): Beat {
  return BEATS.find((b) => b.id === id)!;
}
