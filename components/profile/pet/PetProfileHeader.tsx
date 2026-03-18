"use client";

import Image from "next/image";
import React from "react";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import { useRouter } from "next/navigation";

export default function PetProfileHeader({
  title,
  sex,
  subtitle,
  subtitleHref,
  location,
  imageUrl,
  likeButton,
  meta,
  actions,
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
    <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div className="absolute right-0 top-1 scale-85">{likeButton}</div>
      <div className="flex flex-col pt-15">
        <div className="flex flex-row gap-1 text-5xl font-bold">
          {title} {sex}
        </div>

        <div className="flex items-center p-0">
          <div className="h-15 w-15 overflow-hidden rounded-full">
            <Image
              src={src}
              alt={title}
              width={46}
              height={46}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="ml-3 leading-tight">
            {subtitle &&
              (subtitleHref ? (
                <button
                  type="button"
                  onClick={() => router.push(subtitleHref)}
                  className="text-lg font-semibold transition hover:underline"
                >
                  {subtitle}
                </button>
              ) : (
                <div className="text-lg font-semibold">{subtitle}</div>
              ))}

            {location ? <div className="text-sm">{location}</div> : null}
            {meta ? <div className="mt-1">{meta}</div> : null}
            {actions ? <div className="mt-1">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
