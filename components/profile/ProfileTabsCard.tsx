// components/profile/ProfileTabsCard.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import likedIcon from "@/public/buttons/Liked.svg";

import at_play from "@/public/tabs/at_play.svg";
import at_home from "@/public/tabs/at_home.svg";
import at_pet from "@/public/tabs/at_pet.svg";
import play from "@/public/tabs/play.svg";
import home from "@/public/tabs/home.svg";
import pet from "@/public/tabs/pet.svg";

import {
  fetchLikedStuff,
  LikedMiniItem,
  LikedKind,
} from "@/lib/services/liked_stuff";

import VideoCard from "@/components/cards/VideoCard";
import PetCard from "@/components/cards/PetCard";
import ShelterCard from "@/components/cards/ShelterCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type TabsKey = "videos" | "pets" | "shelters";

const TAB_META: Record<
  TabsKey,
  { label: string; icon: any; iconActive: any; alt: string; altActive: string }
> = {
  videos: {
    label: "Videos",
    icon: play,
    iconActive: at_play,
    alt: "play",
    altActive: "at-play",
  },
  shelters: {
    label: "Shelters",
    icon: home,
    iconActive: at_home,
    alt: "home",
    altActive: "at-home",
  },
  pets: {
    label: "Pets",
    icon: pet,
    iconActive: at_pet,
    alt: "pet",
    altActive: "at-pet",
  },
};

type Props = {
  defaultTab?: TabsKey;
  tabs?: TabsKey[];
  initialLiked?: LikedMiniItem[];
};

const ITEMS_PER_BATCH = 10;

export default function ProfileTabsCard({
  defaultTab = "videos",
  tabs = ["videos", "pets", "shelters"],
  initialLiked = [],
}: Props) {
  const [tab, setTab] = useState<TabsKey>(defaultTab);

  const [likedItems, setLikedItems] = useState<LikedMiniItem[]>(initialLiked);
  const [likedLoading, setLikedLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (loadedOnce) return;
      setLikedLoading(true);
      try {
        const res = await fetchLikedStuff();
        if (!alive) return;
        setLikedItems(res ?? []);
        setLoadedOnce(true);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setLikedItems([]);
        setLoadedOnce(true);
      } finally {
        if (alive) setLikedLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [loadedOnce]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

  const filtered = useMemo(() => {
    const kind: LikedKind =
      tab === "videos" ? "video" : tab === "pets" ? "pet" : "shelter";

    return (likedItems ?? []).filter((x) => x.kind === kind);
  }, [tab, likedItems]);

  const hasMore = visibleCount < filtered.length;

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const loadMore = () => {
    setVisibleCount((c) => Math.min(c + ITEMS_PER_BATCH, filtered.length));
  };

  useEffect(() => {
    if (!hasMore) return;
    if (!scrollRef.current || !loadMoreRef.current) return;

    const rootEl = scrollRef.current;
    const sentinel = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) loadMore();
      },
      {
        root: rootEl,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="h-full pr-7">
      <div className="h-full rounded-2xl bg-[#f6f3ee]">
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="flex items-center gap-2">
            <Image src={likedIcon} alt="liked" />
          </div>

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

        <div
          ref={scrollRef}
          className="mt-3 max-h-[72svh] space-y-3 overflow-auto px-4 pb-4 pr-1"
        >
          {likedLoading ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center text-sm opacity-60">
              Loading likes...
            </div>
          ) : null}

          {/* Cards */}
          {visibleItems.map((x: any) => {
            if (x.kind === "video") {
              return (
                <VideoCard
                  key={`video-${x.id}`}
                  href={x.href ?? `/site/videos/${x.id}`}
                  thumbnailUrl={x.thumbnailUrl ?? x.imageUrl}
                  subtitle={x.subtitle ?? x.caption ?? "Unknown Shelter"}
                  petName={x.petName ?? x.title ?? "Unknown Pet"}
                />
              );
            }

            if (x.kind === "pet") {
              return (
                <PetCard
                  key={`pet-${x.id}`}
                  href={x.href ?? `/site/profiles/pets/${x.id}`}
                  imageUrl={x.imageUrl}
                  petName={x.petName ?? x.title ?? "Unknown Pet"}
                  gender={x.gender ?? "unknown"}
                  shelterName={x.shelterName ?? "Unknown Shelter"}
                  shelterLogo={x.shelterLogo ?? DEFAULT_AVATAR_URL}
                />
              );
            }

            return (
              <ShelterCard
                key={`shelter-${x.id}`}
                href={x.href ?? `/site/profiles/shelter/${x.id}`}
                imageUrl={x.imageUrl}
                name={x.shelterName ?? x.title ?? "Unknown Shelter"}
                location={x.location ?? x.subtitle ?? "Unknown location"}
                rating={x.rating ?? null}
                petsAvailable={x.petsAvailable ?? x.totalAvailable ?? null}
                petsAdopted={x.petsAdopted ?? x.totalAdopted ?? null}
              />
            );
          })}

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="rounded-2xl border border-black/10 bg-white p-4 text-center text-xs opacity-60"
            >
              Loading more...
            </div>
          ) : null}
          {!likedLoading && filtered.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-center text-sm opacity-60">
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
    <button type="button" onClick={onClick} className={active ? "" : ""}>
      {children}
    </button>
  );
}
