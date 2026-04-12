"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import BackIcon from "@/public/buttons/Back.svg";

type Props = {
  onClick?: () => void;
  className?: string;
};

export default function BackButton({ onClick, className }: Props) {
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
      className={`flex items-center justify-center ${className ?? ""}`}
    >
      <Image src={BackIcon} alt="Back" width={40} height={40} priority />
    </button>
  );
}
