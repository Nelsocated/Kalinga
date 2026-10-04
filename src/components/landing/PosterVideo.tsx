"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PlayCircle } from "@phosphor-icons/react";

type Props = {
  videoUrl: string;
  posterUrl: string | null;
  /** True while the pointer is over the tile; the parent tracks hover. */
  hovered: boolean;
  sizes: string;
  className?: string;
};

/**
 * A pet photo standing in for its video. The video file only loads while a mouse hovers
 * the tile (never on touch or with reduced motion), so landing visits stay light.
 */
export default function PosterVideo({ videoUrl, posterUrl, hovered, sizes, className }: Props) {
  const [canPreview, setCanPreview] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");
    const update = () => setCanPreview(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <span className={className}>
      {posterUrl ? (
        <Image src={posterUrl} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-card/70">
          <PlayCircle size={40} aria-hidden="true" />
        </span>
      )}

      {canPreview && hovered ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}
