"use client";

import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react";
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

/** Sunshine pet tile: the photo in a thin yellow frame, name and shelter on the yellow below. */
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
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <PawPrint
            weight="fill"
            className="absolute inset-0 m-auto size-1/3 text-sunshine"
            aria-hidden="true"
          />
        )}
        {label ? (
          <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-ink">
            {label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 px-2 pt-2 pb-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-lg leading-tight font-bold text-ink">{petName}</span>
          {/* The sex colors are too pale to read on sunshine, so the icon takes the ink */}
          <SexIcon sex={sex} size={18} className="text-ink" />
        </div>
        {!resize && shelterName ? (
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-ink">
            <Avatar src={shelterLogo} name={shelterName} size={20} className="ring-1 ring-ink/10" />
            <span className="truncate">{shelterName}</span>
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = cn(
    "group block w-full rounded-lg bg-sunshine p-1 text-left",
    href &&
      "transition-[background-color,box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-sunshine-deep hover:shadow-lift active:scale-[0.98]",
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
