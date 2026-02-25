"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PetCard from "./PetCard";

export type FeedItem = {
  id: string;
  name: string;
  created_at: string;
  pet_media: {
    type: "video" | "photo";
    url: string;
    caption: string | null;
  }[];
  shelter: {
    id: string;
    shelter_name?: string | null;
    logo_url?: string | null;
  };
};

type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

export default function Feed({
  onNavReady,
  onActiveChange,
}: {
  onNavReady?: (nav: FeedNav) => void;
  onActiveChange?: (active: { pet_id: string; shelter: FeedItem["shelter"] }) => void;
}) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialPet = searchParams.get("pet");

  const total = items.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const nav = useMemo<FeedNav>(
    () => ({
      next: () => setIndex((i) => Math.min(total - 1, i + 1)),
      prev: () => setIndex((i) => Math.max(0, i - 1)),
      hasNext,
      hasPrev,
      index,
      total,
    }),
    [hasNext, hasPrev, index, total],
  );

  useEffect(() => {
    onNavReady?.(nav);
  }, [nav, onNavReady]);

  useEffect(() => {
    if (!items.length) return;
    if (!initialPet) return;

    const idx = items.findIndex(p => p.id === initialPet);
    if (idx !== -1) setIndex(idx);
  }, [items, initialPet]);

  useEffect(() => {
    const current = items[index];
    if (!current) return;
    onActiveChange?.({ pet_id: current.id, shelter: current.shelter });
  }, [items, index, onActiveChange]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/feed", { cache: "no-store" });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load feed (${res.status}): ${text.slice(0, 120)}`);
        }

        const json = await res.json();
        const nextItems: FeedItem[] = json.items ?? [];

        setItems(nextItems);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (items.length === 0) return <div className="p-6 text-gray-600">No pets yet.</div>;

  const current = items[index];

  return (
    <div className="h-[95svh] aspect-[9/16] w-full max-w-[55svh] rounded-2xl border-2 border-[#ffdd6f] overflow-hidden bg-black">
      <PetCard key={current.id} item={current} />
    </div>
  );
}