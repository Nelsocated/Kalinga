"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ViewPort from "./ViewPort";
import type { FeedItem } from "@/lib/services/feedService";
import type { ShelterMini } from "@/components/layout/RightBar";

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

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        setError(null);

        const url = targetMediaId
          ? `/api/feed?limit=10&media=${encodeURIComponent(targetMediaId)}`
          : "/api/feed?limit=10";

        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch feed");
        }

        const nextItems = (result.items ?? []) as FeedItem[];
        setItems(nextItems);

        const foundIndex = targetMediaId
          ? nextItems.findIndex((item) =>
              item.pet_media?.some(
                (media) => media.type === "video" && media.id === targetMediaId,
              ),
            )
          : 0;

        setCurrentIndex(foundIndex >= 0 ? foundIndex : 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch feed");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [targetMediaId]);

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

  if (loading) return null;
  if (error) return <div>{error}</div>;
  if (!items.length) return <div>No feed items found.</div>;

  return (
    <div className="h-[95svh] aspect-9/16 w-full max-w-[55svh] overflow-hidden rounded-2xl border-2 bg-black">
      <ViewPort item={items[currentIndex]} />
    </div>
  );
}
