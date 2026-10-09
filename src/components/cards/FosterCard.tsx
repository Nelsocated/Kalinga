"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";
import Avatar from "../ui/Avatar";
import type { PetGender } from "@/src/lib/types/shelters";
import SexIcon from "../ui/SexIcon";

type FosterCardProps = {
  href: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  petName: string;
  sex: PetGender;
  shelterName: string;
  shelterLogo?: string;
  className?: string;
};

/** A foster story you can open: the pet's photo, the title and the start of the story. */
export default function FosterCard({
  href,
  title,
  description,
  imageUrl,
  petName,
  sex,
  shelterName,
  shelterLogo,
  className,
}: FosterCardProps) {
  const src = (imageUrl ?? "").trim();

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-line bg-card p-2 text-left transition-[border-color,box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift active:scale-[0.99] sm:flex-row",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-sunshine-soft sm:aspect-[4/5] sm:w-36">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 640px) 144px, 80vw"
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
          />
        ) : (
          <PawPrint weight="fill" className="absolute inset-0 m-auto size-1/3 text-sunshine" aria-hidden="true" />
        )}
        <span className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-sunshine py-1 pr-2 pl-2.5 text-xs font-semibold text-ink">
          <span className="truncate">{petName}</span>
          <SexIcon sex={sex} size={12} className="text-ink" />
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 px-1.5 pb-1.5 sm:py-1.5 sm:pr-2 sm:pl-0">
        <h3 className="line-clamp-2 text-lg leading-snug font-semibold text-balance text-ink">{title}</h3>
        {description ? (
          <p className="line-clamp-3 text-sm text-ink-soft">{description}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
            <Avatar src={shelterLogo} name={shelterName} size={20} />
            <span className="truncate">{shelterName}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
            Read
            <ArrowRight
              size={16}
              className="transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
