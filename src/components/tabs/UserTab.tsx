"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, House, PawPrint, PlayCircle, WarningCircle } from "@phosphor-icons/react";

import type { LikedMiniItem } from "@/src/lib/types/likes";

import VideoCard from "../cards/VideoCard";
import PetCard from "../cards/PetCard";
import ShelterCard from "../cards/ShelterCard";
import EmptyState from "../ui/EmptyState";
import Button, { LinkButton } from "../ui/Button";
import CardGridSkeleton from "../skeletons/CardGridSkeleton";
import TabBar, { type TabDef } from "./TabBar";
import { fetchJson } from "@/src/lib/fetchJson";

export type TabsKey = "videos" | "pets" | "shelters";
type LikedKind = "video" | "pet" | "shelter";

const TABS: TabDef<TabsKey>[] = [
  { key: "videos", label: "Videos", icon: PlayCircle },
  { key: "pets", label: "Pets", icon: PawPrint },
  { key: "shelters", label: "Shelters", icon: House },
];

const KIND: Record<TabsKey, LikedKind> = { videos: "video", pets: "pet", shelters: "shelter" };

const ITEMS_PER_BATCH = 12;

function toPetGender(value?: string | null): "male" | "female" | "unknown" {
  return value === "female" || value === "male" ? value : "unknown";
}

async function fetchLikedStuff(): Promise<LikedMiniItem[]> {
  const json = await fetchJson<{ data: LikedMiniItem[] }>("/api/likes/me", { cache: "no-store" });
  return json.data;
}

/** The signed-in person's likes, by kind. */
export default function UserTab() {
  const [tab, setTab] = useState<TabsKey>("videos");
  const [likedItems, setLikedItems] = useState<LikedMiniItem[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [attempt, setAttempt] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetchLikedStuff()
      .then((items) => {
        if (!alive) return;
        setLikedItems(items ?? []);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [attempt]);

  const filtered = useMemo(() => likedItems.filter((item) => item.kind === KIND[tab]), [tab, likedItems]);
  const hasMore = visibleCount < filtered.length;
  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + ITEMS_PER_BATCH, filtered.length));
  }, [filtered.length]);

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
    <section aria-label="Your likes" className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-ink">Likes</h2>
      <TabBar tabs={TABS} active={tab} onChange={changeTab} label="Liked items" idPrefix="likes" />

      <div id="likes-panel" role="tabpanel" aria-labelledby={`likes-tab-${tab}`}>
        {status === "loading" ? (
          <CardGridSkeleton count={4} />
        ) : status === "error" ? (
          <EmptyState
            icon={<WarningCircle aria-hidden="true" />}
            title="Couldn't load your likes"
            action={
              <Button
                variant="primary"
                onClick={() => {
                  setStatus("loading");
                  setAttempt((n) => n + 1);
                }}
              >
                Retry
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Heart aria-hidden="true" />}
            title="Nothing liked yet"
            description="Tap the heart on a pet, video or shelter to keep it here."
            action={
              <LinkButton href="/site/home" variant="primary">
                Browse pets
              </LinkButton>
            }
          />
        ) : tab === "shelters" ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {visibleItems.map((item) => (
              <li key={`shelter-${item.id}`}>
                <ShelterCard
                  href={item.href ?? `/site/profiles/shelter/${item.id}`}
                  imageUrl={item.imageUrl}
                  name={item.title ?? "Shelter"}
                  location={item.subtitle}
                  id={item.id}
                  petsAvailable={item.petsAvailable}
                  petsAdopted={item.petsAdopted}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleItems.map((item) => (
              <li key={`${tab}-${item.id}`}>
                {tab === "videos" ? (
                  <VideoCard
                    href={`/site/home/pet/${item.id}`}
                    thumbnailUrl={item.thumbnailUrl ?? item.imageUrl}
                    subtitle={item.subtitle ?? item.caption ?? ""}
                    petName={item.petName ?? item.title ?? "Pet video"}
                  />
                ) : (
                  <PetCard
                    href={`/site/profiles/pets/${item.id}`}
                    imageUrl={item.imageUrl}
                    petName={item.petName ?? item.title ?? "Unnamed pet"}
                    sex={toPetGender(item.gender)}
                    shelterName={item.shelterName ?? undefined}
                    shelterLogo={item.shelterLogo ?? undefined}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {hasMore ? <div ref={loadMoreRef} className="h-8" aria-hidden="true" /> : null}
      </div>
    </section>
  );
}
