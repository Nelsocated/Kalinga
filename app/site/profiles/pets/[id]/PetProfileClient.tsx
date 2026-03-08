"use client";

import { useMemo, useState } from "react";
import ProfileShell from "@/components/profile/pet/PetProfileTemplate";
import ProfileHeader from "@/components/profile/pet/PetProfileHeader";
import ProfileSection from "@/components/profile/ProfileSection";
import CharacteristicChip, {
  CharacteristicItem,
} from "@/components/profile/CharacteristicChip";
import LikeButton from "@/components/ui/LikeButton";
import Male_Icon from "@/public/icons/male-icon.svg";
import Female_Icon from "@/public/icons/female-icon.svg";
import Image from "next/image";
import Back_Button from "@/components/ui/Back";
import AdoptModal from "@/components/modal/AdoptModal";

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
  breed: string;
  personality: string;
  status: boolean;
  species: string;
  vaccinated: boolean;
  spayed_neutered: boolean;
  sex?: string | null;
  size?: string | null;
  photo_url: string;
  shelter: ShelterMini | null;
  pet_media?: Media[];
};

function getSexIcon(sex?: string | null) {
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
}: {
  id: string;
  initialPet: PetProfile;
}) {
  const [pet] = useState<PetProfile>(initialPet);
  const [start, setStart] = useState(0);

  const extraPhotos = useMemo(() => {
    const media = pet?.pet_media ?? [];
    return media
      .filter((m) => m.type === "photo" && m.url !== pet?.photo_url)
      .slice(0, 5);
  }, [pet]);

  const canSlide = extraPhotos.length > 3;

  const visibleExtras = useMemo(() => {
    if (extraPhotos.length <= 3) return extraPhotos;
    return [0, 1, 2].map(
      (offset) => extraPhotos[(start + offset) % extraPhotos.length],
    );
  }, [extraPhotos, start]);

  const next = () => {
    if (!canSlide) return;
    setStart((s) => (s + 1) % extraPhotos.length);
  };

  const prev = () => {
    if (!canSlide) return;
    setStart((s) => (s - 1 + extraPhotos.length) % extraPhotos.length);
  };

  const characteristics: CharacteristicItem[] = useMemo(() => {
    return [
      { label: "Species", value: pet.species },
      { label: "Breed", value: pet.breed },
      { label: "Age", value: pet.age_label },
      { label: "Size", value: pet.size },
      { label: "Vaccinated", value: pet.vaccinated, type: "boolean" },
      { label: "Spayed/Neutered", value: pet.spayed_neutered, type: "boolean" },
    ];
  }, [pet]);

  return (
    <ProfileShell
      main={
        <>
          <ProfileHeader
            title={pet.name}
            sex={getSexIcon(pet.sex)}
            subtitle={pet.shelter?.shelter_name}
            subtitleHref={`/site/profiles/shelter/${pet.shelter?.id}`}
            location={pet.shelter?.location ?? "Unknown Location"}
            imageUrl={pet.shelter?.logo_url}
            likeButton={<LikeButton targetType="pet" targetId={pet.id} />}
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
              {pet.description ?? "No description yet."}
            </div>
          </ProfileSection>
        </>
      }
      side={
        <div className="p-7 relevant">
          <div className="absolute top-11 left-96">
            <Back_Button />
          </div>

          <div className="mb-4 mt-5 overflow-hidden rounded-2xl bg-black/5">
            {pet.photo_url ? (
              <img
                src={pet.photo_url}
                alt={`${pet.name} main photo`}
                className="h-75 w-full object-cover"
              />
            ) : (
              <div className="flex h-75 items-center justify-center text-sm opacity-70">
                No main photo yet.
              </div>
            )}
          </div>

          {extraPhotos.length ? (
            <div className="relative w-full">
              <div className="grid grid-cols-3 gap-3">
                {visibleExtras.map((p) => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt={p.caption ?? "Pet photo"}
                    className="aspect-5/7 w-full rounded-xl object-cover shadow-sm"
                  />
                ))}
              </div>

              {canSlide && (
                <button
                  onClick={prev}
                  className="absolute -left-6 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
                >
                  ‹
                </button>
              )}

              {canSlide && (
                <button
                  onClick={next}
                  className="absolute -right-6 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-black/5 hover:shadow-lg"
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
