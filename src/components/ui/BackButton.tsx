"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

type Props = {
  onClick?: () => void;
  className?: string;
  isModal?: boolean;
};

export default function BackButton({
  onClick,
  className,
  isModal = false,
}: Props) {
  const router = useRouter();

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }

    if (window.history.length > 2) {
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
      className={`flex items-center justify-center hover:scale-110 ${className ?? ""}`}
    >
      <ArrowLeft
        size={22}
        className={isModal ? "text-white" : "text-ink"}
        aria-hidden="true"
      />
    </button>
  );
}
