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
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src={src}
            alt=""
            width={80}
            height={80}
            className="size-14 shrink-0 rounded-full object-cover sm:size-20"
          />

          <div className="flex min-w-0 flex-col gap-0.5">
            <h1 className="truncate text-headline text-ink">{title}</h1>
            {subtitle ? (
              <p className="truncate text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </div>
  );
}
