"use client";

import { useMemo, useState } from "react";
import type { DashboardContentItem } from "../dashboard/DashboardClient";
import Image from "next/image";
import Select from "@/components/ui/Select";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

type FilterType = "all" | "dogs" | "cats";

type Props = {
  items: DashboardContentItem[];
};

function formatDate(date: string | null) {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ContentCard({ items }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredItems = useMemo(() => {
    if (filter === "dogs") {
      return items.filter((item) => item.species === "dog");
    }

    if (filter === "cats") {
      return items.filter((item) => item.species === "cat");
    }

    return items;
  }, [items, filter]);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[15px] border-2">
      <div className="px-4 py-2">
        <div className="grid w-full grid-cols-[1fr_45px_120px_120px] items-center gap-6">
          {/* Select */}
          <Select value={filter} onChange={setFilter} />
          <div />

          {/* Views */}
          <div className="text-center text-subtitle font-medium text-black">
            Views
          </div>

          {/* Likes */}
          <div className="text-center text-subtitle font-medium text-black">
            Likes
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 px-3 py-1">
        <div className="space-y-0">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-black/60">
              No content yet.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[56px_1fr] items-center gap-3 rounded-[15px] bg-white px-3 py-1 sm:grid-cols-[50px_1fr_120px_120px]"
              >
                <div className="h-14 w-16 overflow-hidden">
                  <Image
                    src={item.photo_url ?? DEFAULT_AVATAR_URL}
                    alt={item.petName}
                    height={40}
                    width={50}
                  />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-lg font-bold text-black">
                    {item.title} - {item.petName}
                  </div>
                  <div className="text-sm text-black">
                    {formatDate(item.datePosted)}
                  </div>
                </div>

                <div className="flex justify-center text-lg font-bold text-black sm:flex">
                  {formatCount(item.views)}
                </div>

                <div className="flex justify-center text-lg font-bold text-black sm:flex">
                  {formatCount(item.likes)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
