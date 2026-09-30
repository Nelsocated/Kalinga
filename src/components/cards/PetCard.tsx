"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/cn";
import Avatar from "../ui/Avatar";
import SexIcon from "../ui/SexIcon";
import type { PetGender } from "@/src/lib/types/shelters";

export type PetCardProps = {
  href?: string;
  imageUrl?: string | null;
  petName: string;
  sex: PetGender;
  shelterName?: string;
  shelterLogo?: string;
  className?: string;
  year_inShelter?: number;
  /** A short label over the photo, e.g. a foster story title. */
  title?: string | null;
  /** Compact variant for pickers: no shelter row. */
  resize?: boolean;
};

/** Photo-led pet tile: 4:5 photo, name with sex, shelter below. */
export default function PetCard({
  href,
  imageUrl,
  petName,
  sex,
  shelterName,
  shelterLogo,
  year_inShelter,
  title,
  resize = false,
  className,
}: PetCardProps) {
  const src = (imageUrl ?? "").trim();
  const hasYear = typeof year_inShelter === "number" && Number.isFinite(year_inShelter);
  const label =
    title?.trim() ||
    (hasYear ? `${year_inShelter} year${year_inShelter === 1 ? "" : "s"} in shelter` : null);

  const content = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-sunshine-soft">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-ink/40">
            {petName.slice(0, 1).toUpperCase()}
          </span>
        )}
        {label ? (
          <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-card/95 px-2.5 py-1 text-xs font-medium text-ink">
            {label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 px-1 pt-2.5 pb-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate font-semibold text-ink">{petName}</span>
          <SexIcon sex={sex} size={16} />
        </div>
        {!resize && shelterName ? (
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
            <Avatar src={shelterLogo} name={shelterName} size={20} />
            <span className="truncate">{shelterName}</span>
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = cn(
    "group block w-full rounded-lg border border-line bg-card p-2 text-left",
    href &&
      "transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift",
    className,
  );

  return href ? (
    <Link href={href} className={classes} aria-label={`${petName}${shelterName ? `, ${shelterName}` : ""}`}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}
