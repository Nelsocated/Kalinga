"use client";

import PetCard from "@/components/cards/PetCard";
import BackButton from "../ui/BackButton";
import type { PetGender } from "@/lib/types/shelters";

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

export default function LinkPetModal({ open, pets, onClose, onSelect }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[15px] border bg-white shadow-2xl">
        <div className="flex items-center justify-center bg-primary px-6 py-3">
          <h2 className="text-subtitle font-extrabold text-black">
            Link a Pet Profile
          </h2>
          <BackButton onClick={onClose} />
        </div>

        <div className="md:p-2">
          {pets.length > 0 ? (
            <div className="h-full max-h-3xl py-3 px-2 overflow-y-auto scroll-stable">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => onSelect(pet)}
                    className="transition-transform hover:scale-[1.02]"
                  >
                    <PetCard
                      imageUrl={pet.imageUrl}
                      petName={pet.petName || "Unknown pet"}
                      sex={pet.gender}
                      shelterName={pet.shelterName || "Unknown shelter"}
                      shelterLogo={pet.shelterLogo || ""}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-6 text-sm text-black/70">No pets found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
