"use client";

import { useMemo, useState } from "react";
import { FilmSlate } from "@phosphor-icons/react";
import type { DashboardContentItem } from "../../app/shelter/dashboard/DashboardClient";
import Avatar from "../ui/Avatar";
import Select from "../ui/Select";
import EmptyState from "../ui/EmptyState";
import { LinkButton } from "../ui/Button";

type FilterType = "all" | "dogs" | "cats";

type Props = {
  items: DashboardContentItem[];
};

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All pets", value: "all" },
  { label: "Dogs", value: "dogs" },
  { label: "Cats", value: "cats" },
];

function formatDate(date: string | null) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** The shelter's posts with views and likes: a table from md, stacked cards on phones. */
export default function ContentCard({ items }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredItems = useMemo(() => {
    if (filter === "dogs") return items.filter((item) => item.species === "dog");
    if (filter === "cats") return items.filter((item) => item.species === "cat");
    return items;
  }, [items, filter]);

  return (
    <section aria-labelledby="content-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="content-heading" className="text-xl font-semibold text-ink">
          Your posts
        </h2>
        <Select aria-label="Filter posts by species" value={filter} onChange={setFilter} options={filterOptions} className="w-40" />
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<FilmSlate aria-hidden="true" />}
          title={items.length === 0 ? "No posts yet" : "No posts for this filter"}
          action={
            items.length === 0 ? (
              <LinkButton href="/shelter/creation/postVideo" variant="primary">
                Post a video
              </LinkButton>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-card">
          <div className="hidden grid-cols-[minmax(0,1fr)_96px_96px] gap-4 border-b border-line px-4 py-3 text-xs font-medium text-muted md:grid">
            <span>Post</span>
            <span className="text-right">Views</span>
            <span className="text-right">Likes</span>
          </div>
          <ul className="divide-y divide-line">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 md:grid-cols-[minmax(0,1fr)_96px_96px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={item.photo_url} name={item.petName} size={48} className="rounded-md" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{item.title}</p>
                    <p className="truncate text-sm text-muted">
                      {item.petName} · {formatDate(item.datePosted)}
                    </p>
                  </div>
                </div>
                <p className="text-right text-sm tabular-nums text-ink md:text-base">
                  <span className="md:sr-only">Views </span>
                  {formatCount(item.views)}
                </p>
                <p className="col-start-2 text-right text-sm tabular-nums text-ink md:col-start-auto md:text-base">
                  <span className="md:sr-only">Likes </span>
                  {formatCount(item.likes)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
