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
      <div className="flex w-full flex-col">
        <div className="flex w-full items-center justify-between gap-2 text-name font-bold">
          <div className="min-w-0 flex items-center gap-1">
            <span className="truncate">{title}</span>
            <span className="shrink-0">{sex}</span>
          </div>

          <div className="ml-auto shrink-0">{likeButton}</div>
        </div>

        <div className="mt-2 flex w-full items-center">
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
                  type="button"
                  onClick={() => router.push(subtitleHref)}
                  className="text-description font-semibold transition hover:underline"
                >
                  {subtitle}
                </button>
              ) : (
                <div className="text-description font-semibold">{subtitle}</div>
              ))}

            {location ? <div className="text-small">{location}</div> : null}
            {meta ? <div className="mt-1">{meta}</div> : null}
            {actions ? <div className="mt-1">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
