"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play } from "@phosphor-icons/react";
import { LinkButton } from "@/src/components/ui/Button";
import FilmStrip, { type StripVideo } from "./FilmStrip";

gsap.registerPlugin(useGSAP);

/** Tagline, one line of what Kalinga is, two actions, then the strip of real pet videos. */
export default function Hero({ videos }: { videos: StripVideo[] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out", duration: 0.9 } })
          .from("[data-hero='title'] > span", { y: 48, opacity: 0, stagger: 0.08 })
          .from("[data-hero='sub']", { y: 24, opacity: 0 }, "-=0.6")
          .from("[data-hero='cta'] > *", { y: 16, opacity: 0, stagger: 0.08 }, "-=0.65")
          .from("[data-hero='strip']", { x: 120, opacity: 0, duration: 1.2 }, "-=0.7");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="hero-title" className="flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center gap-10 pt-6 pb-12 md:pt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <h1 id="hero-title" data-hero="title" className="max-w-[16ch] text-display text-ink">
          <span className="inline-block">Give Care. Give Love.</span>{" "}
          <span className="inline-block">A Home for Every Paw</span>
        </h1>
        <p data-hero="sub" className="max-w-[46ch] text-lg text-ink-soft">
          Watch short videos of rescued dogs and cats from verified shelters, and apply to adopt the one you fall for.
        </p>
        <div data-hero="cta" className="flex flex-wrap gap-3">
          <LinkButton href="/site/home" variant="primary" size="lg" icon={<Play weight="fill" aria-hidden="true" />}>
            Start watching
          </LinkButton>
          <LinkButton href="/shelterSignup" variant="secondary" size="lg">
            Apply as a shelter
          </LinkButton>
        </div>
      </div>

      <div data-hero="strip">
        <FilmStrip videos={videos} />
      </div>
    </section>
  );
}
