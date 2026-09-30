"use client";

import Link from "next/link";
import { HandHeart, PawPrint, PlayCircle } from "@phosphor-icons/react";

const actions = [
  {
    label: "Post a Video",
    icon: PlayCircle,
    href: "/shelter/creation/postVideo",
  },
  {
    label: "Add a Pet",
    icon: PawPrint,
    href: "/shelter/creation/addPet",
  },
  {
    label: "Write a Foster Story",
    icon: HandHeart,
    href: "/shelter/creation/writeFoster",
  },
];

export default function CreationPageView() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[15px] border-2 bg-white shadow-xl">
      <div className="flex w-full flex-col gap-4 px-3 py-3">
        {actions.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex min-h-43 w-full flex-col items-center justify-center gap-3 rounded-[15px] bg-primary px-4 py-6 text-center shadow-md transition duration-150 hover:brightness-95 active:scale-95"
          >
            <item.icon size={40} className="text-white" aria-hidden="true" />
            <span className="text-base font-semibold tracking-wide text-white">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
