"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import BackIcon from "@/public/buttons/Back.svg";

type Props = {
  onClick?: () => void;
  className?: string;
};

export default function Back_Button({ onClick, className }: Props) {
  const router = useRouter();

  function handleClick() {
    if (onClick) {
      onClick(); // modal close or custom behavior
    } else {
      router.back(); // default: go to previous page
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center ${className ?? ""}`}
    >
      <Image src={BackIcon} alt="Back" width={35} height={35} priority />
    </button>
  );
}
