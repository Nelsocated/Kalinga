"use client";

import Link from "next/link";
import type React from "react";
import { CaretRight } from "@phosphor-icons/react";
import Avatar from "@/src/components/ui/Avatar";

/** Pet name with sex, like and owner actions, then a row linking to the shelter. */
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
  compact = false,
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
  /** Smaller name, for when the pet is secondary on the page. */
  compact?: boolean;
}) {
  const shelterRow = subtitle ? (
    <>
      <Avatar src={imageUrl} name={subtitle} size={40} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-ink">{subtitle}</span>
        {location ? <span className="truncate text-xs text-muted">{location}</span> : null}
      </span>
    </>
  ) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className={`flex min-w-0 items-center gap-2 text-ink ${compact ? "text-xl font-semibold" : "text-display"}`}>
          <span className="truncate">{title}</span>
          {sex}
        </h2>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          {actions}
          {likeButton}
        </div>
      </div>

      {shelterRow ? (
        subtitleHref ? (
          <Link
            href={subtitleHref}
            className="flex items-center gap-3 rounded-lg border border-line bg-card p-3 transition-colors hover:bg-sunshine-wash"
          >
            {shelterRow}
            <CaretRight size={18} aria-hidden="true" className="shrink-0 text-ink-soft" />
          </Link>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-card p-3">{shelterRow}</div>
        )
      ) : null}

      {meta ? <div>{meta}</div> : null}
    </div>
  );
}
