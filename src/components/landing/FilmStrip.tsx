"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type StripVideo = { mediaId: string; url: string; petName: string; shelterName: string };

const SECONDS_PER_TILE = 4.5;

/**
 * Real feed videos drifting sideways in a seamless loop (the set is rendered twice).
 * Hover or keyboard focus pauses it. With reduced motion it stays still and scrolls by hand.
 * Each video only plays while it is on screen.
 */
export default function FilmStrip({ videos }: { videos: StripVideo[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          duration: videos.length * SECONDS_PER_TILE,
          repeat: -1,
        });
        const root = scope.current!;
        const pause = () => tween.pause();
        const resume = () => tween.resume();
        root.addEventListener("mouseenter", pause);
        root.addEventListener("mouseleave", resume);
        root.addEventListener("focusin", pause);
        root.addEventListener("focusout", resume);
        return () => {
          root.removeEventListener("mouseenter", pause);
          root.removeEventListener("mouseleave", resume);
          root.removeEventListener("focusin", pause);
          root.removeEventListener("focusout", resume);
        };
      });
      return () => mm.revert();
    },
    { scope, dependencies: [videos.length] },
  );

  // Play only what is visible; with reduced motion, nothing autoplays
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = track.current?.querySelectorAll("video") ?? [];
    if (reduce || !els.length) return;

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
  }, [videos]);

  if (!videos.length) return null;

  const loop = [...videos, ...videos];

  return (
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
                className="group relative block aspect-9/16 w-40 overflow-hidden rounded-xl bg-ink sm:w-52 lg:w-60"
              >
                <video
                  src={`${video.url}#t=0.1`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-ink/80 to-transparent px-3 pt-10 pb-3">
                  <span className="truncate font-semibold text-card">
                    {video.petName}
                  </span>
                  <span className="truncate text-xs text-card/85">{video.shelterName}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
