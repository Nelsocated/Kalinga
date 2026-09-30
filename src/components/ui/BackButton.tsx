"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { buttonStyles } from "./Button";

type Props = {
  onClick?: () => void;
  className?: string;
  /** Light arrow for dark surfaces. */
  isModal?: boolean;
};

export default function BackButton({ onClick, className, isModal = false }: Props) {
  const router = useRouter();

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/site/home");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className={buttonStyles({
        variant: "ghost",
        size: "icon",
        className: [isModal ? "text-white hover:bg-white/15" : "", className]
          .filter(Boolean)
          .join(" "),
      })}
    >
      <ArrowLeft size={22} aria-hidden="true" />
    </button>
  );
}
