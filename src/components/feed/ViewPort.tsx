"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Caption from "./Caption";
import playIcon from "@/public/icons/Play-icon.svg";
import type { FeedItem } from "@/src/lib/services/feedService";

type Props = {
  item: FeedItem;
  isActive: boolean;
};

export default function ViewPort({ item, isActive }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const videoUrl = item.url;
  const caption = item.caption;
  const shelterName = item.shelter?.shelter_name ?? "Unknown";

  // autoplay control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const run = async () => {
      if (isActive) {
        try {
          await video.play();
          setIsPaused(false);
        } catch {
          setIsPaused(true);
        }
      } else {
        video.pause();
      }
    };

    run();
  }, [isActive]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted
          onClick={togglePlay}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white/60">
          No video
        </div>
      )}

      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image src={playIcon} alt="play" />
        </div>
      )}

      <Caption
        id={item.pet_id}
        name={item.name}
        shelter_name={shelterName}
        caption={caption}
      />
    </div>
  );
}
