"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, Play } from "@phosphor-icons/react";
import Caption from "./Caption";
import type { FeedItem } from "@/src/lib/services/feedService";
import { getViewSessionId } from "@/src/lib/session/getViewSessionId";

type Props = {
  item: FeedItem;
  isActive: boolean;
  preload: "auto" | "none";
  onDoubleTap?: () => void;
};

const DOUBLE_TAP_MS = 300;
const VIEW_AFTER_MS = 2000;

export default function ViewPort({ item, isActive, preload, onDoubleTap }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewRecorded = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hearts, setHearts] = useState(0);
  const reduce = useReducedMotion();

  // Only the active video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video
        .play()
        .then(() => setIsPaused(false))
        .catch(() => setIsPaused(true));
    } else {
      video.pause();
    }
  }, [isActive]);

  // Count a view once the video has been on screen for 2 seconds
  useEffect(() => {
    if (!isActive || viewRecorded.current) return;

    const timer = setTimeout(() => {
      viewRecorded.current = true;
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: item.media_id, sessionId: getViewSessionId() }),
      }).catch(() => {});
    }, VIEW_AFTER_MS);

    return () => clearTimeout(timer);
  }, [isActive, item.media_id]);

  useEffect(() => () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }

  // A single tap toggles playback; two quick taps like the video instead
  function handleTap() {
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      onDoubleTap?.();
      setHearts((n) => n + 1);
      return;
    }

    tapTimer.current = setTimeout(() => {
      tapTimer.current = null;
      togglePlay();
    }, onDoubleTap ? DOUBLE_TAP_MS : 0);
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      {item.url ? (
        <video
          ref={videoRef}
          src={item.url}
          preload={preload}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted
          onClick={handleTap}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-card/70">
          This video isn&apos;t available.
        </div>
      )}

      {isPaused ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Play size={72} weight="fill" className="text-card/90 drop-shadow-lg" aria-hidden="true" />
        </div>
      ) : null}

      <AnimatePresence>
        {hearts > 0 && !reduce ? (
          <motion.div
            key={hearts}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeIn", delay: 0.35 }}
            onAnimationComplete={() => setHearts(0)}
          >
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: [0.6, 1.1, 1] }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex text-sunshine drop-shadow-lg"
            >
              <Heart size={96} weight="fill" />
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Caption
        id={item.pet_id}
        name={item.name}
        shelterName={item.shelter?.shelter_name ?? "A Kalinga shelter"}
        caption={item.caption}
      />
    </div>
  );
}
