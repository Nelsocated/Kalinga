"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import BackIcon from "@/public/buttons/Back.svg";
import WhiteBack from "@/public/buttons/WhiteBack.svg";

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
      className={`flex items-center justify-center hover:scale-110 ${className ?? ""}`}
    >
      <Image
        src={isModal ? WhiteBack : BackIcon}
        alt="Back"
        width={15}
        height={15}
        priority
      />
    </button>
  );
}
