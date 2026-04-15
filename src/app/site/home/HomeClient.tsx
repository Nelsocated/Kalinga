"use client";

import { useEffect, useState } from "react";
import Feed from "@/src/components/feed/Feed";
import RightBar, { ShelterMini } from "@/src/components/layout/RightBar";
import ScrollBar from "@/src/components/layout/ScrollBar";
import CreationPageView from "@/src/components/views/CreationPageView";

type FeedNavType = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

type ActiveItem = {
  pet_id: string;
  media_id: string | null;
  shelter: ShelterMini | null;
};

type Props = {
  isShelter: boolean;
  isAdmin: boolean;
  initialMediaId?: string | null;
};

export default function HomeClient({
  isShelter,
  isAdmin,
  initialMediaId,
}: Props) {
  const [nav, setNav] = useState<FeedNavType | null>(null);
  const [active, setActive] = useState<ActiveItem | null>(null);
  const [showCreationPage, setShowCreationPage] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!nav || showCreationPage) return;

    let lastScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScroll < 400) return;

      if (e.deltaY > 0 && nav.hasNext) nav.next();
      if (e.deltaY < 0 && nav.hasPrev) nav.prev();

      lastScroll = now;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => window.removeEventListener("wheel", handleWheel);
  }, [nav, showCreationPage]);

  return (
    <div className="flex h-svh bg-background px-10">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-4">
          {showCreationPage ? (
            <div className="h-[85svh] w-[48svh]">
              <CreationPageView />
            </div>
          ) : (
            <>
              <Feed
                onActiveChange={setActive}
                onNavChange={setNav}
                initialMediaId={initialMediaId}
              />

              {active && (
                <RightBar
                  media_id={active.media_id ?? ""}
                  shelter={active.shelter}
                />
              )}
            </>
          )}
        </div>

        <div className="absolute right-10">
          {nav && (
            <ScrollBar
              onNext={nav.next}
              onPrev={nav.prev}
              hasNext={nav.hasNext}
              hasPrev={nav.hasPrev}
              isShelter={isShelter}
              isAdmin={isAdmin}
              onOpenCreation={() => setShowCreationPage(true)}
              onCloseCreation={() => setShowCreationPage(false)}
              isCreationOpen={showCreationPage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
