// app/admin/dashboard/DashboardClient.tsx
"use client";

import { useEffect, useState } from "react";
import AdminRightBar from "@/components/admin/AdminRightBar";
import type { ShelterMini } from "@/components/admin/AdminRightBar";

const MOCK_PETS = [
  {
    pet_id: "pet-1",
    media_id: "media-1",
    name: "Mochi",
    description: "Found near the market. Loves belly rubs...",
    color: "#F5C518",
    shelter: { shelter_id: "s-1", name: "Happy Paws Shelter", avatar_url: null } as ShelterMini,
  },
  {
    pet_id: "pet-2",
    media_id: "media-2",
    name: "Noodle",
    description: "Rescued from the street. Very playful and friendly...",
    color: "#e6b800",
    shelter: { shelter_id: "s-2", name: "Fur Ever Home", avatar_url: null } as ShelterMini,
  },
  {
    pet_id: "pet-3",
    media_id: "media-3",
    name: "Choco",
    description: "Gentle and calm. Great with kids and other pets...",
    color: "#f0c040",
    shelter: { shelter_id: "s-3", name: "Kalinga Shelter", avatar_url: null } as ShelterMini,
  },
];

type FeedNav = {
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  index: number;
  total: number;
};

export default function DashboardClient() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const active = MOCK_PETS[index];

  const nav: FeedNav = {
    next: () => setIndex((i) => Math.min(i + 1, MOCK_PETS.length - 1)),
    prev: () => setIndex((i) => Math.max(i - 1, 0)),
    hasNext: index < MOCK_PETS.length - 1,
    hasPrev: index > 0,
    index,
    total: MOCK_PETS.length,
  };

  return (
    <div className="min-h-svh bg-background flex px-10">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex justify-center items-center gap-6">

          {/* Mock Pet Card */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg flex flex-col justify-end"
            style={{ width: "340px", height: "520px", background: active.color }}
          >
            <div className="p-5">
              <p className="text-white font-bold text-xl">{active.name}</p>
              <p className="text-white/90 text-sm mt-1">
                {active.description}
                <span className="underline cursor-pointer ml-1">more</span>
              </p>
            </div>
          </div>

          {/* Admin Right Bar */}
          <AdminRightBar
            nav={nav}
            type="video"
            pet_id={active.pet_id}
            media_id={active.media_id}
            shelter={active.shelter}
          />

        </div>
      </main>
    </div>
  );
}