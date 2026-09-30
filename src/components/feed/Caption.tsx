"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

type Props = {
  id: string;
  name: string;
  shelterName: string;
  caption?: string | null;
};

/** Pet name, shelter and caption over a bottom scrim. */
export default function Caption({ id, name, shelterName, caption }: Props) {
  const [open, setOpen] = useState(false);
  const text = (caption ?? "").trim();

  return (
    // pb-24 on phones keeps the text above the bottom tab bar and the action rail
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 via-ink/30 to-transparent px-4 pt-16 pb-24 pr-20 text-card md:pb-5 md:pr-4">
      <div className="pointer-events-auto flex flex-col gap-1">
        <Link
          href={`/site/profiles/pets/${id}`}
          className="flex w-fit items-center gap-1.5 text-xl font-semibold leading-tight hover:underline"
        >
          {name}
          <ArrowRight size={18} aria-hidden="true" />
          <span className="sr-only">Open {name}&apos;s profile</span>
        </Link>
        <p className="text-sm text-card/85">{shelterName}</p>

        {text ? (
          <div className="mt-1 text-sm leading-snug">
            <p className={open ? "max-h-40 overflow-y-auto whitespace-pre-wrap" : "line-clamp-2"}>
              {text}
            </p>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-1 font-semibold text-card underline-offset-2 hover:underline"
            >
              {open ? "less" : "more"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
