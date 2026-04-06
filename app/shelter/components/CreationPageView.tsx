"use client";

import Image from "next/image";
import Link from "next/link";
import at_pet from "@/public/tabs/at_pet.svg";
import Video from "@/public/icons/Video.svg";
import Foster from "@/public/icons/Foster.svg";

const actions = [
  {
    label: "Post a Video",
    icon: Video,
    href: "/shelter/creation/postVideo",
  },
  {
    label: "Add a Pet",
    icon: at_pet,
    href: "/shelter/creation/addPet",
    width: 70,
    height: 70,
  },
  {
    label: "Write a Foster Story",
    icon: Foster,
    href: "/shelter/creation/fosterStory",
  },
];

export default function CreationPageView() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[15px] border-2 bg-white shadow-xl">
      <div className="flex w-full flex-col gap-4 px-3 py-3">
        {actions.map(({ label, icon, href, width, height }) => (
          <Link
            key={label}
            href={href}
            className="flex min-h-43 w-full flex-col items-center justify-center gap-3 rounded-[15px] bg-primary px-4 py-6 text-center shadow-md transition duration-150 hover:brightness-95 active:scale-95"
          >
            <Image
              src={icon}
              alt={label}
              width={width ? width : 34}
              height={height ? height : 34}
            />
            <span className="text-base font-semibold tracking-wide text-white">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
