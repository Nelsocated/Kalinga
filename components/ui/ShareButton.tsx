"use client";

import { useState } from "react";
import Image from "next/image";
import copy_button from "@/public/buttons/Copy.svg";

type ShareType = "pet" | "video" | "shelter";

type Props = {
  id: string;
  type: ShareType;
  className?: string;
};

export default function ShareButton({ id, type, className }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      const base = window.location.origin;
      let shareUrl = base;

      if (type === "pet") {
        shareUrl = `${base}/site/profiles/pets/${id}`;
      }

      if (type === "shelter") {
        shareUrl = `${base}/site/profiles/shelter/${id}`;
      }

      if (type === "video") {
        shareUrl = `${base}/site/home/pet/${id}`;
      }

      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copyLink}
      className={[
        "h-10 rounded-full overflow-hidden bg-primary flex flex-col items-center justify-center transition",
        className,
      ].join(" ")}
    >
      {copied ? (
        <span className="text-xs font-semibold">Copied</span>
      ) : (
        <Image src={copy_button} alt="copy-link" width={43} height={43} />
      )}
    </button>
  );
}
