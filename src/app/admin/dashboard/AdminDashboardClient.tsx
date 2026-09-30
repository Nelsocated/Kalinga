"use client";

import { useMemo, useState } from "react";
import { ClipboardText } from "@phosphor-icons/react";
import type { ShelterApplicationItem, ShelterApplicationStatus } from "@/src/lib/services/adminService";
import ShelterApplicationCard from "@/src/components/cards/ShelterApplicationCard";
import WebTemplate from "@/src/components/template/WebTemplate";
import EmptyState from "@/src/components/ui/EmptyState";
import { cn } from "@/src/lib/cn";

type Props = {
  initialApplications: ShelterApplicationItem[];
  initialError?: string | null;
};

type Filter = ShelterApplicationStatus | "all";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Under review", value: "under_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

/** The queue of shelter applications, filterable by status. */
export default function AdminDashboardClient({ initialApplications, initialError = null }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? initialApplications : initialApplications.filter((i) => i.applicationStatus === filter)),
    [initialApplications, filter],
  );

  const countFor = (value: Filter) =>
    value === "all" ? initialApplications.length : initialApplications.filter((i) => i.applicationStatus === value).length;

  return (
    <WebTemplate
      header="Shelter applications"
      main={
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
                  filter === f.value ? "border-sunshine bg-sunshine text-ink" : "border-line bg-card text-ink hover:bg-sunshine-wash",
                )}
              >
                {f.label}
                <span className="tabular-nums text-ink-soft">{countFor(f.value)}</span>
              </button>
            ))}
          </div>

          {initialError ? (
            <p role="alert" className="rounded-md bg-reject/10 px-4 py-3 text-sm text-reject-text">
              {initialError}
            </p>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<ClipboardText aria-hidden="true" />} title="No applications here" />
          ) : (
            <ul className="grid gap-3 lg:grid-cols-2">
              {filtered.map((item) => (
                <li key={item.id}>
                  <ShelterApplicationCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
