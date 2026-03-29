// components/profile/ProfileTabsCardShelter.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import at_play from "@/public/tabs/at_play.svg";
import at_pet from "@/public/tabs/at_pet.svg";
import play from "@/public/tabs/play.svg";
import pet from "@/public/tabs/pet.svg";

import VideoCard from "@/components/cards/VideoCard";
import PetCard from "@/components/cards/PetCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

import type {
  ShelterVideoMini,
  ShelterPetMini,
} from "@/lib/services/shelterService";

export type TabsKey = "videos" | "pets";

const TAB_META = {
  videos: {
    icon: play,
    iconActive: at_play,
    alt: "play",
    altActive: "at-play",
  },
  pets: { icon: pet, iconActive: at_pet, alt: "pet", altActive: "at-pet" },
} satisfies Record<TabsKey, any>;

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

type Props = {
  shelterId: string;
  initialVideos: ShelterVideoMini[];
  initialPets: ShelterPetMini[];
};

export default function ShelterTopCard({
  shelterId,
  initialVideos,
  initialPets,
}: Props) {
  const tabs: TabsKey[] = ["videos", "pets"];
  const [tab, setTab] = useState<TabsKey>("videos");

  const [videos] = useState<ShelterVideoMini[]>(initialVideos);
  const [pets] = useState<ShelterPetMini[]>(initialPets);
  const [loading] = useState(false);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

  // IMPORTANT: refetch when shelterId changes

  const list = useMemo(
    () => (tab === "videos" ? videos : pets),
    [tab, videos, pets],
  );
  const hasMore = visibleCount < list.length;
  const visibleItems = useMemo(
    () => list.slice(0, visibleCount),
    [list, visibleCount],
  );

  const loadMore = () =>
    setVisibleCount((c) => Math.min(c + ITEMS_PER_BATCH, list.length));

  useEffect(() => {
    if (!hasMore) return;
    if (!scrollRef.current || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { root: scrollRef.current, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, list.length]);

  return (
    <div className="min-h-0 pr-7">
      <div className="flex min-h-0 flex-col rounded-[15px] bg-white">
        {/* Tabs */}
        <div className="flex flex-col items-center gap-3">
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

        {/* List */}
        <div ref={scrollRef} className="mt-3 min-h-0 flex-1 px-4 pr-1">
          {loading ? (
            <div className="rounded-[15px] border border-black/10 bg-white p-6 text-center text-sm opacity-60">
              Loading...
            </div>
          ) : null}

          {visibleItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 place-items-center gap-6">
              {visibleItems.map((x: any) => {
                if (tab === "videos") {
                  return (
                    <VideoCard
                      key={`posted-video-${x.id}`}
                      href={buildVideoHref(x.id, x.petId ?? x.pet?.id)}
                      thumbnailUrl={x.thumbnailUrl ?? x.imageUrl}
                      subtitle={x.subtitle ?? x.caption ?? "Your shelter"}
                      petName={x.petName ?? x.title ?? "Untitled"}
                    />
                  );
                }

                return (
                  <PetCard
                    key={`posted-pet-${x.id}`}
                    href={`/site/profiles/pets/${x.id}`}
                    imageUrl={x.imageUrl}
                    petName={x.petName ?? x.name ?? "Unnamed Pet"}
                    sex={x.sex ?? "unknown"}
                    shelterName={x.shelterName ?? "Your shelter"}
                    shelterLogo={x.shelterLogo ?? DEFAULT_AVATAR_URL}
                  />
                );
              })}
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

          {!loading && list.length === 0 ? (
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
    <button
      type="button"
      onClick={onClick}
      className={active ? "" : ""}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
