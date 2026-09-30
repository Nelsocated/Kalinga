/**
 * Which feed items are worth mounting around the active one.
 * Only the active item plays; its neighbors preload so swipes feel instant.
 */
export function useFeedWindow(total: number, activeIndex: number, radius = 2) {
  return {
    isMounted: (i: number) =>
      i >= 0 && i < total && Math.abs(i - activeIndex) <= radius,
    shouldPreload: (i: number) => Math.abs(i - activeIndex) <= 1,
  };
}
