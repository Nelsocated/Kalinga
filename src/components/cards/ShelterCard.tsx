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

/** A small Sunshine Soft block: bold count, then what it counts. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <li className="flex items-baseline gap-1.5 rounded-md bg-sunshine-soft px-2 py-1 text-ink">
      <span className="text-base font-bold tabular-nums leading-none">{value}</span>
      <span className="text-xs font-medium leading-none">{label}</span>
    </li>
  );
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
  const hasAvailable = typeof petsAvailable === "number";
  const hasAdopted = typeof petsAdopted === "number";

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border border-line bg-card p-3 sm:gap-4 transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift sm:p-4",
        className,
      )}
    >
      <Avatar src={imageUrl} name={name} size={64} className="size-14 sm:size-16" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* The stretched link makes the whole row clickable; the like button sits above it */}
        <Link
          href={href}
          className="truncate text-xl font-semibold text-ink after:absolute after:inset-0 after:rounded-lg"
        >
          {name}
        </Link>
        <p className="flex min-w-0 items-center gap-1 text-sm text-muted">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{location || "Location not listed"}</span>
        </p>
        {hasAvailable || hasAdopted ? (
          <ul aria-label="Pets" className="mt-1.5 flex flex-wrap gap-1.5">
            {hasAvailable ? <Stat value={petsAvailable} label="available" /> : null}
            {hasAdopted ? <Stat value={petsAdopted} label="adopted" /> : null}
          </ul>
        ) : null}
      </div>

      <div className="relative z-10">
        <LikeButton targetType="shelter" targetId={id} />
      </div>
    </div>
  );
}
