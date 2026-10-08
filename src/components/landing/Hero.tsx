"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play } from "@phosphor-icons/react";
import { LinkButton } from "@/src/components/ui/Button";
import TourVideo from "./TourVideo";

gsap.registerPlugin(useGSAP);

const LINES = ["Give Care. Give Love.", "A Home for Every Paw"];

/**
 * The tagline set as large as the page allows, one line of what Kalinga is, two actions,
 * then a short tour of the app on a field of sunshine.
 */
export default function Hero() {
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
          .from("[data-hero='tour']", { y: 60, opacity: 0, duration: 1.3 }, "<0.1");
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-x-clip pt-8 pb-12 md:pt-14"
    >
      <div data-hero="band" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-sunshine" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 md:gap-10">
        <h1 id="hero-title" className="text-hero text-ink">
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
              <span data-hero="line" className="block">
                {line}{" "}
              </span>
            </span>
          ))}
        </h1>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div data-hero="sub" className="flex flex-col gap-6 lg:pt-4">
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

          <div data-hero="tour" className="mx-auto w-full max-w-md lg:mx-0 lg:w-auto lg:max-w-none">
            <TourVideo className="aspect-4/5 w-full lg:h-[min(62dvh,600px)] lg:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
