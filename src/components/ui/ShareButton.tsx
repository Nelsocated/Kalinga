"use client";

import { useState } from "react";
import { Check, LinkSimple } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

type ShareType = "pet" | "video" | "shelter";

type Props = {
  id: string;
  type: ShareType;
  className?: string;
};

const PATHS: Record<ShareType, string> = {
  pet: "/site/profiles/pets/",
  shelter: "/site/profiles/shelter/",
  video: "/site/home/pet/",
};

/** Copies a share link to the clipboard. */
export default function ShareButton({ id, type, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${PATHS[type]}${id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      aria-label={copied ? "Link copied" : "Copy link"}
      className={cn(
        "flex size-11 items-center justify-center rounded-full transition-[transform,background-color] duration-200 ease-out-expo hover:scale-105",
        className,
      )}
    >
      {copied ? (
        <Check size={24} weight="bold" aria-hidden="true" />
      ) : (
        <LinkSimple size={24} aria-hidden="true" />
      )}
      <span role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
