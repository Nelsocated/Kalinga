"use client";

import { useMemo } from "react";
import Image from "next/image";

import PetProfileTemplate from "@/components/template/PetProfileTemplate";
import PetProfileHeader from "@/components/template/pet/PetProfileHeader";
import ProfileSection from "@/components/template/ProfileSection";
import CharacteristicChip, {
  CharacteristicItem,
} from "@/components/template/pet/CharacteristicChip";
import PhotoView from "@/components/views/PhotoView";
import LikeButton from "@/components/ui/LikeButton";
import BackButton from "@/components/ui/BackButton";
import AdoptModal from "@/components/modal/AdoptModal";

import Male_Icon from "@/public/icons/male-icon.svg";
import Female_Icon from "@/public/icons/female-icon.svg";

export type PetGender = "male" | "female" | "unknown";
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
  species: string | null;
  photo_url: string | null;
  vaccinated: boolean;
  spayed_neutered: boolean;
  sex: PetGender;
  size?: string | null;
  shelter: ShelterMini | null;
  pet_media?: Media[];
};

type PetProfileClientProps = {
  id: string;
  initialPet: PetProfile;
};

export function getSexIcon(sex: PetGender, className?: number) {
  if (sex === "male") {
    return (
      <Image
        src={Male_Icon}
        alt="male-icon"
        width={className ? className : 40}
        height={className ? className : 40}
      />
    );
  }

  if (sex === "female") {
    return (
      <Image
        src={Female_Icon}
        alt="female-icon"
        width={className ? className : 40}
        height={className ? className : 40}
      />
    );
  }

  return null;
}

export default function PetProfileClient({
  id,
  initialPet,
}: PetProfileClientProps) {
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
            <div className="text-sm whitespace-pre-line wrap-break-words [word-break:normal] wrap-break-word">
              {initialPet.description ?? "No description yet."}
            </div>
          </ProfileSection>
        </>
      }
      side={
        <div className="px-7 pb-2">
          <PhotoView
            name={initialPet.name}
            photo_url={initialPet.photo_url ?? ""}
            pet_media={initialPet.pet_media ?? []}
          />

          <div className="mt-4 flex justify-center">
            <AdoptModal petId={id} />
          </div>
        </div>
      }
      top={
        <>
          <BackButton />

          <LikeButton
            targetType="pet"
            targetId={id}
            className="text-primary h-12"
          />
        </>
      }
    />
  );
}
