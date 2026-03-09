"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import Male_Icon from "@/public/icons/male-icon.svg";
import Female_Icon from "@/public/icons/female-icon.svg";

export type PetGender = "male" | "female" | "unknown";

export type PetCardProps = {
  href: string;
  imageUrl?: string | null;
  petName: string;
  sex?: PetGender;
  shelterName: string;
  shelterLogo: string;
  className?: string;
  year_inShelter?: number;
  title?: string | null;
};

function getSexIcon(sex?: string | null) {
  if (sex === "male") {
    return <Image src={Male_Icon} alt="male-icon" width={20} height={20} />;
  }

  if (sex === "female") {
    return <Image src={Female_Icon} alt="female-icon" width={20} height={20} />;
  }

  return null;
}

export default function PetCard({
  href,
  imageUrl,
  petName,
  sex,
  shelterName,
  shelterLogo,
  year_inShelter,
  title,
  className = "",
}: PetCardProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  const hasYear =
    typeof year_inShelter === "number" && Number.isFinite(year_inShelter);

  const yearLabel = hasYear
    ? `${year_inShelter} year${year_inShelter === 1 ? "" : "s"} in shelter`
    : null;

  const topLabel = title?.trim() || yearLabel;

  return (
    <Link
      href={href}
      className={[
        "relative block w-50 rounded-3xl border border-primary bg-primary overflow-visible",
        className,
      ].join(" ")}
    >
      {topLabel ? (
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border-2 border-primary bg-white px-4 py-1 text-xs font-bold text-primary leading-none shadow-sm">
          {topLabel}
        </div>
      ) : null}

      <div className="p-1">
        <div className="relative h-45 overflow-hidden rounded-3xl">
          <Image
            src={src}
            alt={`${petName} photo`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="p-2 pt-1 ml-1">
        <div className="flex items-center">
          <div className="text-xl font-bold leading-none">{petName}</div>
          {getSexIcon(sex)}
        </div>

        <div className="flex items-center text-sm leading-none">
          <Image
            src={shelterLogo}
            alt={shelterName}
            width={18}
            height={18}
            className="rounded-full"
          />
          <span>{shelterName}</span>
        </div>
      </div>
    </Link>
  );
}
