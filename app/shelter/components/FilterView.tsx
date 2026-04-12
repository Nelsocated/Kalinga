"use client";
import type { ShelterAdoptionStatus } from "../notification/NotifShelter";
export type SpeciesFilter = "dog" | "cat";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Cat from "@/public/icons/Cat.svg";
import Dog from "@/public/icons/Dog.svg";
type Props = {
  species: SpeciesFilter;
  status: ShelterAdoptionStatus;
  onSpeciesChange: (value: SpeciesFilter) => void;
  onStatusChange: (value: ShelterAdoptionStatus) => void;
  onEnter: () => void;
};

const statusOptions: Array<{
  value: ShelterAdoptionStatus;
  label: string;
  className: string;
  active: string;
}> = [
  {
    value: "pending",
    label: "Submitted",
    className: "text-submitted border-submitted",
    active: "text-white border-submitted bg-submitted",
  },
  {
    value: "under_review",
    label: "Under Review",
    className: "text-under_review border-under_review",
    active: "text-white border-under_review bg-under_review",
  },
  {
    value: "contacting_applicant",
    label: "Contacting Applicant",
    className: "text-contacting border-contacting",
    active: "text-white border-contacting bg-contacting",
  },
  {
    value: "not_approved",
    label: "Not Approved",
    className: "text-reject border-reject",
    active: "text-white border-reject bg-reject",
  },
  {
    value: "approved",
    label: "Approved",
    className: "text-approved border-approved",
    active: "text-black border-approved bg-approved",
  },
  {
    value: "adopted",
    label: "Adopted",
    className: "text-adopted border-adopted",
    active: "text-black border-adopted bg-adopted",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
    className: "text-withdrawn border-withdrawn",
    active: "text-black border-withdrawn bg-withdrawn",
  },
];

export default function FilterView({
  species,
  status,
  onSpeciesChange,
  onStatusChange,
  onEnter,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-3 border-b-2 px-5 py-4">
        <span className="text-lg font-semibold text-black">
          Select Species:
        </span>

        <Button
          type="button"
          icon={getIcon("dog")}
          onClick={() => onSpeciesChange("dog")}
          className={species === "dog" ? "bg-primary border" : ""}
        >
          Dog
        </Button>

        <Button
          type="button"
          icon={getIcon("cat")}
          onClick={() => onSpeciesChange("cat")}
          className={species === "cat" ? "bg-primary border" : ""}
        >
          Cat
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-5">
        <h2 className="mb-6 text-center text-subheader font-bold text-black">
          Select Status to review:
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {statusOptions.map((option) => {
            const isActive = status === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusChange(option.value)}
                className={`min-w-40 rounded-[15px] border px-4 py-2 text-sm font-semibold transition ${
                  isActive ? option.active : option.className
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={onEnter}
          className="mt-10 border px-10 py-2 text-base font-semibold text-black"
        >
          Enter
        </Button>
      </div>
    </>
  );
}

export function getIcon(species: string) {
  if (species == "cat") {
    return <Image src={Cat} alt={`cat-icon`} width={40} height={40} />;
  }
  if (species == "dog") {
    return <Image src={Dog} alt={`dog`} width={30} height={30} />;
  }
}
