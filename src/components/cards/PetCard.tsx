"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import {
  getSexIcon,
  type PetGender,
} from "@/src/app/site/profiles/pets/[id]/PetProfileClient";

export type PetCardProps = {
  href?: string;
  imageUrl?: string | null;
  petName: string;
  sex: PetGender;
  shelterName?: string;
  shelterLogo?: string;
  className?: string;
  year_inShelter?: number;
  title?: string | null;
  resize?: boolean;
};

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
  className = "",
}: PetCardProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  const hasYear =
    typeof year_inShelter === "number" && Number.isFinite(year_inShelter);

  const yearLabel = hasYear
    ? `${year_inShelter} year${year_inShelter === 1 ? "" : "s"} in shelter`
    : null;

  const topLabel = title?.trim() || yearLabel;

  const cardContent = resize ? (
    <>
      {topLabel ? (
        <div className="absolute left-1/2 top-0 z-20 max-w-45 -translate-x-1/2 -translate-y-1/2 truncate whitespace-nowrap rounded-full border-2 bg-white px-4 py-1 text-xs leading-none font-bold text-primary shadow-sm">
          {topLabel}
        </div>
      ) : null}

      <div>
        <div className="relative h-30 overflow-hidden rounded-[15px]">
          <Image
            src={src}
            alt={`${petName} photo`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="ml-1 px-2 py-2">
        <div className="flex items-center">
          <div className="text-[20px] leading-none font-bold">{petName}</div>
          {getSexIcon(sex, 15)}
        </div>
      </div>
    </>
  ) : (
    <>
      {topLabel ? (
        <div className="absolute left-1/2 top-0 z-20 max-w-45 -translate-x-1/2 -translate-y-1/2 truncate whitespace-nowrap rounded-full border-2 bg-white px-4 py-1 text-xs leading-none font-bold text-primary shadow-sm">
          {topLabel}
        </div>
      ) : null}

      <div className="p-1">
        <div className="relative h-45 overflow-hidden rounded-[15px]">
          <Image
            src={src}
            alt={`${petName} photo`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="ml-1 px-2">
        <div className="flex items-center">
          <div className="text-[20px] leading-none font-bold">{petName}</div>
          {getSexIcon(sex, 20)}
        </div>

        <div className="flex items-center text-[10px] leading-none">
          <Image
            src={shelterLogo || DEFAULT_AVATAR_URL}
            alt={shelterName ?? ""}
            width={18}
            height={18}
            className="rounded-full"
          />
          <span>{shelterName}</span>
        </div>
      </div>
    </>
  );

  const sharedClassName = [
    "relative block overflow-visible rounded-[15px] border-3 bg-primary",
    href ? "cursor-pointer" : "",
    resize ? "w-40" : "w-50",
    className,
  ].join(" ");

  if (!href) {
    return <div className={sharedClassName}>{cardContent}</div>;
  }

  return (
    <Link href={href} className={sharedClassName}>
      {cardContent}
    </Link>
  );
}
