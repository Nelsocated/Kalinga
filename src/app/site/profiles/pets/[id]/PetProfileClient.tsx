"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClientSupabase } from "@/src/lib/supabase/client";

import PetProfileHeader from "@/src/components/template/pet/PetProfileHeader";
import ProfileSection from "@/src/components/template/ProfileSection";
import CharacteristicChip, {
  CharacteristicItem,
} from "@/src/components/template/pet/CharacteristicChip";
import PhotoView from "@/src/components/views/PhotoView";
import LikeButton from "@/src/components/ui/LikeButton";
import AdoptModal from "@/src/components/modal/AdoptModal";
import AddPetPhotosModal from "@/src/components/modal/AddPetPhotosModal";

import WebTemplate from "@/src/components/template/WebTemplate";
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
  owner_id?: string | null;
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
      { label: "Vaccinated", value: initialPet.vaccinated },
      {
        label: "Spayed/Neutered",
        value: initialPet.spayed_neutered,
      },
    ],
    [initialPet],
  );

  const supabase = createClientSupabase();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    }

    getUser();
  }, [supabase.auth]);

  const isOwner = userId === initialPet.shelter?.owner_id;

  return (
    <WebTemplate
      header={<div>Pet Profile</div>}
      side={
        <div className="p-5">
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
              <LikeButton
                targetType="pet"
                targetId={initialPet.id}
                className="h-10"
              />
            }
            actions={isOwner ? <AddPetPhotosModal petId={id} /> : null}
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
    />
  );
}
