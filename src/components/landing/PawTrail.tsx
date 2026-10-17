"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/src/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** [x%, y%] of the section, or a selector for an element inside it (the trail meets its right edge). */
type Point = readonly [number, number] | string;

type Props = {
  from: Point;
  via?: Point;
  to: Point;
  /** Print size in px. */
  size?: number;
  /** Distance between prints in px. */
  stride?: number;
  /** "intro" walks in once after the hero entrance; "scroll" presses each print in as it scrolls into view. */
  mode?: "intro" | "scroll";
  /** End on one full-strength print, beside whatever `to` points at. */
  home?: boolean;
  /** The ground it walks on: cream sections get a faint print, the yellow field a white print with a yellow outline. */
  ground?: "cream" | "sunshine";
  className?: string;
};

type Print = { x: number; y: number; rotate: number; home: boolean };

// The paw from public/brand/paw.svg, filled: four toes and the main pad, toes pointing up
function Paw({ outlined }: { outlined: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      stroke={outlined ? "var(--color-sunshine-deep)" : "none"}
      strokeWidth={6}
      strokeLinejoin="round"
      className="size-full overflow-visible"
    >
      <ellipse cx="37" cy="24" rx="10" ry="13.5" transform="rotate(-12 37 24)" />
      <ellipse cx="63" cy="24" rx="10" ry="13.5" transform="rotate(12 63 24)" />
      <ellipse cx="15" cy="47" rx="8.5" ry="11.5" transform="rotate(-28 15 47)" />
      <ellipse cx="85" cy="47" rx="8.5" ry="11.5" transform="rotate(28 85 47)" />
      <path d="M50 49C61 49 68 60 76 70C85 81 81 93 69 93C61 93 57 89 50 89C43 89 39 93 31 93C19 93 15 81 24 70C32 60 39 49 50 49Z" />
    </svg>
  );
}

function resolve(point: Point, box: DOMRect, root: HTMLElement, gap: number): [number, number] {
  if (typeof point !== "string") return [(point[0] / 100) * box.width, (point[1] / 100) * box.height];
  const el = root.querySelector(point);
  if (!el) return [box.width / 2, box.height / 2];
  const r = el.getBoundingClientRect();
  return [r.right - box.left + gap, r.top - box.top + r.height / 2];
}

/** Evenly spaced prints along a quadratic curve, alternating sides like a real walk. */
function walk(p0: number[], p1: number[], p2: number[], size: number, stride: number, home: boolean): Print[] {
  const at = (t: number) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t * t * p2[k]);
  const SAMPLES = 120;
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => at(i / SAMPLES));
  const lengths = [0];
  for (let i = 1; i < pts.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = lengths[lengths.length - 1];
  const count = Math.max(2, Math.floor(total / stride) + 1);

  return Array.from({ length: count }, (_, n) => {
    const target = (n / (count - 1)) * total;
    let i = lengths.findIndex((l) => l >= target);
    if (i < 1) i = 1;
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const last = home && n === count - 1;
    // Left and right feet sit either side of the line, splayed a little outward
    const side = n % 2 ? 1 : -1;
    const offset = last ? 0 : side * size * 0.42;
    const heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    return {
      x: bx + (-dy / len) * offset,
      y: by + (dx / len) * offset,
      rotate: heading + (last ? 0 : side * 8),
      home: last,
    };
  });
}

/**
 * A quiet trail of the Kalinga paw walking through a section, behind its content.
 * Decorative only: hidden from assistive tech, absent without JS, shown at rest with reduced motion.
 * The parent section must be `relative`, with its content stacked above this layer.
 */
export default function PawTrail({ from, via, to, size = 48, stride = 104, mode = "scroll", home = false, ground = "cream", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [prints, setPrints] = useState<Print[]>([]);
  // Once a trail has walked in, re-measuring (images loading, a resize) redraws it at rest
  const walked = useRef(false);
  const key = JSON.stringify([from, via, to]);

  useEffect(() => {
    const layer = ref.current;
    const root = layer?.parentElement;
    if (!layer || !root) return;
    const measure = () => {
      const box = layer.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const gap = size * 1.1;
      const p0 = resolve(from, box, root, gap);
      const p2 = resolve(to, box, root, gap);
      const p1 = via ? resolve(via, box, root, gap) : [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
      setPrints(walk(p0, p1, p2, size, stride, home));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    return () => observer.disconnect();
    // `key` stands in for the point arrays, which are new on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size, stride, home]);

  useGSAP(
    () => {
      if (!prints.length) return;
      if (walked.current) {
        gsap.set("[data-print]", { opacity: 1, scale: 1 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray<HTMLElement>("[data-print]", ref.current);
        gsap.set(els, { opacity: 0, scale: 0.6 });
        const press = (batch: Element[], delay = 0) => {
          walked.current = true;
          gsap.to(batch, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out", stagger: 0.14, delay });
        };
        if (mode === "intro") press(els, 1.5);
        else ScrollTrigger.batch(els, { start: "top 88%", once: true, onEnter: (batch) => press(batch) });
      });
      // A trail that has started walking keeps its prints when re-measured; the next run shows them all at rest
      return () => (walked.current ? mm.kill(false) : mm.revert());
    },
    { scope: ref, dependencies: [prints, mode] },
  );

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {prints.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.home ? size * 1.35 : size,
            height: p.home ? size * 1.35 : size,
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
          }}
        >
          <span data-print className={cn("block size-full", p.home ? "text-sunshine" : ground === "cream" ? "text-sunshine-deep/40" : "text-card")}>
            <Paw outlined={ground === "sunshine" && !p.home} />
          </span>
        </span>
      ))}
    </div>
  );
}
