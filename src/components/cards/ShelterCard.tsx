"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import LikeButton from "../ui/LikeButton";

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

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div className="rounded-[15px] bg-primary px-7 py-1 flex justify-center items-center gap-6">
      <div className="text-2xl font-semibold">{value ?? "-"}</div>
      <div className="text-lg">{label}</div>
    </div>
  );
}

export default function ShelterCard({
  id,
  href,
  imageUrl,
  name,
  location,
  petsAvailable,
  petsAdopted,
  className = "",
}: ShelterCardProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <Link
      href={href}
      className={[
        "block w-full rounded-[15px] bg-background p-3 shadow-sm transition  hover:bg-black/5",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-5">
        <div className="pl-5 h-25 w-30 shrink-0 overflow-hidden rounded-md">
          <Image
            src={src}
            alt={`${name} image`}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="text-4xl font-bold">{name}</div>

          {location ? (
            <div className="text-2xl truncate">{location}</div>
          ) : (
            <div className="opacity-60">Unknown location</div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <Stat label="Pets Available" value={petsAvailable} />
          <Stat label="Pets Adopted" value={petsAdopted} />
        </div>

        <div className="pr-5 flex items-center">
          <LikeButton
            targetType="shelter"
            targetId={id}
            className="h-12 text-primary"
          />
        </div>
      </div>
    </Link>
  );
}
