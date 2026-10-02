"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play } from "@phosphor-icons/react";
import { LinkButton } from "@/src/components/ui/Button";
import FilmStrip, { type StripVideo } from "./FilmStrip";

gsap.registerPlugin(useGSAP);

const LINES = ["Give Care. Give Love.", "A Home for Every Paw"];

/**
 * The tagline set as large as the page allows, one line of what Kalinga is, two actions,
 * then the strip of real pet videos running over a field of sunshine.
 */
export default function Hero({ videos }: { videos: StripVideo[] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out", duration: 1.1 } })
          .from("[data-hero='line']", { yPercent: 110, stagger: 0.12 })
          .from("[data-hero='sub'] > *", { y: 20, opacity: 0, stagger: 0.08, duration: 0.9 }, "-=0.75")
          .from("[data-hero='band']", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.2 }, "-=0.9")
          .from("[data-hero='strip']", { x: 160, opacity: 0, duration: 1.4 }, "<0.1");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      aria-labelledby="hero-title"
      className="flex min-h-[calc(100dvh-4.5rem)] flex-col justify-between gap-10 overflow-x-clip pt-8 md:pt-14"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:gap-10">
        <h1 id="hero-title" className="text-hero text-ink">
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
              <span data-hero="line" className="block">
                {line}{" "}
              </span>
            </span>
          ))}
        </h1>

        <div data-hero="sub" className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          <p className="max-w-[40ch] text-lg text-ink-soft md:text-xl">
            Watch short videos of rescued dogs and cats from verified shelters, and apply to adopt the one you fall for.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/site/home" variant="primary" size="lg" icon={<Play weight="fill" aria-hidden="true" />}>
              Start watching
            </LinkButton>
            <LinkButton href="/shelterSignup" variant="secondary" size="lg">
              Apply as a shelter
            </LinkButton>
          </div>
        </div>
      </div>

      {videos.length ? (
        <div className="relative pb-6">
          <div data-hero="band" aria-hidden="true" className="absolute inset-x-0 top-[38%] bottom-0 bg-sunshine" />
          <div data-hero="strip" className="relative">
            <FilmStrip videos={videos} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
