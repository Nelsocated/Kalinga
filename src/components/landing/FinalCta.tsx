"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Play } from "@phosphor-icons/react";
import { LinkButton } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/cn";
import type { StripVideo } from "./FilmStrip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Resting fan for three tiles: left, center (front), right. Inline transforms so GSAP can read them.
const FAN = [
  "translate(38%, 6%) rotate(-9deg)",
  "none",
  "translate(-38%, 6%) rotate(9deg)",
];

/**
 * Close on the one action that matters, beside a small fanned hand of real pet videos.
 * The hand deals itself out once as the section arrives.
 */
export default function FinalCta({ videos }: { videos: StripVideo[] }) {
  const scope = useRef<HTMLElement>(null);
  const hand = videos.slice(0, 3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-card]", {
          rotation: 0,
          x: 0,
          y: 40,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: scope.current, start: "top 70%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      aria-labelledby="final-title"
      className="mx-auto grid w-full max-w-7xl items-center gap-14 overflow-x-clip px-4 py-24 sm:px-6 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:py-36"
    >
      <div className="flex flex-col items-start gap-8">
        <h2 id="final-title" className="max-w-[14ch] text-hero text-ink">
          Your next best friend might be one video away.
        </h2>
        <LinkButton href="/site/home" variant="primary" size="lg" icon={<Play weight="fill" aria-hidden="true" />}>
          Start watching
        </LinkButton>
      </div>

      {hand.length ? (
        <ul className="flex justify-center py-6" aria-label="A few pets in the feed">
          {hand.map((video, i) => (
            <li
              key={video.mediaId}
              data-card
              className={cn("w-36 shrink-0 sm:w-44 lg:w-52", i === 1 && "relative z-10")}
              style={hand.length === 3 ? { transform: FAN[i] } : undefined}
            >
              <Link
                href={`/site/home/pet/${video.mediaId}`}
                aria-label={`Watch ${video.petName} from ${video.shelterName}`}
                className="group relative block aspect-9/16 overflow-hidden rounded-lg border-4 border-card bg-ink shadow-float transition-transform duration-300 ease-out-expo hover:-translate-y-2"
              >
                <video
                  src={`${video.url}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 to-transparent px-3 pt-10 pb-3">
                  <span className="block truncate font-semibold text-card">{video.petName}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
