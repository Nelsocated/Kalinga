"use client";

import { useMemo, useState } from "react";
import WebTemplate from "@/src/components/template/WebTemplate";
import FilterView, {
  type SpeciesFilter,
  getIcon,
} from "@/src/components/views/FilterView";
import type { PetGender } from "@/src/lib/types/shelters";
import NotifShelterCard from "@/src/components/cards/NotifShelterCard";
import Button from "@/src/components/ui/Button";
import Filter from "@/public/icons/Filter.svg";
import Image from "next/image";

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

const statusLabelMap: Record<ShelterAdoptionStatus, string> = {
  pending: "Submitted",
  under_review: "Under Review",
  contacting_applicant: "Contacting Applicant",
  not_approved: "Not Approved",
  approved: "Approved",
  withdrawn: "Withdrawn",
  adopted: "Adopted",
};

const statusActiveClassMap: Record<ShelterAdoptionStatus, string> = {
  pending: "text-white border-submitted bg-submitted",
  under_review: "text-white border-under_review bg-under_review",
  contacting_applicant: "text-white border-contacting bg-contacting",
  not_approved: "text-white border-reject bg-reject",
  approved: "text-black border-approved bg-approved",
  withdrawn: "text-black border-withdrawn bg-withdrawn",
  adopted: "text-black border-adopted bg-adopted",
};

export default function NotifShelter({ items = [] }: Props) {
  const [species, setSpecies] = useState<SpeciesFilter>("dog");
  const [status, setStatus] = useState<ShelterAdoptionStatus>("pending");
  const [isReviewing, setIsReviewing] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) => item.species === species && item.status === status,
    );
  }, [items, species, status]);

  const activeStatusClass = statusActiveClassMap[status];

  return (
    <WebTemplate
      header={"Notification"}
      main={
        <main className="flex h-full min-h-0 flex-col ">
          {!isReviewing ? (
            <FilterView
              species={species}
              status={status}
              onSpeciesChange={setSpecies}
              onStatusChange={setStatus}
              onEnter={() => setIsReviewing(true)}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 px-5 py-2">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-black">
                      Species:
                    </span>

                    <span className="flex items-center gap-2 rounded-[15px] border border-primary bg-primary px-3 py-1 text-lg font-semibold text-black">
                      {getIcon(species)}
                      {species === "dog" ? "Dog" : "Cat"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-black">
                      Status:
                    </span>

                    <span
                      className={`flex items-center rounded-[15px] border px-3 py-1 text-lg font-semibold ${activeStatusClass}`}
                    >
                      {statusLabelMap[status]}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  className="rounded-[15px] border bg-transparent px-3 py-1 text-sm font-semibold text-black"
                >
                  <Image
                    src={Filter}
                    alt="filter-icon"
                    width={30}
                    height={30}
                  />
                </Button>
              </div>

              <div className="px-5 py-3">
                <p className="text-base font-semibold text-black">
                  {statusLabelMap[status]} Application(s) for{" "}
                  {species === "dog" ? "Dogs" : "Cats"}
                </p>
              </div>

              <section className="min-h-0 flex-1 overflow-y-auto px-4">
                {filteredItems.length === 0 ? (
                  <div className="flex min-h-60 items-center justify-center rounded-[15px] border border-dashed">
                    <p className="text-sm text-black/70">
                      No applications found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-2">
                    {filteredItems.map((item) => (
                      <NotifShelterCard
                        key={item.id}
                        item={item}
                        status={item.status}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      }
    />
  );
}
