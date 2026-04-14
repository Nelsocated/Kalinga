"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Caption from "./Caption";
import playIcon from "@/public/icons/Play-icon.svg";
import type { FeedItem } from "@/src/lib/services/feedService";
import { getViewSessionId } from "@/src/lib/session/getViewSessionId";

type PetCardProps = {
  item: FeedItem;
  isActive: boolean;
};

export default function ViewPort({ item, isActive }: PetCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasRecordedViewRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPaused, setIsPaused] = useState(false);

  const videoMedia = useMemo(
    () => item.pet_media?.find((media) => media.type === "video"),
    [item.pet_media],
  );

  const videoUrl = videoMedia?.url ?? null;
  const mediaId = videoMedia?.id ?? null;
  const caption = videoMedia?.caption ?? null;
  const shelterName = item.shelter?.shelter_name ?? "Unknown shelter";

  const recordView = useCallback(async () => {
    if (!mediaId || hasRecordedViewRef.current) return;

    hasRecordedViewRef.current = true;

    try {
      const res = await fetch("/api/views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId,
          sessionId: getViewSessionId(),
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        console.error("Failed to record view:", res.status, errorBody);
      }
    } catch (error) {
      console.error("Failed to record view", error);
    }
  }, [mediaId]);

  const clearViewTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startViewTimer = useCallback(() => {
    if (!mediaId || hasRecordedViewRef.current) return;
    clearViewTimer();
    timerRef.current = setTimeout(() => {
      void recordView();
    }, 3000);
  }, [mediaId, clearViewTimer, recordView]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      await video.play();
      setIsPaused(false);
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }

  useEffect(() => {
    hasRecordedViewRef.current = false;
    clearViewTimer();
  }, [mediaId, clearViewTimer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handle = async () => {
      if (isActive) {
        try {
          video.muted = false;
          await video.play();
          setIsPaused(false);
        } catch {
          video.muted = true;
          try {
            await video.play();
            setIsPaused(false);
          } catch {
            setIsPaused(true);
          }
        }
      } else {
        video.pause();
        video.muted = true;
        setIsPaused(true);
      }
    };

    handle();
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaId) return;

    function handlePlay() {
      setIsPaused(false);
      startViewTimer();
    }

    function handlePause() {
      setIsPaused(true);
      clearViewTimer();
    }

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    if (!video.paused) {
      startViewTimer();
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      clearViewTimer();
    };
  }, [mediaId, startViewTimer, clearViewTimer]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          playsInline
          loop
          autoPlay
          muted
          onClick={togglePlay}
          onPause={() => setIsPaused(true)}
          onPlay={() => setIsPaused(false)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/70">
          No video
        </div>
      )}

      {isPaused && videoUrl && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Image src={playIcon} alt="Play" />
        </div>
      )}

      <Caption
        id={item.id}
        name={item.name}
        shelter_name={shelterName}
        caption={caption}
      />
    </div>
  );
}
