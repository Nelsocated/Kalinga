"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { verb: "Watch", text: "Scroll short videos of dogs and cats, posted by the shelters caring for them." },
  { verb: "Like", text: "Tap the heart to keep a pet, a video or a shelter. Message the shelters you like." },
  { verb: "Apply", text: "Send an adoption application from the pet's page and follow its status as the shelter reviews it." },
];

/**
 * The adopter path as three verbs set at hero size. On wider screens the verb in the middle
 * of the viewport is lit and highlighted in sunshine while the others rest; on phones and
 * with reduced motion all three stay lit.
 */
export default function HowItWorks() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-step]");
        const light = (row: HTMLElement, on: boolean) => {
          gsap.to(row, { opacity: on ? 1 : 0.28, duration: 0.5, ease: "expo.out", overwrite: "auto" });
          gsap.to(row.querySelector("[data-mark]"), {
            scaleX: on ? 1 : 0,
            duration: on ? 0.7 : 0.4,
            ease: "expo.out",
            overwrite: "auto",
          });
        };
        rows.forEach((row, i) => {
          gsap.set(row, { opacity: i === 0 ? 1 : 0.28 });
          gsap.set(row.querySelector("[data-mark]"), { scaleX: i === 0 ? 1 : 0 });
        });
        // One verb lit at a time, picked by how far the list has scrolled through the middle
        let active = 0;
        ScrollTrigger.create({
          trigger: "[data-steps]",
          start: "top 60%",
          end: "bottom 50%",
          onUpdate: (self) => {
            const next = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
            if (next === active) return;
            light(rows[active], false);
            light(rows[next], true);
            active = next;
          },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="how-title" className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 md:py-36">
      <h2 id="how-title" className="max-w-[20ch] text-display text-ink">
        From a video to a home, in three steps
      </h2>
      <ol data-steps className="mt-12 flex flex-col gap-10 md:mt-20 md:gap-24">
        {STEPS.map(({ verb, text }) => (
          <li
            key={verb}
            data-step
            className="grid gap-3 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-12"
          >
            <h3 className="text-hero text-ink">
              <span className="relative isolate inline-block">
                <span
                  data-mark
                  aria-hidden="true"
                  className="absolute inset-x-[-0.06em] bottom-[0.08em] -z-10 h-[0.32em] origin-left rounded-sm bg-sunshine"
                />
                {verb}
              </span>
            </h3>
            <p className="max-w-[36ch] text-lg text-ink-soft md:pb-[0.4em] md:text-xl">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
