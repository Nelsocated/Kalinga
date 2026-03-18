"use client";

import { ReactNode } from "react";
import LikeButton from "../ui/LikeButton";

type FosterCardProps = {
  petId: string; // pet id
  title: string;
  description: string;
  children: ReactNode;
};

export default function FosterCard({
  petId,
  title,
  description,
  children,
}: FosterCardProps) {
  return (
    <div className="relative flex w-full rounded-[15px] border-2 bg-primary hover:shadow-lg transition">
      <div className="flex bg-background rounded-[15px] w-full">
        <div>{children}</div>

        <div className="flex-1 p-7">
          <h3 className="text-3xl font-extrabold">“{title}”</h3>
          <p className="text-lg leading-relaxed text-justify line-clamp-6 ml-4">
            {description}
          </p>
          <div className="flex justify-end absolute right-10 top-7">
            <LikeButton
              targetType="pet"
              targetId={petId}
              className="w-15 h-15"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
