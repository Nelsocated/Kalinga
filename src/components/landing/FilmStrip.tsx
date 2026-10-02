"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Pause, Play } from "@phosphor-icons/react";
import Button from "@/src/components/ui/Button";

gsap.registerPlugin(useGSAP);

export type StripVideo = { mediaId: string; url: string; petName: string; shelterName: string };

const SECONDS_PER_TILE = 4.5;

/**
 * Real feed videos drifting sideways in a seamless loop (the set is rendered twice).
 * Hover, keyboard focus or the Pause button stops it. With reduced motion it stays still
 * and scrolls by hand. Each video only plays while it is on screen and not paused.
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

  // Play only what is visible; with reduced motion or when paused, nothing plays
  useEffect(() => {
    pausedRef.current = paused;
    const els = Array.from(track.current?.querySelectorAll("video") ?? []);
    if (!canMove || !els.length) return;

    if (paused) {
      tween.current?.pause();
      els.forEach((el) => el.pause());
      return;
    }
    if (!held.current) tween.current?.resume();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.25 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos, paused, canMove]);

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
          {loop.map((video, i) => {
            const duplicate = i >= videos.length;
            return (
              <li key={`${video.mediaId}-${i}`} aria-hidden={duplicate || undefined} className="shrink-0">
                <Link
                  href={`/site/home/pet/${video.mediaId}`}
                  tabIndex={duplicate ? -1 : undefined}
                  aria-label={`Watch ${video.petName} from ${video.shelterName}`}
                  className="group relative block aspect-9/16 w-40 overflow-hidden rounded-lg bg-ink transition-shadow duration-300 ease-out-expo hover:shadow-float sm:w-48 lg:w-52"
                >
                  <video
                    src={`${video.url}#t=0.1`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-ink/85 to-transparent px-3 pt-12 pb-3">
                    <span className="truncate text-lg font-semibold text-card">{video.petName}</span>
                    <span className="truncate text-xs text-card/85">{video.shelterName}</span>
                  </span>
                </Link>
              </li>
            );
          })}
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
            {paused ? "Play videos" : "Pause videos"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
