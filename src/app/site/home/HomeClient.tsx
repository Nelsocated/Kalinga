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

  return (
    <div className="flex h-svh bg-background px-10">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-4">
            {showCreationPage ? (
              <>
                <div className="h-[85svh] w-[48svh]">
                  <CreationPageView />
                </div>

                <div className="w-18" />
              </>
            ) : (
              <>
                <Feed
                  onActiveChange={setActive}
                  onNavChange={setNav}
                  initialMediaId={initialMediaId}
                />

                <div>
                  {active ? (
                    <RightBar
                      media_id={active.media_id ?? ""}
                      shelter={active.shelter}
                    />
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className="absolute right-10">
            {nav ? (
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
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
