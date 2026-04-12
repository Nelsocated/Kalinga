"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import at_play from "@/public/tabs/at_play.svg";
import at_pet from "@/public/tabs/at_pet.svg";
import play from "@/public/tabs/play.svg";
import pet from "@/public/tabs/pet.svg";

import VideoCard from "../cards/VideoCard";
import PetCard from "../cards/PetCard";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";

import type {
  ShelterVideoMini,
  ShelterPetMini,
} from "@/src/lib/types/shelters";

export type TabsKey = "videos" | "pets";

const TAB_META = {
  videos: {
    icon: play,
    iconActive: at_play,
    alt: "play",
    altActive: "at-play",
    label: "Videos",
  },
  pets: {
    icon: pet,
    iconActive: at_pet,
    alt: "pet",
    altActive: "at-pet",
    label: "Pet",
  },
} satisfies Record<
  TabsKey,
  {
    icon: typeof play;
    iconActive: typeof play;
    alt: string;
    altActive: string;
    label: string;
  }
>;

const ITEMS_PER_BATCH = 10;

function buildVideoHref(videoId: string) {
  return `/site/home/pet/${videoId}`;
}

type Props = {
  shelterId: string;
  initialVideos: ShelterVideoMini[];
  initialPets: ShelterPetMini[];
};

export default function ShelterTopCard({ initialVideos, initialPets }: Props) {
  const tabs: TabsKey[] = ["videos", "pets"];
  const [tab, setTab] = useState<TabsKey>("videos");

  const [videos] = useState<ShelterVideoMini[]>(initialVideos);
  const [pets] = useState<ShelterPetMini[]>(initialPets);
  const [loading] = useState(false);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  function handleTabChange(nextTab: TabsKey) {
    setTab(nextTab);
    setVisibleCount(ITEMS_PER_BATCH);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }

  const list = useMemo(
    () => (tab === "videos" ? videos : pets),
    [tab, videos, pets],
  );

  const hasMore = visibleCount < list.length;

  const visibleItems = useMemo(
    () => list.slice(0, visibleCount),
    [list, visibleCount],
  );

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + ITEMS_PER_BATCH, list.length));
  }, [list.length]);

  useEffect(() => {
    if (!hasMore) return;
    if (!scrollRef.current || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root: scrollRef.current, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-0 pr-7">
      <div className="flex min-h-0 flex-col rounded-[15px] bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-start gap-12 sm:gap-16">
            {tabs.map((key) => {
              const active = tab === key;
              const meta = TAB_META[key];

              return (
                <TabButton
                  key={key}
                  active={active}
                  onClick={() => handleTabChange(key)}
                  label={meta.label}
                >
                  <Image
                    src={active ? meta.iconActive : meta.icon}
                    alt={active ? meta.altActive : meta.alt}
                    height={60}
                    width={60}
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

          {visibleItems.length > 0 ? (
            <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {tab === "videos"
                ? (visibleItems as ShelterVideoMini[]).map((x) => (
                    <VideoCard
                      key={`posted-video-${x.id}`}
                      href={buildVideoHref(x.id)}
                      thumbnailUrl={x.thumbnailUrl ?? x.imageUrl}
                      subtitle={x.subtitle ?? x.caption ?? "Your shelter"}
                      petName={x.petName ?? x.title ?? "Untitled"}
                    />
                  ))
                : (visibleItems as ShelterPetMini[]).map((x) => (
                    <PetCard
                      key={`posted-pet-${x.id}`}
                      href={`/site/profiles/pets/${x.id}`}
                      imageUrl={x.imageUrl}
                      petName={x.petName ?? "Unnamed Pet"}
                      sex={x.gender ?? "unknown"}
                      shelterName={x.shelterName ?? "Your shelter"}
                      shelterLogo={x.shelterLogo ?? DEFAULT_AVATAR_URL}
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
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group flex min-w-21 flex-col items-center gap-1 rounded-full px-3",
        "transition-all duration-200 ease-out",
      ].join(" ")}
    >
      <div className="transition-transform duration-200 ease-out group-hover:scale-105">
        {children}
      </div>

      <span
        className={[
          "text-sm font-medium transition-colors duration-200 ease-out",
          active ? "text-primary" : "text-black",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
