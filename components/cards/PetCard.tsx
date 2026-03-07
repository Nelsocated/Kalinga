"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import Male_Icon from "@/public/icons/male-icon.svg";
import Female_Icon from "@/public/icons/female-icon.svg";

export type PetGender = "male" | "female" | "unknown";

export type PetCardProps = {
  href: string; // link to pet profile
  imageUrl?: string | null; // main pic
  petName: string;
  sex?: PetGender;
  shelterName: string;
  shelterLogo: string;
  className?: string;
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
  className = "",
}: PetCardProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <Link
      href={href}
      className={[
        "block overflow-hidden w-55 border-8 border-primary bg-primary rounded-3xl",
        className,
      ].join(" ")}
    >
      <div className="relative h-45 overflow-hidden rounded-3xl">
        <Image
          src={src}
          alt={`${petName} photo`}
          fill
          className="object-cover"
          sizes="261px"
        />
      </div>

      <div className="pl-3 pb-5 relative bg-primary">
        <div className="flex flex-row">
          <div className="text-lg font-bold">{petName}</div>
          {getSexIcon(sex)}
        </div>

        <div className="absolute top-5 left-1 text-base flex flex-row">
          <Image src={shelterLogo} alt={shelterName} width={30} height={30} />
          {shelterName}
        </div>
      </div>
    </Link>
  );
}
