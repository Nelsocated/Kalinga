// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Feed from "@/components/feed/Feed";
import NavBar from "@/components/layout/NavBar";
import RightBar, { ShelterMini } from "@/components/layout/RightBar";
import { LikeTargetType } from "@/lib/services/likes";

type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

export default function HomePage() {
  const [nav, setNav] = useState<FeedNav | null>(null);
  const [active, setActive] = useState<{
    pet_id: string;
    shelter: ShelterMini | null;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-[100svh] bg-[#f6f3ee] flex px-10">
      <NavBar />

      <main className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-3">
          <Feed onNavReady={setNav} onActiveChange={setActive} />

          {active ? (
            <RightBar
              nav={nav}
              type={"pet" as LikeTargetType}
              pet_id={active.pet_id}
              shelter={active.shelter}
            />
          ) : (
            <div className="w-40 text-xs text-black/40 text-center">Loading…</div>
          )}
        </div>
      </main>
    </div>
  );
}