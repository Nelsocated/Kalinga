"use client";

import { LinkSimple } from "@phosphor-icons/react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import SexIcon from "../ui/SexIcon";
import type { PetCardProps } from "@/src/lib/types/shelters";

/** Which pet a post is about: the chosen pet, or a button to choose one. */
export default function LinkedPetField({
  pet,
  onChoose,
}: {
  pet: PetCardProps | null;
  onChoose: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">Pet</span>
      {pet ? (
        <div className="flex items-center gap-3 rounded-md border border-line bg-card p-3">
          <Avatar src={pet.imageUrl} name={pet.petName ?? "Pet"} size={48} className="rounded-md" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="truncate">{pet.petName ?? "Unnamed pet"}</span>
              <SexIcon sex={pet.gender} size={16} />
            </p>
            <p className="truncate text-sm text-muted">
              {[pet.species, pet.age, pet.size].filter(Boolean).join(" · ").replace(/_/g, " ")}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onChoose}>
            Change
          </Button>
        </div>
      ) : (
        <Button variant="secondary" onClick={onChoose} icon={<LinkSimple aria-hidden="true" />} className="w-fit">
          Choose a pet
        </Button>
      )}
    </div>
  );
}
