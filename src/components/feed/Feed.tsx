"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ViewPort from "./ViewPort";
import type { FeedItem } from "@/src/lib/services/feedService";
import type { ShelterMini } from "../layout/RightBar";

type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

type FeedProps = {
  initialMediaId?: string | null;
  onActiveChange?: (
    item: {
      pet_id: string;
      media_id: string | null;
      shelter: ShelterMini | null;
    } | null,
  ) => void;
  onNavChange?: (nav: FeedNav | null) => void;
};

export default function Feed({
  initialMediaId,
  onActiveChange,
  onNavChange,
}: FeedProps) {
  const searchParams = useSearchParams();
  const queryMediaId = searchParams.get("media");
  const targetMediaId = initialMediaId ?? queryMediaId;

  const [items, setItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFetchingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const loadMore = useCallback(
    async (reset = false) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        if (reset) setLoading(true);
        setError(null);

        const excludedIds = reset ? [] : Array.from(seenIdsRef.current);

        const params = new URLSearchParams({
          limit: "10",
          excluded: excludedIds.join(","),
        });
        if (targetMediaId) params.set("media", targetMediaId);

        const res = await fetch(`/api/feed?${params}`, { cache: "no-store" });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to fetch feed");

        const nextItems: FeedItem[] = result.items ?? [];
        nextItems.forEach((item) => seenIdsRef.current.add(item.id));

        if (reset) {
          setItems(nextItems);
          setCurrentIndex(0);
          setHasMore(true);
        } else {
          setItems((prev) => [...prev, ...nextItems]);
        }

        if (nextItems.length < 10) setHasMore(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch feed");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [targetMediaId],
  );

  // Initial load
  useEffect(() => {
    seenIdsRef.current = new Set();
    loadMore(true);
  }, [targetMediaId]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver on sentinel — fires loadMore when bottom is near
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          loadMore(false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items]);

  // IntersectionObserver per item — track which is currently in view
  useEffect(() => {
    if (!items.length) return;

    const observers: IntersectionObserver[] = [];

    items.forEach((_, i) => {
      const el = itemRefs.current[i];
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setCurrentIndex(i);
          }
        },
        {
          root: containerRef.current,
          threshold: 0.6, // item must be 60% visible to count as "active"
        },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  // Notify parent of active item + nav
  useEffect(() => {
    if (!items.length) {
      onActiveChange?.(null);
      onNavChange?.(null);
      return;
    }

    const current = items[currentIndex];
    if (!current) return;

    const videoMedia =
      current.pet_media?.find((m) => m.type === "video") ?? null;

    onActiveChange?.({
      pet_id: current.id,
      media_id: videoMedia?.id ?? null,
      shelter: current.shelter
        ? {
            id: current.shelter.id,
            shelter_name: current.shelter.shelter_name,
            logo_url: current.shelter.logo_url ?? null,
          }
        : null,
    });

    onNavChange?.({
      next: () => {
        const nextEl = itemRefs.current[currentIndex + 1];
        nextEl?.scrollIntoView({ behavior: "smooth" });
      },
      prev: () => {
        const prevEl = itemRefs.current[currentIndex - 1];
        prevEl?.scrollIntoView({ behavior: "smooth" });
      },
      hasNext: currentIndex < items.length - 1,
      hasPrev: currentIndex > 0,
      index: currentIndex,
      total: items.length,
    });
  }, [items, currentIndex, onActiveChange, onNavChange]);

  if (loading && items.length === 0) return null;
  if (error) return <div>{error}</div>;
  if (!items.length) return <div>No feed items found.</div>;

  return (
    <div
      ref={containerRef}
      className="h-[95svh] w-full max-w-[55svh] overflow-y-scroll snap-y snap-mandatory rounded-2xl border-2 bg-black"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="h-[95svh] w-full snap-start snap-always shrink-0"
        >
          <ViewPort item={item} />
        </div>
      ))}

      {/* Sentinel — triggers loadMore when scrolled into view */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {!hasMore && (
        <div className="flex h-20 items-center justify-center text-white/40 text-sm">
          You&apos;ve seen them all 🐾
        </div>
      )}
    </div>
  );
}
