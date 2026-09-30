"use client";

import { PawPrint } from "@phosphor-icons/react";
import PetCard from "../cards/PetCard";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";
import type { PetGender } from "@/src/lib/types/shelters";

type ShelterPetMini = {
  id: string;
  imageUrl: string | null;
  petName: string | null;
  gender: PetGender;
  shelterName: string | null;
  shelterLogo: string | null;
};

type Props = {
  open: boolean;
  pets: ShelterPetMini[];
  onClose: () => void;
  onSelect: (pet: ShelterPetMini) => void;
};

/** Pick which of the shelter's pets a post is about. */
export default function LinkPetModal({ open, pets, onClose, onSelect }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a pet" className="sm:max-w-2xl">
      {pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint aria-hidden="true" />}
          title="No pets yet"
          description="Add a pet first, then you can link posts to it."
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {pets.map((pet) => (
            <li key={pet.id}>
              <button
                type="button"
                onClick={() => onSelect(pet)}
                className="w-full rounded-lg text-left transition-transform duration-200 ease-out-expo hover:-translate-y-0.5"
              >
                <PetCard
                  imageUrl={pet.imageUrl}
                  petName={pet.petName || "Unnamed pet"}
                  sex={pet.gender}
                  resize
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
