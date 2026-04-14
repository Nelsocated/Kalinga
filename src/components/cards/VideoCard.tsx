"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";

export type VideoCardProps = {
  href: string; // link to the video page
  thumbnailUrl?: string | null;
  subtitle: string;
  petName: string;
  className?: string;
};

export default function VideoCard({
  href,
  thumbnailUrl,
  subtitle,
  petName,
  className = "",
}: VideoCardProps) {
  const src = (thumbnailUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <Link
      href={href}
      className={[
        "block overflow-hidden rounded-[15px] border-2 border-secondary hover:scale-105 w-48 h-77",
        className,
      ].join(" ")}
    >
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={`${petName} video thumbnail`}
          fill
          className="object-cover"
        />

        {/* Dark Gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />

        {/* Text */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-col">
          <div className="max-w-[40%] truncate text-base font-semibold text-white drop-shadow">
            {petName}
          </div>
          <div className="max-w-[55%] truncate text-xs font-semibold text-white drop-shadow">
            {subtitle}
          </div>
        </div>

        {/* Video Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
          ▶ Video
        </div>
      </div>
    </Link>
  );
}
