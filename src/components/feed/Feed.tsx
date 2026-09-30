"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { FilmSlate, WarningCircle } from "@phosphor-icons/react";
import ViewPort from "./ViewPort";
import { useFeedWindow } from "./useFeedWindow";
import FeedSkeleton from "../skeletons/FeedSkeleton";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import { fetchJson } from "@/src/lib/fetchJson";
import type { FeedItem } from "@/src/lib/services/feedService";
import type { ShelterMini } from "../layout/RightBar";

export type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

export type ActiveItem = {
  pet_id: string;
  media_id: string | null;
  shelter: ShelterMini | null;
};

type FeedProps = {
  initialMediaId?: string | null;
  onActiveChange?: (item: ActiveItem | null) => void;
  onNavChange?: (nav: FeedNav | null) => void;
  /** Double-tap on the active video. */
  onDoubleTap?: () => void;
};

export default function Feed({
  initialMediaId,
  onActiveChange,
  onNavChange,
  onDoubleTap,
}: FeedProps) {
  const searchParams = useSearchParams();
  const targetMediaId = initialMediaId ?? searchParams.get("media");
  const reduce = useReducedMotion();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [attempt, setAttempt] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const win = useFeedWindow(items.length, currentIndex);

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams();
    if (targetMediaId) params.set("media", targetMediaId);

    fetchJson<{ data: FeedItem[] }>(`/api/feed?${params}`)
      .then((result) => {
        if (!alive) return;
        setItems(result.data ?? []);
        setCurrentIndex(0);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));

    return () => {
      alive = false;
    };
  }, [targetMediaId, attempt]);

  // One observer for the whole list: the item at least 60% in view is active
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setCurrentIndex(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root, threshold: 0.6 },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // Let the arrow keys work as soon as the feed shows up
  useEffect(() => {
    if (status === "ready") containerRef.current?.focus({ preventScroll: true });
  }, [status]);

  const scrollToIndex = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(i, items.length - 1));
      itemRefs.current[target]?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [items.length, reduce],
  );

  useEffect(() => {
    const current = items[currentIndex];
    if (!current) {
      onActiveChange?.(null);
      onNavChange?.(null);
      return;
    }

    onActiveChange?.({
      pet_id: current.pet_id,
      media_id: current.media_id,
      shelter: current.shelter,
    });

    onNavChange?.({
      next: () => scrollToIndex(currentIndex + 1),
      prev: () => scrollToIndex(currentIndex - 1),
      hasNext: currentIndex < items.length - 1,
      hasPrev: currentIndex > 0,
      index: currentIndex,
      total: items.length,
    });
  }, [items, currentIndex, onActiveChange, onNavChange, scrollToIndex]);

  if (status === "loading") return <FeedSkeleton />;

  if (status === "error") {
    return (
      <EmptyState
        className="h-dvh md:h-[calc(100dvh-4rem)]"
        icon={<WarningCircle aria-hidden="true" />}
        title="Couldn't load videos"
        description="Check your connection and try again."
        action={
          <Button variant="primary" onClick={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        className="h-dvh md:h-[calc(100dvh-4rem)]"
        icon={<FilmSlate aria-hidden="true" />}
        title="No videos yet"
        description="Shelters haven't posted any pet videos. Check back soon."
      />
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Pet videos. Use the up and down arrow keys to move between videos."
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "j") {
          e.preventDefault();
          scrollToIndex(currentIndex + 1);
        }
        if (e.key === "ArrowUp" || e.key === "k") {
          e.preventDefault();
          scrollToIndex(currentIndex - 1);
        }
      }}
      className="h-dvh w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-ink [scrollbar-width:none] md:h-[calc(100dvh-4rem)] md:w-[min(56dvh,480px)] md:rounded-xl"
    >
      {items.map((item, i) => (
        <div
          key={item.media_id}
          ref={(el) => void (itemRefs.current[i] = el)}
          data-index={i}
          className="relative h-full w-full shrink-0 snap-start snap-always"
        >
          {win.isMounted(i) ? (
            <ViewPort
              item={item}
              isActive={i === currentIndex}
              preload={win.shouldPreload(i) ? "auto" : "none"}
              onDoubleTap={onDoubleTap}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
