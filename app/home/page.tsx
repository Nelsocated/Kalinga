"use client";

import { useState } from "react";
import { useEffect } from "react";
import Feed from "@/components/feed/Feed";
import NavBar from "@/components/layout/NavBar";

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
        <Feed onNavReady={setNav} />
      </main>

      <aside className="w-24 shrink-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <button className="h-12 w-12 rounded-full bg-[#d4a42a]" />
          <button className="h-12 w-12 rounded-full bg-[#d4a42a]" />
          <button className="h-12 w-12 rounded-full bg-[#d4a42a]" />

          <button
            disabled={!nav?.hasPrev}
            onClick={() => nav?.prev()}
            className="h-11 w-11 rounded-full bg-[#d4a42a] disabled:opacity-40"
          >
            ↑
          </button>

          <button
            disabled={!nav?.hasNext}
            onClick={() => nav?.next()}
            className="h-11 w-11 rounded-full bg-[#d4a42a] disabled:opacity-40"
          >
            ↓
          </button>
        </div>
      </aside>
    </div>
  );
}
