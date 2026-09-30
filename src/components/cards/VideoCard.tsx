"use client";

import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

export type VideoCardProps = {
  href: string;
  thumbnailUrl?: string | null;
  subtitle: string;
  petName: string;
  className?: string;
};

/** Video tile: 4:5 thumbnail with the pet name over a scrim. */
export default function VideoCard({ href, thumbnailUrl, subtitle, petName, className }: VideoCardProps) {
  const src = (thumbnailUrl ?? "").trim();

  return (
    <Link
      href={href}
      aria-label={`Watch ${petName}`}
      className={cn(
        "group relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-ink transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-[1.03]"
        />
      ) : null}

      <PlayCircle
        size={28}
        weight="fill"
        aria-hidden="true"
        className="absolute top-2.5 left-2.5 text-card drop-shadow"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 to-transparent px-3 pt-10 pb-3">
        <p className="truncate font-semibold text-card">{petName}</p>
        <p className="truncate text-xs text-card/85">{subtitle}</p>
      </div>
    </Link>
  );
}
