"use client";

import { useMemo, useState } from "react";
import { ClipboardText } from "@phosphor-icons/react";
import WebTemplate from "@/src/components/template/WebTemplate";
import NotifShelterCard from "@/src/components/cards/NotifShelterCard";
import EmptyState from "@/src/components/ui/EmptyState";
import { cn } from "@/src/lib/cn";
import type { PetGender } from "@/src/lib/types/shelters";

export type ShelterAdoptionStatus =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "not_approved"
  | "approved"
  | "withdrawn"
  | "adopted";

export type ShelterNotifItem = {
  id: string;
  petId: string;
  petName: string;
  petPhotoUrl: string | null;
  applicantId: string;
  applicantName: string;
  applicantPhotoUrl?: string | null;
  status: ShelterAdoptionStatus;
  sex: PetGender;
  species: "dog" | "cat" | null;
  submittedAt: string | null;
  updatedAt: string | null;
  shelterId: string;
  date?: string;
};

export type Props = {
  items?: ShelterNotifItem[];
  shelterLogo?: string | null;
  shelterName?: string | null;
};

type StatusFilter = ShelterAdoptionStatus | "all";
type SpeciesFilter = "all" | "dog" | "cat";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "New" },
  { value: "under_review", label: "Under review" },
  { value: "contacting_applicant", label: "Contacting" },
  { value: "approved", label: "Approved" },
  { value: "not_approved", label: "Not approved" },
  { value: "adopted", label: "Adopted" },
  { value: "withdrawn", label: "Withdrawn" },
];

const SPECIES_FILTERS: { value: SpeciesFilter; label: string }[] = [
  { value: "all", label: "All pets" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
        active ? "border-sunshine bg-sunshine text-ink" : "border-line bg-card text-ink hover:bg-sunshine-wash",
      )}
    >
      {children}
    </button>
  );
}

/** Incoming adoption applications, filtered by species and status. */
export default function NotifShelter({ items = [] }: Props) {
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const bySpecies = useMemo(
    () => (species === "all" ? items : items.filter((item) => item.species === species)),
    [items, species],
  );
  const filteredItems = useMemo(
    () => (status === "all" ? bySpecies : bySpecies.filter((item) => item.status === status)),
    [bySpecies, status],
  );
  const countFor = (value: StatusFilter) =>
    value === "all" ? bySpecies.length : bySpecies.filter((item) => item.status === value).length;

  return (
    <WebTemplate
      header="Applications"
      main={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2" aria-label="Species">
              {SPECIES_FILTERS.map((f) => (
                <Pill key={f.value} active={species === f.value} onClick={() => setSpecies(f.value)}>
                  {f.label}
                </Pill>
              ))}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Status">
              {STATUS_FILTERS.map((f) => (
                <Pill key={f.value} active={status === f.value} onClick={() => setStatus(f.value)}>
                  {f.label}
                  <span className="tabular-nums text-ink-soft">{countFor(f.value)}</span>
                </Pill>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState
              icon={<ClipboardText aria-hidden="true" />}
              title={items.length === 0 ? "No applications yet" : "No applications match"}
              description={items.length === 0 ? "When someone applies to adopt one of your pets, it shows up here." : undefined}
            />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <NotifShelterCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
