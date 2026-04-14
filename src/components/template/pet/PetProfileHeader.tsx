"use client";

import Image from "next/image";
import React from "react";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import { useRouter } from "next/navigation";

export default function PetProfileHeader({
  title,
  sex,
  subtitle,
  subtitleHref,
  location,
  imageUrl,
  meta,
  actions,
  likeButton,
}: {
  title: string;
  sex?: React.ReactNode;
  subtitle?: string | null;
  subtitleHref?: string;
  location?: string | null;
  imageUrl?: string | null;
  likeButton?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const src = (imageUrl ?? "").trim() || DEFAULT_AVATAR_URL;
  const router = useRouter();

  return (
    <div className="relative w-full pr-5">
      <div className="flex w-full flex-col gap-2">
        {/* TOP ROW: NAME + ACTIONS */}
        <div className="flex items-center justify-between">
          {/* LEFT: NAME */}
          <div className="flex min-w-0 items-center gap-1 font-bold text-name">
            <span className="truncate">{title}</span>
            <span className="shrink-0">{sex}</span>
          </div>

          {/* RIGHT: ACTIONS (CLOSE TO NAME) */}
          <div className="flex shrink-0 items-center gap-2">
            {likeButton}
            {actions}
          </div>
        </div>

        {/* SECOND ROW: AVATAR + INFO */}
        <div className="flex items-center">
          <div className="h-15 w-15 shrink-0 overflow-hidden rounded-full">
            <Image
              src={src}
              alt={title}
              width={46}
              height={46}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="ml-2 min-w-0 leading-tight">
            {subtitle &&
              (subtitleHref ? (
                <button
                  onClick={() => router.push(subtitleHref)}
                  className="font-semibold text-description hover:underline"
                >
                  {subtitle}
                </button>
              ) : (
                <div className="font-semibold text-description">{subtitle}</div>
              ))}

            {location ? <div className="text-small">{location}</div> : null}
            {meta ? <div className="mt-1">{meta}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
