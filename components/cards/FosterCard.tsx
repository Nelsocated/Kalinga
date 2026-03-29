"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import Forward from "@/public/buttons/Forward.svg";

type FosterCardProps = {
  href: string; // for foster profile button
  petId: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function FosterCard({
  href,
  petId,
  title,
  description,
  children,
}: FosterCardProps) {
  return (
    <div className="relative flex w-full rounded-[15px] border-2 bg-primary transition hover:shadow-lg">
      <div className="flex w-full rounded-[15px] bg-background">
        <div>{children}</div>

        <div className="flex flex-1 flex-col justify-between p-7">
          <div>
            <h3 className="text-3xl font-extrabold">“{title}”</h3>
            <p className="ml-4 line-clamp-4 wrap-break-words overflow-hidden pt-2 pr-10 whitespace-pre-line break-all text-justify truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center mr-5">
          <Link href={href}>
            <Image src={Forward} alt="forward-icon" width={40} height={40} />
          </Link>
        </div>
      </div>
    </div>
  );
}
