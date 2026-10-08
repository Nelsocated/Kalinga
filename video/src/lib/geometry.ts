import { ease } from "./theme.ts";

export type Box = { x: number; y: number; width: number; height: number };

export const CANVAS = { width: 1080, height: 1350 } as const;
/** The phone viewport the captures are taken at (CSS px). */
export const VIEWPORT = { width: 390, height: 844 } as const;

export const SCALE = 480 / VIEWPORT.width;
const SCREEN_HEIGHT = VIEWPORT.height * SCALE;

/** The phone screen on the canvas: right side, vertically centered; captions use the left. */
export const SCREEN = {
  x: 526,
  y: Math.round((CANVAS.height - SCREEN_HEIGHT) / 2),
  width: 480,
  height: SCREEN_HEIGHT,
  radius: 50,
} as const;

/** CSS px from a capture to px inside the screen. */
export function toScreen(box: Box): Box {
  return { x: box.x * SCALE, y: box.y * SCALE, width: box.width * SCALE, height: box.height * SCALE };
}

/** 0 before start, 1 after start + duration, expo-out in between. */
export function reveal(frame: number, start: number, duration: number): number {
  const t = Math.min(1, Math.max(0, (frame - start) / duration));
  return t === 0 || t === 1 ? t : ease(t);
}
