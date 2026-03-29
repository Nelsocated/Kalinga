"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type BaseProfileHeaderProps = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  actions?: ReactNode;
  titleClassName?: string;
  avatarClassName?: string;
  rightSlot?: ReactNode;
};

export default function ProfileHeader({
  title,
  subtitle,
  imageUrl,
  actions,
  titleClassName = "text-xl font-semibold",
  avatarClassName = "rounded-full",
  rightSlot,
}: BaseProfileHeaderProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-row items-center">
          <div className="rounded-full overflow-hidden">
            <Image src={src} alt={title} width={100} height={100} />
          </div>

          <div className="flex flex-col pl-2">
            <div className="text-4xl font-semibold">{title}</div>
            <div className="text-lg">{subtitle}</div>
            {actions ? <div>{actions}</div> : null}
          </div>
        </div>

        {rightSlot ? (
          <div className="flex items-center pr-5">{rightSlot}</div>
        ) : null}
      </div>
    </div>
  );
}
