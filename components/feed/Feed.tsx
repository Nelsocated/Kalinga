"use client";

import { useEffect, useState } from "react";
import ViewPort from "./ViewPort";
import type { FeedItem } from "@/lib/types/feed";
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
  onActiveChange?: (
    item: {
      pet_id: string;
      media_id: string | null;
      shelter: ShelterMini | null;
    } | null,
  ) => void;
  onNavChange?: (nav: FeedNav | null) => void;
};

export default function Feed({ onActiveChange, onNavChange }: FeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadFeed() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/feed?limit=10", {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch feed");
        }

        setItems(result.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch feed");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, []);

  useEffect(() => {
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
  }, [items, currentIndex, onActiveChange, onNavChange]);

  if (loading) return <div>Loading feed...</div>;
  if (error) return <div>{error}</div>;
  if (!items.length) return <div>No feed items found.</div>;

  return (
    <div className="h-[95svh] aspect-9/16 w-full max-w-[55svh] rounded-2xl border-2 overflow-hidden bg-black">
      <ViewPort item={items[currentIndex]} />
    </div>
  );
}
