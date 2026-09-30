"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PawPrint, PlayCircle } from "@phosphor-icons/react";

import VideoCard from "../cards/VideoCard";
import PetCard from "../cards/PetCard";
import EmptyState from "../ui/EmptyState";
import TabBar, { type TabDef } from "./TabBar";

import type { ShelterVideoMini, ShelterPetMini } from "@/src/lib/types/shelters";

export type TabsKey = "videos" | "pets";

const TABS: TabDef<TabsKey>[] = [
  { key: "videos", label: "Videos", icon: PlayCircle },
  { key: "pets", label: "Pets", icon: PawPrint },
];

const ITEMS_PER_BATCH = 12;

type Props = {
  shelterId: string;
  initialVideos: ShelterVideoMini[];
  initialPets: ShelterPetMini[];
};

/** A shelter's posted videos and pets. */
export default function ShelterTab({ initialVideos, initialPets }: Props) {
  const [tab, setTab] = useState<TabsKey>("videos");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const list = tab === "videos" ? initialVideos : initialPets;
  const hasMore = visibleCount < list.length;
  const visibleItems = useMemo(() => list.slice(0, visibleCount), [list, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + ITEMS_PER_BATCH, list.length));
  }, [list.length]);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), {
      rootMargin: "300px",
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  function changeTab(next: TabsKey) {
    setTab(next);
    setVisibleCount(ITEMS_PER_BATCH);
  }

  return (
    <section aria-label="Posts" className="flex flex-col gap-5">
      <TabBar tabs={TABS} active={tab} onChange={changeTab} label="Shelter posts" idPrefix="shelter-posts" />

      <div id="shelter-posts-panel" role="tabpanel" aria-labelledby={`shelter-posts-tab-${tab}`}>
        {list.length === 0 ? (
          <EmptyState
            icon={tab === "videos" ? <PlayCircle aria-hidden="true" /> : <PawPrint aria-hidden="true" />}
            title={tab === "videos" ? "No videos yet" : "No pets yet"}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {tab === "videos"
              ? (visibleItems as ShelterVideoMini[]).map((x) => (
                  <li key={`video-${x.id}`}>
                    <VideoCard
                      href={`/site/home/pet/${x.id}`}
                      thumbnailUrl={x.thumbnailUrl ?? x.imageUrl}
                      subtitle={x.subtitle ?? x.caption ?? ""}
                      petName={x.petName ?? x.title ?? "Pet video"}
                    />
                  </li>
                ))
              : (visibleItems as ShelterPetMini[]).map((x) => (
                  <li key={`pet-${x.id}`}>
                    <PetCard
                      href={`/site/profiles/pets/${x.id}`}
                      imageUrl={x.imageUrl}
                      petName={x.petName ?? "Unnamed pet"}
                      sex={x.gender ?? "unknown"}
                      shelterName={x.shelterName ?? undefined}
                      shelterLogo={x.shelterLogo ?? undefined}
                    />
                  </li>
                ))}
          </ul>
        )}

        {hasMore ? <div ref={loadMoreRef} className="h-8" aria-hidden="true" /> : null}
      </div>
    </section>
  );
}
