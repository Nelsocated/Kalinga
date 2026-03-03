"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type ShelterCardProps = {
  href: string;
  imageUrl?: string | null;
  name: string;
  location?: string | null;
  rating?: number | null;
  petsAvailable?: number | null;
  petsAdopted?: number | null;
  className?: string;
};

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/5 px-2 py-1">
      <div className="text-[10px] font-semibold opacity-70">{label}</div>
      <div className="text-xs font-bold">{value ?? "-"}</div>
    </div>
  );
}

export default function ShelterCard({
  href,
  imageUrl,
  name,
  location,
  rating,
  petsAvailable,
  petsAdopted,
  className = "",
}: ShelterCardProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <Link
      href={href}
      className={[
        "block w-full rounded-2xl border border-black/10 bg-white p-3 shadow-sm transition hover:bg-black/5",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-black/5">
          <Image
            src={src}
            alt={`${name} image`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold">{name}</div>
            {typeof rating === "number" ? (
              <div className="shrink-0 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[11px] font-semibold">
                ★ {rating.toFixed(1)}
              </div>
            ) : null}
          </div>

          {location ? (
            <div className="mt-1 truncate text-xs opacity-70">{location}</div>
          ) : (
            <div className="mt-1 truncate text-xs opacity-60">
              Unknown location
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <Stat label="Available" value={petsAvailable} />
            <Stat label="Adopted" value={petsAdopted} />
            <Stat
              label="Total pets"
              value={
                typeof petsAvailable === "number" &&
                typeof petsAdopted === "number"
                  ? petsAvailable + petsAdopted
                  : null
              }
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
