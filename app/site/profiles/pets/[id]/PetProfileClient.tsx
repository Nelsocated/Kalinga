"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import PetProfileTemplate from "@/components/template/PetProfileTemplate";
import PetProfileHeader from "@/components/template/pet/PetProfileHeader";
import ProfileSection from "@/components/template/ProfileSection";
import CharacteristicChip, {
  CharacteristicItem,
} from "@/components/template/pet/CharacteristicChip";
import LikeButton from "@/components/ui/LikeButton";
import Back_Button from "@/components/ui/BackButton";
import AdoptModal from "@/components/modal/AdoptModal";

import Male_Icon from "@/public/icons/male-icon.svg";
import Female_Icon from "@/public/icons/female-icon.svg";

type Media = {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
};

type ShelterMini = {
  id: string;
  shelter_name?: string | null;
  logo_url?: string | null;
  location?: string | null;
};

type PetProfile = {
  id: string;
  name: string;
  description: string | null;
  age_label?: string | null;
  breed: string | null;
  personality: string | null;
  species: string | null;
  photo_url: string | null;
  vaccinated: boolean;
  spayed_neutered: boolean;
  sex?: string | null;
  size?: string | null;
  shelter: ShelterMini | null;
  pet_media?: Media[];
};

type PetProfileClientProps = {
  id: string;
  initialPet: PetProfile;
};

export function getSexIcon(sex?: string | null) {
  if (sex === "male") {
    return (
      <Image
        src={Male_Icon}
        alt="male-icon"
        width={40}
        height={40}
        className="text-male"
      />
    );
  }

  if (sex === "female") {
    return (
      <Image
        src={Female_Icon}
        alt="female-icon"
        width={40}
        height={40}
        className="text-female"
      />
    );
  }

  return null;
}

export default function PetProfileClient({
  id,
  initialPet,
}: PetProfileClientProps) {
  const [start, setStart] = useState(0);

  const extraPhotos = useMemo(() => {
    const media = initialPet.pet_media ?? [];

    return media
      .filter(
        (item) => item.type === "photo" && item.url !== initialPet.photo_url,
      )
      .slice(0, 5);
  }, [initialPet]);

  const canSlide = extraPhotos.length > 3;

  const visibleExtras = useMemo(() => {
    if (extraPhotos.length <= 3) {
      return extraPhotos;
    }

    return [0, 1, 2].map(
      (offset) => extraPhotos[(start + offset) % extraPhotos.length],
    );
  }, [extraPhotos, start]);

  const characteristics: CharacteristicItem[] = useMemo(
    () => [
      { label: "Species", value: initialPet.species },
      { label: "Breed", value: initialPet.breed },
      { label: "Age", value: initialPet.age_label },
      { label: "Size", value: initialPet.size },
      { label: "Vaccinated", value: initialPet.vaccinated, type: "boolean" },
      {
        label: "Spayed/Neutered",
        value: initialPet.spayed_neutered,
        type: "boolean",
      },
    ],
    [initialPet],
  );

  const next = () => {
    if (!canSlide) return;
    setStart((prev) => (prev + 1) % extraPhotos.length);
  };

  const prev = () => {
    if (!canSlide) return;
    setStart((prev) => (prev - 1 + extraPhotos.length) % extraPhotos.length);
  };

  return (
    <PetProfileTemplate
      main={
        <>
          <PetProfileHeader
            title={initialPet.name}
            sex={getSexIcon(initialPet.sex)}
            subtitle={initialPet.shelter?.shelter_name}
            subtitleHref={
              initialPet.shelter?.id
                ? `/site/profiles/shelter/${initialPet.shelter.id}`
                : undefined
            }
            location={initialPet.shelter?.location ?? "Unknown Location"}
            imageUrl={initialPet.shelter?.logo_url}
            likeButton={
              <LikeButton targetType="pet" targetId={initialPet.id} />
            }
          />

          <ProfileSection title="Characteristics">
            <div className="flex flex-wrap gap-2">
              {characteristics
                .filter(
                  (item) =>
                    item.value !== null &&
                    item.value !== undefined &&
                    item.value !== "",
                )
                .map((item) => (
                  <CharacteristicChip
                    key={item.label}
                    label={item.label}
                    value={item.value as string | boolean}
                    type={item.type}
                  />
                ))}
            </div>
          </ProfileSection>

          <ProfileSection title="Information">
            <div className="text-sm">
              {initialPet.description ?? "No description yet."}
            </div>
          </ProfileSection>
        </>
      }
      side={
        <div className="relevant p-7">
          <div className="absolute top-11">
            <Back_Button />
          </div>

          <div className="mt-5 mb-4 overflow-hidden rounded-2xl bg-black/5">
            {initialPet.photo_url ? (
              <img
                src={initialPet.photo_url}
                alt={`${initialPet.name} main photo`}
                className="h-75 w-full object-cover"
              />
            ) : (
              <div className="flex h-75 items-center justify-center text-sm opacity-70">
                No main photo yet.
              </div>
            )}
          </div>

          {extraPhotos.length > 0 ? (
            <div className="relative w-full">
              <div className="grid grid-cols-3 gap-3">
                {visibleExtras.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.caption ?? "Pet photo"}
                    className="aspect-5/7 w-full rounded-xl object-cover shadow-sm"
                  />
                ))}
              </div>

              {canSlide && (
                <button
                  type="button"
                  onClick={prev}
                  className="absolute top-1/2 -left-6 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
                >
                  ‹
                </button>
              )}

              {canSlide && (
                <button
                  type="button"
                  onClick={next}
                  className="absolute top-1/2 -right-6 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
                >
                  ›
                </button>
              )}
            </div>
          ) : (
            <div className="text-sm opacity-70">No photos yet.</div>
          )}

          <div className="mt-5 flex justify-center">
            <AdoptModal petId={id} />
          </div>
        </div>
      }
    />
  );
}
