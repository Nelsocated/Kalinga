"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Pause, Play } from "@phosphor-icons/react";
import Button from "@/src/components/ui/Button";
import PosterVideo from "./PosterVideo";

gsap.registerPlugin(useGSAP);

export type StripVideo = {
  mediaId: string;
  url: string;
  posterUrl: string | null;
  petName: string;
  shelterName: string;
};

const SECONDS_PER_TILE = 4.5;

/**
 * Real feed videos drifting sideways in a seamless loop (the set is rendered twice).
 * Hover, keyboard focus or the Pause button stops it. With reduced motion it stays still
 * and scrolls by hand. Tiles show the pet's photo; a video only plays while hovered.
 */
export default function FilmStrip({ videos }: { videos: StripVideo[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const held = useRef(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  const [canMove, setCanMove] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        setCanMove(true);
        tween.current = gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          duration: videos.length * SECONDS_PER_TILE,
          repeat: -1,
          paused: pausedRef.current,
        });
        const root = scope.current!;
        const hold = () => {
          held.current = true;
          tween.current?.pause();
        };
        const release = () => {
          held.current = false;
          if (!pausedRef.current) tween.current?.resume();
        };
        root.addEventListener("mouseenter", hold);
        root.addEventListener("mouseleave", release);
        root.addEventListener("focusin", hold);
        root.addEventListener("focusout", release);
        return () => {
          root.removeEventListener("mouseenter", hold);
          root.removeEventListener("mouseleave", release);
          root.removeEventListener("focusin", hold);
          root.removeEventListener("focusout", release);
          tween.current = null;
          setCanMove(false);
        };
      });
      return () => mm.revert();
    },
    { scope, dependencies: [videos.length] },
  );

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) tween.current?.pause();
    else if (!held.current) tween.current?.resume();
  }, [paused]);

  if (!videos.length) return null;

  const loop = [...videos, ...videos];

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={scope}
        role="region"
        aria-label="Pet videos from Kalinga shelters"
        className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] motion-safe:overflow-x-hidden"
      >
        <ul ref={track} className="flex w-max gap-3 px-4 sm:gap-4 sm:px-6">
          {loop.map((video, i) => (
            <StripTile key={`${video.mediaId}-${i}`} video={video} duplicate={i >= videos.length} />
          ))}
        </ul>
      </div>

      {canMove ? (
        <div className="mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPaused((p) => !p)}
            icon={paused ? <Play weight="fill" aria-hidden="true" /> : <Pause weight="fill" aria-hidden="true" />}
            className="border-ink/10"
          >
            {paused ? "Play strip" : "Pause strip"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function StripTile({ video, duplicate }: { video: StripVideo; duplicate: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li aria-hidden={duplicate || undefined} className="shrink-0">
      <Link
        href={`/site/home/pet/${video.mediaId}`}
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`Watch ${video.petName} from ${video.shelterName}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block aspect-9/16 w-40 overflow-hidden rounded-lg bg-ink transition-shadow duration-300 ease-out-expo hover:shadow-float sm:w-48 lg:w-52"
      >
        <PosterVideo
          videoUrl={video.url}
          posterUrl={video.posterUrl}
          hovered={hovered}
          sizes="(min-width: 1024px) 208px, (min-width: 640px) 192px, 160px"
          className="absolute inset-0 transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
        />
        <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-ink/85 to-transparent px-3 pt-12 pb-3">
          <span className="truncate text-xl font-semibold text-card">{video.petName}</span>
          <span className="truncate text-xs text-card/85">{video.shelterName}</span>
        </span>
      </Link>
    </li>
  );
}
