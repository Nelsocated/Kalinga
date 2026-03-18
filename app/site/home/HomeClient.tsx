"use client";

import { useEffect, useState } from "react";
import Feed from "@/components/feed/Feed";
import RightBar, { ShelterMini } from "@/components/layout/RightBar";

type FeedNav = {
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

export default function HomeClient() {
  const [nav, setNav] = useState<FeedNav | null>(null);
  const [active, setActive] = useState<ActiveItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-svh bg-background flex px-10">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex justify-center items-center gap-3">
          <Feed onActiveChange={setActive} onNavChange={setNav} />

          {active ? (
            <RightBar
              nav={nav}
              type="video"
              pet_id={active.pet_id}
              media_id={active.media_id ?? ""}
              shelter={active.shelter}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
