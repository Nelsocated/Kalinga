"use client";

import { LinkSimple, PawPrint } from "@phosphor-icons/react";
import Avatar from "../ui/Avatar";
import Button, { LinkButton } from "../ui/Button";
import SexIcon from "../ui/SexIcon";
import type { PetCardProps } from "@/src/lib/types/shelters";

/** Which pet a post is about: the chosen pet, a button to choose one, or a way to add the first pet. */
export default function LinkedPetField({
  pet,
  onChoose,
  hasPets = true,
  error,
}: {
  pet: PetCardProps | null;
  onChoose: () => void;
  hasPets?: boolean;
  error?: string;
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
      ) : hasPets ? (
        <Button
          variant="secondary"
          onClick={onChoose}
          icon={<LinkSimple aria-hidden="true" />}
          className="w-fit"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "linked-pet-error" : undefined}
        >
          Choose a pet
        </Button>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-md border border-line bg-ground p-4">
          <p className="text-sm text-ink-soft">
            You haven&apos;t added any pets yet. Posts are always about one of your pets, so add a pet first.
          </p>
          <LinkButton href="/shelter/creation/addPet" variant="secondary" size="sm" icon={<PawPrint aria-hidden="true" />}>
            Add a pet
          </LinkButton>
        </div>
      )}
      {error && hasPets && !pet ? (
        <p id="linked-pet-error" className="text-xs font-medium text-reject-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
