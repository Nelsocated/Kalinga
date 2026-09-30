"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CaretDown, CaretUp, ClipboardText, FileText, Plus } from "@phosphor-icons/react";
import Feed, { type ActiveItem, type FeedNav } from "@/src/components/feed/Feed";
import RightBar from "@/src/components/layout/RightBar";
import { buttonStyles } from "@/src/components/ui/Button";
import type { LikeHandle } from "@/src/components/ui/LikeButton";
import { cn } from "@/src/lib/cn";

type Props = {
  isShelter: boolean;
  isAdmin: boolean;
  initialMediaId?: string | null;
};

const roundIcon = buttonStyles({
  variant: "secondary",
  size: "icon",
  className: "disabled:opacity-40",
});

/** Shortcuts for shelter and admin accounts: create, applications, review. */
function StaffShortcuts({ isShelter, isAdmin }: { isShelter: boolean; isAdmin: boolean }) {
  if (!isShelter && !isAdmin) return null;

  return (
    <div className="flex gap-2 md:flex-col">
      {isAdmin ? (
        <Link href="/admin/dashboard" aria-label="Review shelter applications" className={roundIcon}>
          <ClipboardText aria-hidden="true" />
        </Link>
      ) : (
        <>
          <Link href="/shelter/creation" aria-label="Create a post" className={buttonStyles({ variant: "primary", size: "icon" })}>
            <Plus weight="bold" aria-hidden="true" />
          </Link>
          <Link href="/shelter/notification" aria-label="Adoption applications" className={roundIcon}>
            <FileText aria-hidden="true" />
          </Link>
        </>
      )}
    </div>
  );
}

export default function HomeClient({ isShelter, isAdmin, initialMediaId }: Props) {
  const [nav, setNav] = useState<FeedNav | null>(null);
  const [active, setActive] = useState<ActiveItem | null>(null);
  const likeRef = useRef<LikeHandle>(null);

  // The feed is the page: no document scroll behind it
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div className="relative flex h-dvh items-center justify-center md:gap-5 md:px-6">
      <Feed
        onActiveChange={setActive}
        onNavChange={setNav}
        onDoubleTap={() => likeRef.current?.like()}
        initialMediaId={initialMediaId}
      />

      {active ? (
        <RightBar
          media_id={active.media_id ?? ""}
          shelter={active.shelter}
          likeRef={likeRef}
          className="absolute right-3 bottom-28 z-10 md:static"
        />
      ) : null}

      {/* Phones: staff shortcuts float over the top of the video */}
      <div className="absolute top-4 right-3 z-10 md:hidden">
        <StaffShortcuts isShelter={isShelter} isAdmin={isAdmin} />
      </div>

      <div
        className={cn(
          "hidden h-[calc(100dvh-4rem)] flex-col items-center justify-between md:flex",
          !isShelter && !isAdmin && "justify-center",
        )}
      >
        <StaffShortcuts isShelter={isShelter} isAdmin={isAdmin} />

        {nav ? (
          <div className="flex flex-col gap-2">
            <button type="button" onClick={nav.prev} disabled={!nav.hasPrev} aria-label="Previous video" className={roundIcon}>
              <CaretUp aria-hidden="true" />
            </button>
            <button type="button" onClick={nav.next} disabled={!nav.hasNext} aria-label="Next video" className={roundIcon}>
              <CaretDown aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {isShelter || isAdmin ? <span aria-hidden="true" /> : null}
      </div>
    </div>
  );
}
