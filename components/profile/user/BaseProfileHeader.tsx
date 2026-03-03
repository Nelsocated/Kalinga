"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

export type BaseProfileHeaderProps = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  meta?: ReactNode;
  actions?: ReactNode;
  titleClassName?: string;
  avatarClassName?: string;
  rightSlot?: ReactNode;
};

export default function BaseProfileHeader({
  title,
  subtitle,
  imageUrl,
  meta,
  actions,
  titleClassName = "text-4xl font-bold",
  avatarClassName = "rounded-full",
  rightSlot,
}: BaseProfileHeaderProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <div className={`w-30 h-30 overflow-hidden ${avatarClassName}`}>
          <Image
            src={src}
            alt={title}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className={`${titleClassName} font-bold`}>{title}</div>
          <div className="text-lg">{subtitle}</div>
        </div>
      </div>

      <div className="flex flex-row p-5">
        {meta ? <div className="">{meta}</div> : null}
        {actions ? <div className="">{actions}</div> : null}
      </div>
      {rightSlot ? <div>{rightSlot}</div> : null}
    </div>
  );
}
