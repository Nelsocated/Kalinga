"use client";

import { useMemo, useState } from "react";
import type {
  ShelterApplicationItem,
  ShelterApplicationStatus,
} from "@/src/lib/services/adminService";
import ShelterApplicationCard from "../../../components/cards/ShelterApplicationCard";
import WebTemplate from "@/src/components/template/WebTemplate";
import Select from "@/src/components/ui/Select";

type Props = {
  initialApplications: ShelterApplicationItem[];
  initialError?: string | null;
};

export default function AdminDashboardClient({
  initialApplications,
  initialError = null,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<
    ShelterApplicationStatus | "all"
  >("all");

  const filteredApplications = useMemo(() => {
    if (selectedFilter === "all") return initialApplications;

    return initialApplications.filter(
      (item) => item.applicationStatus === selectedFilter,
    );
  }, [initialApplications, selectedFilter]);

  const statusOptions: {
    label: string;
    value: ShelterApplicationStatus | "all";
  }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Under Review", value: "under_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <WebTemplate
      header={<div>Shelter Application</div>}
      main={
        <>
          <div className="flex flex-col gap-3 border-b border-primary/20 px-5 py-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-black md:text-base">
                Number of Shelter Applications:
              </span>
              <div className="rounded-[15px] border border-primary/40 px-4 py-1 text-lg font-semibold">
                {filteredApplications.length}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="status-filter"
                className="text-sm font-semibold text-black md:text-base"
              >
                Filter:
              </label>

              <Select
                value={selectedFilter}
                onChange={(val) => setSelectedFilter(val)}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="p-4">
            {initialError ? (
              <div className="rounded-[15px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {initialError}
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="rounded-[15px] border border-dashed border-primary/30 px-4 py-10 text-center text-sm text-neutral-500">
                No shelter applications found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredApplications.map((item) => (
                  <ShelterApplicationCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      }
    />
  );
}
