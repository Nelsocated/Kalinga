"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LinkSimple } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

type ShareType = "pet" | "video" | "shelter";

type Props = {
  id: string;
  type: ShareType;
  /** Same looks as LikeButton so action rows and the feed rail match. */
  variant?: "plain" | "outlined" | "overlay";
  /** Shows "Share" / "Copied" under the icon (the feed rail). */
  showLabel?: boolean;
  className?: string;
};

const PATHS: Record<ShareType, string> = {
  pet: "/site/profiles/pets/",
  shelter: "/site/profiles/shelter/",
  video: "/site/home/pet/",
};

const VARIANTS = {
  plain: "text-ink hover:bg-sunshine-wash",
  outlined: "border border-line bg-card text-ink hover:bg-sunshine-wash hover:shadow-lift",
  overlay:
    "text-card drop-shadow-[0_1px_6px_rgb(4_38_102/0.55)] md:text-ink md:drop-shadow-none md:hover:bg-sunshine-wash",
};

/** Copies a share link to the clipboard. */
export default function ShareButton({ id, type, variant = "plain", showLabel = false, className }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${PATHS[type]}${id}`);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <span className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={cn(
          "flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,box-shadow,transform] duration-200 ease-out-expo active:scale-90",
          VARIANTS[variant],
          className,
        )}
      >
        {copied ? (
          <Check size={26} weight="bold" aria-hidden="true" />
        ) : (
          <LinkSimple size={26} weight="bold" aria-hidden="true" />
        )}
        <span role="status" className="sr-only">
          {copied ? "Link copied" : ""}
        </span>
      </button>

      {showLabel ? (
        <span
          aria-hidden="true"
          className={cn(
            "text-xs font-semibold",
            variant === "overlay"
              ? "text-card drop-shadow-[0_1px_4px_rgb(4_38_102/0.6)] md:text-ink md:drop-shadow-none"
              : "text-ink",
          )}
        >
          {copied ? "Copied" : "Share"}
        </span>
      ) : null}
    </span>
  );
}
