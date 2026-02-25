"use client";

import Image from "next/image";
import { useState } from "react";
import { useRef } from "react";
import Caption from "./Caption";
import play_icon from "@/public/icons/Play-icon.svg";

type FeedItem = {
  id: string;
  name: string;
  pet_media: {
    type: "video" | "photo";
    url: string;
    caption: string | null;
  }[];
  shelter: null | {
    shelter_name?: string | null;
    logo_url?: string | null;
  };
};

export default function PetCard({ item }: { item: FeedItem }) {
  const videoMedia = item.pet_media.find((m) => m.type === "video");
  const videoUrl = videoMedia?.url;
  const caption = videoMedia?.caption;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const shelterName = item.shelter?.shelter_name ?? "Unknown shelter";

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {videoUrl ? (
        <video
          onClick={togglePlay}
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          muted
          playsInline
          loop
          autoPlay
        />
      ) : (
        <div className="flex h-full items-center justify-center text-black/70">
          No video
        </div>
      )}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image src={play_icon} alt="play-icon" />
        </div>
      )}
      <Caption id={item.id} name={item.name} shelter_name={shelterName} caption={caption} />
    </div>
  );
}
