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

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const lastTriggeredPage = useRef(0);

  const nextItem = items[currentIndex + 1];

  const loadFeed = useCallback(
    async (pageToLoad: number, reset = false) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const url = `/api/feed?limit=10&page=${pageToLoad}${
          targetMediaId ? `&media=${targetMediaId}` : ""
        }`;

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch feed");
        }

        const nextItems = result.items ?? [];

        if (reset) {
          setItems(nextItems);
          setCurrentIndex(0);
          setHasMore(true);
        } else {
          setItems((prev) => [...prev, ...nextItems]);
        }

        if (nextItems.length < 10) {
          setHasMore(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch feed");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [targetMediaId],
  );

  useEffect(() => {
    setPage(0);
    loadFeed(0, true);
  }, [targetMediaId, loadFeed]);

  useEffect(() => {
    if (page === 0) return;
    loadFeed(page);
  }, [page, loadFeed]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const remaining = items.length - currentIndex;

    if (remaining <= 3 && lastTriggeredPage.current !== page) {
      lastTriggeredPage.current = page;
      setPage((p) => p + 1);
    }
  }, [currentIndex, items.length, hasMore, loading, page]);

  useEffect(() => {
    lastTriggeredPage.current = 0;
  }, [page]);

  useEffect(() => {
    if (loading) return;

    if (!items.length) {
      onActiveChange?.(null);
      onNavChange?.(null);
      return;
    }

    const current = items[currentIndex];
    if (!current) {
      onActiveChange?.(null);
      onNavChange?.(null);
      return;
    }

    const videoMedia =
      current.pet_media?.find((media) => media.type === "video") ?? null;

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
      next: () =>
        setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1)),
      prev: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
      hasNext: currentIndex < items.length - 1,
      hasPrev: currentIndex > 0,
      index: currentIndex,
      total: items.length,
    });
  }, [items, currentIndex, loading, onActiveChange, onNavChange]);

  // =========================
  // ❌ STATES
  // =========================
  if (loading && items.length === 0) return null;
  if (error) return <div>{error}</div>;
  if (!items.length) return <div>No feed items found.</div>;

  // =========================
  // 🎬 UI
  // =========================
  return (
    <div className="h-[95svh] aspect-9/16 w-full max-w-[55svh] overflow-hidden rounded-2xl border-2 bg-black">
      {/* 🔥 PRELOAD NEXT VIDEO */}
      {nextItem?.pet_media?.[0]?.url && (
        <link rel="preload" as="video" href={nextItem.pet_media[0].url} />
      )}

      <ViewPort item={items[currentIndex]} />
    </div>
  );
}
