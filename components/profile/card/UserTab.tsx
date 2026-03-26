"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import at_play from "@/public/tabs/at_play.svg";
import at_home from "@/public/tabs/at_home.svg";
import at_pet from "@/public/tabs/at_pet.svg";
import play from "@/public/tabs/play.svg";
import home from "@/public/tabs/home.svg";
import pet from "@/public/tabs/pet.svg";

import type { LikedMiniItem, LikedKind } from "@/lib/services/likeService";

import VideoCard from "@/components/cards/VideoCard";
import PetCard from "@/components/cards/PetCard";
import ShelterCard from "@/components/cards/ShelterCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import { param, video } from "framer-motion/client";

export type TabsKey = "videos" | "pets" | "shelters";

const TAB_META = {
  videos: {
    icon: play,
    iconActive: at_play,
    alt: "play",
    altActive: "at-play",
  },
  shelters: {
    icon: home,
    iconActive: at_home,
    alt: "home",
    altActive: "at-home",
  },
  pets: {
    icon: pet,
    iconActive: at_pet,
    alt: "pet",
    altActive: "at-pet",
  },
} satisfies Record<
  TabsKey,
  {
    icon: typeof play;
    iconActive: typeof play;
    alt: string;
    altActive: string;
  }
>;

const ITEMS_PER_BATCH = 10;

function buildVideoHref(videoId: string, petId?: string | null) {
  const params = new URLSearchParams();

  if (petId) {
    params.set("pets", petId);
    return `/site/profiles/pets/?${params.toString()}`;
  }

  params.set("media", videoId);
  return `/site/home/?${params.toString()}`;
}

function toPetGender(value?: string | null): "male" | "female" {
  return value === "female" ? "female" : "male";
}

async function fetchLikedStuff(): Promise<LikedMiniItem[]> {
  const res = await fetch("/api/likes/me", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch liked items");
  }

  return res.json();
}

export default function UserTab() {
  const tabs: TabsKey[] = ["videos", "pets", "shelters"];
  const [tab, setTab] = useState<TabsKey>("videos");
  const [likedItems, setLikedItems] = useState<LikedMiniItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      try {
        const res = await fetchLikedStuff();
        if (!alive) return;
        setLikedItems(res ?? []);
      } catch (error) {
        console.error(error);
        if (!alive) return;
        setLikedItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [tab]);

  const filtered = useMemo(() => {
    const kind: LikedKind =
      tab === "videos" ? "video" : tab === "pets" ? "pet" : "shelter";

    return likedItems.filter((item) => item.kind === kind);
  }, [tab, likedItems]);

  const hasMore = visibleCount < filtered.length;

  const visibleItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const loadMore = () => {
    setVisibleCount((count) =>
      Math.min(count + ITEMS_PER_BATCH, filtered.length),
    );
  };

  useEffect(() => {
    if (!hasMore || !scrollRef.current || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="min-h-0 pr-7">
      <div className="flex min-h-0 flex-col rounded-[15px] bg-white">
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="flex items-center gap-20">
            {tabs.map((key) => {
              const active = tab === key;
              const meta = TAB_META[key];

              return (
                <TabButton
                  key={key}
                  active={active}
                  onClick={() => setTab(key)}
                >
                  <Image
                    src={active ? meta.iconActive : meta.icon}
                    alt={active ? meta.altActive : meta.alt}
                  />
                </TabButton>
              );
            })}
          </div>
        </div>

        <div className="px-4">
          <hr className="border-black/10" />
        </div>

        <div ref={scrollRef} className="mt-3 min-h-0 flex-1 px-4 pr-1">
          {loading ? (
            <div className="rounded-[15px] border border-black/10 bg-white p-6 text-center text-sm opacity-60">
              Loading...
            </div>
          ) : null}

          {(tab === "videos" || tab === "pets") && visibleItems.length > 0 ? (
            <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {visibleItems.map((item) =>
                tab === "videos" ? (
                  <VideoCard
                    key={`video-${item.id}`}
                    href={buildVideoHref(item.id, item.petId)}
                    thumbnailUrl={item.thumbnailUrl ?? item.imageUrl}
                    subtitle={
                      item.subtitle ?? item.caption ?? "Unknown Shelter"
                    }
                    petName={item.petName ?? item.title ?? "Unknown Pet"}
                  />
                ) : (
                  <PetCard
                    key={`pet-${item.id}`}
                    href={`/site/profiles/pets/${item.id}`}
                    imageUrl={item.imageUrl}
                    petName={item.petName ?? item.title ?? "Unknown Pet"}
                    sex={toPetGender(item.gender)}
                    shelterName={item.shelterName ?? "Unknown Shelter"}
                    shelterLogo={item.shelterLogo ?? DEFAULT_AVATAR_URL}
                  />
                ),
              )}
            </div>
          ) : null}

          {tab === "shelters" && visibleItems.length > 0 ? (
            <div className="space-y-3">
              {visibleItems.map((item) => (
                <ShelterCard
                  key={`shelter-${item.id}`}
                  href={item.href ?? `/site/profiles/shelter/${item.id}`}
                  imageUrl={item.imageUrl}
                  name={item.title ?? "Unknown Shelter"}
                  location={item.subtitle ?? "Unknown location"}
                  id={item.id}
                  petsAvailable={item.petsAvailable}
                  petsAdopted={item.petsAdopted}
                />
              ))}
            </div>
          ) : null}

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="mt-4 rounded-[15px] border border-black/10 bg-white p-4 text-center text-xs opacity-60"
            >
              Loading more...
            </div>
          ) : null}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-[15px] border border-black/10 bg-white p-6 text-center text-sm opacity-60">
              No items yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}
