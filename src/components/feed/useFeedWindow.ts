/**
 * Which feed items are worth mounting around the active one.
 * Only the active item loads in full; its neighbors load just their metadata so a swipe
 * starts quickly without downloading videos that may never be watched.
 */
export function useFeedWindow(total: number, activeIndex: number, radius = 2) {
  return {
    isMounted: (i: number) =>
      i >= 0 && i < total && Math.abs(i - activeIndex) <= radius,
    preloadFor: (i: number): "auto" | "metadata" | "none" =>
      i === activeIndex ? "auto" : Math.abs(i - activeIndex) === 1 ? "metadata" : "none",
  };
}
