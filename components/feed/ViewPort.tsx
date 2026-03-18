"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Caption from "./Caption";
import playIcon from "@/public/icons/Play-icon.svg";
import type { FeedItem } from "@/lib/types/feed";

type PetCardProps = {
  item: FeedItem;
};

export default function ViewPort({ item }: PetCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const videoMedia = useMemo(
    () => item.pet_media?.find((media) => media.type === "video"),
    [item.pet_media],
  );

  const videoUrl = videoMedia?.url ?? null;
  const caption = videoMedia?.caption ?? null;
  const shelterName = item.shelter?.shelter_name ?? "Unknown shelter";

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPaused(false);
      } catch {
        setIsPaused(true);
      }
      return;
    }

    video.pause();
    setIsPaused(true);
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          playsInline
          loop
          autoPlay
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
