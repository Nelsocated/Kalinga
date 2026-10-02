"use client";

import Link from "next/link";
import { cn } from "@/src/lib/cn";
import Avatar from "../ui/Avatar";
import ShareButton from "../ui/ShareButton";
import LikeButton, { type LikeHandle } from "../ui/LikeButton";

export type ShelterMini = {
  id: string;
  shelter_name?: string | null;
  logo_url?: string | null;
};

type Props = {
  media_id?: string;
  shelter?: ShelterMini | null;
  className?: string;
  likeRef?: React.Ref<LikeHandle>;
};

/** Shelter, like and share for the active video: over the video on phones, beside it from md. */
export default function RightBar({ media_id, shelter, className, likeRef }: Props) {
  const shelterName = shelter?.shelter_name ?? "Shelter";

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {shelter?.id ? (
        <Link
          href={`/site/profiles/shelter/${shelter.id}`}
          aria-label={`Open ${shelterName}`}
          className="mb-1 rounded-full transition-transform duration-200 ease-out-expo hover:scale-105 active:scale-95"
        >
          <Avatar src={shelter.logo_url} name={shelterName} size={52} className="ring-2 ring-card md:ring-line" />
        </Link>
      ) : null}

      {media_id ? (
        <LikeButton
          ref={likeRef}
          key={media_id}
          targetType="video"
          targetId={media_id}
          size="lg"
          variant="overlay"
          showLabel
        />
      ) : null}

      {media_id ? (
        <ShareButton
          id={media_id}
          type="video"
          variant="overlay"
          showLabel
        />
      ) : null}
    </div>
  );
}
