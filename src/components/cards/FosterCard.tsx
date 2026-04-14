"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import Forward from "@/public/buttons/Forward(2).svg";

type FosterCardProps = {
  href: string; // for foster profile button
  title: string;
  description: string;
  children: ReactNode;
};

export default function FosterCard({
  href,
  title,
  description,
  children,
}: FosterCardProps) {
  return (
    <div className="relative flex w-full rounded-[15px] border-2 transition hover:shadow-lg">
      <div className="flex w-full rounded-[15px] bg-chip">
        <div>{children}</div>

        <div className="flex flex-1 flex-col justify-between px-5 py-2">
          <div>
            <h3
              className="text-justify text-lg text-primary
[text-shadow:-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black,1px_1px_0_black] leading-7 font-extrabold wrap-break-words line-clamp-2"
            >
              “{title}”
            </h3>
            <p className="ml-4 text-justify leading-6 wrap-break-words line-clamp-4">
              {description}
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center mr-5">
          <Link href={href}>
            <Image src={Forward} alt="forward-icon" width={15} height={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
