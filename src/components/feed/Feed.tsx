"use client";

import { useEffect, useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🔥 fetch ALL
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (targetMediaId) params.set("media", targetMediaId);

        const res = await fetch(`/api/feed?${params}`);
        const result = await res.json();

        setItems(result.items ?? []);
        setCurrentIndex(0);
      } catch {
        setError("Failed to fetch feed");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [targetMediaId]);

  // 🔥 active tracking
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
          threshold: 0.6,
        },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  // 🔥 nav + active item
  useEffect(() => {
    if (!items.length) return;

    const current = items[currentIndex];
    if (!current) return;

    const videoMedia =
      current.pet_media?.find((m) => m.type === "video") ?? null;

    onActiveChange?.({
      pet_id: current.id,
      media_id: videoMedia?.id ?? null,
      shelter: current.shelter ?? null,
    });

    onNavChange?.({
      next: () => {
        itemRefs.current[currentIndex + 1]?.scrollIntoView({
          behavior: "smooth",
        });
      },
      prev: () => {
        itemRefs.current[currentIndex - 1]?.scrollIntoView({
          behavior: "smooth",
        });
      },
      hasNext: currentIndex < items.length - 1,
      hasPrev: currentIndex > 0,
      index: currentIndex,
      total: items.length,
    });
  }, [items, currentIndex, onActiveChange, onNavChange]);

  if (loading) return null;
  if (error) return <div>{error}</div>;

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
          <ViewPort item={item} isActive={i === currentIndex} />
        </div>
      ))}
    </div>
  );
}
