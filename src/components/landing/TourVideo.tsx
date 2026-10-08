"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

// The story the video tells, for screen readers and search (same words as its captions)
const STEPS = [
  "Watch short videos of shelter pets",
  "Like the ones you fall for",
  "See their profile and their shelter",
  "Apply to adopt from the profile",
  "Talk with the shelter",
];

const REDUCE = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

/**
 * A short looping tour of the app. Plays muted only while on screen; the visitor can pause it,
 * and that choice sticks. With reduced motion it waits on the poster for a Play tap.
 */
export default function TourVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();

  // Hide the control when the file can't load. Native listeners, because the <source> error can fire
  // before or around hydration where React's onError misses it; the state check covers one that already did.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const source = video.querySelector("source");
    const fail = () => setFailed(true);
    video.addEventListener("error", fail);
    source?.addEventListener("error", fail);
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.dispatchEvent(new Event("error"));
    return () => {
      video.removeEventListener("error", fail);
      source?.removeEventListener("error", fail);
    };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!userPaused.current) video.play().catch(() => setPlaying(false));
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  return (
    <figure className={cn("relative overflow-hidden rounded-xl border border-line bg-ground shadow-float", className)}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/landing/tour-poster.jpg"
        aria-label="A short tour of Kalinga on a phone"
        aria-describedby="tour-steps"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block size-full object-cover"
      >
        {/* H.264 only: a VP9 WebM failed to decode in Chromium, and browsers that pick it never fall back */}
        <source src="/landing/tour.mp4" type="video/mp4" />
      </video>
      <ol id="tour-steps" className="sr-only">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {failed ? null : (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
          className="absolute right-3 bottom-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-card/90 text-ink shadow-lift transition-transform duration-200 ease-out-expo hover:bg-card active:scale-95"
        >
          {playing ? <Pause weight="fill" size={20} aria-hidden="true" /> : <Play weight="fill" size={20} aria-hidden="true" />}
        </button>
      )}
    </figure>
  );
}
