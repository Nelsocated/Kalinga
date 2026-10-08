/** Copied from src/app/globals.css; theme.test.ts fails if they drift. */
export const COLORS = {
  sunshine: "#f3be0f",
  sunshineDeep: "#d8a90d",
  sunshineSoft: "#fef3b3",
  sunshineWash: "#fff6d6",
  ink: "#042666",
  inkSoft: "#3a4f7a",
  ground: "#fff9ed",
  card: "#fffdf7",
  line: "#efe3c2",
  muted: "#5b6478",
} as const;

/** The site's --ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Solves the cubic bezier for x = t and returns y. */
export function ease(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const [x1, y1, x2, y2] = EASE;
  const bez = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(x1, x2, mid) < t) lo = mid;
    else hi = mid;
  }
  return bez(y1, y2, (lo + hi) / 2);
}
