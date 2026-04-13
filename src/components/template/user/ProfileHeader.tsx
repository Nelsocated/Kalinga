"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";

export type BaseProfileHeaderProps = {
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  actions?: ReactNode;
  rightSlot?: ReactNode;
};

export default function ProfileHeader({
  title,
  subtitle,
  imageUrl,
  actions,
  rightSlot,
}: BaseProfileHeaderProps) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between gap-8 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 py-2">
          <div className="overflow-hidden rounded-full shrink-0">
            <Image src={src} alt={title} width={80} height={80} />
          </div>

          <div className="min-w-0 flex flex-col pl-2 leading-5">
            <div className="text-title font-semibold">{title}</div>
            <div className="text-lg font-medium">{subtitle}</div>
          </div>
        </div>

        {actions ? <div>{actions}</div> : null}
        {rightSlot ? <div className="shrink-0 ml-10">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
