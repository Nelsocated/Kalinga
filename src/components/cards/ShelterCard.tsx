"use client";

import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import Avatar from "../ui/Avatar";
import LikeButton from "../ui/LikeButton";
import { cn } from "@/src/lib/cn";

export type ShelterCardProps = {
  id: string;
  href: string;
  imageUrl?: string | null;
  name: string;
  location?: string | null;
  petsAvailable?: number | null;
  petsAdopted?: number | null;
  className?: string;
};

function countLabel(available?: number | null, adopted?: number | null) {
  const parts: string[] = [];
  if (typeof available === "number") parts.push(`${available} available`);
  if (typeof adopted === "number") parts.push(`${adopted} adopted`);
  return parts.join(" · ");
}

/** Shelter row: logo, name, location and pet counts, with a like button. */
export default function ShelterCard({
  id,
  href,
  imageUrl,
  name,
  location,
  petsAvailable,
  petsAdopted,
  className,
}: ShelterCardProps) {
  const counts = countLabel(petsAvailable, petsAdopted);

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-lg border border-line bg-card p-3 transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift sm:p-4",
        className,
      )}
    >
      <Avatar src={imageUrl} name={name} size={64} className="size-14 sm:size-16" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* The stretched link makes the whole row clickable; the like button sits above it */}
        <Link
          href={href}
          className="truncate text-lg font-semibold text-ink after:absolute after:inset-0 after:rounded-lg"
        >
          {name}
        </Link>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{location || "Location not listed"}</span>
        </p>
        {counts ? <p className="text-sm text-ink-soft">{counts}</p> : null}
      </div>

      <div className="relative z-10">
        <LikeButton targetType="shelter" targetId={id} />
      </div>
    </div>
  );
}
