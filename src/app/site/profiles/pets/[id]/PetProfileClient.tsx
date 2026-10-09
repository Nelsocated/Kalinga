"use client";

import { useEffect, useMemo, useState } from "react";
import { createClientSupabase } from "@/src/lib/supabase/client";

import PetProfileHeader from "@/src/components/template/pet/PetProfileHeader";
import ProfileSection from "@/src/components/template/ProfileSection";
import CharacteristicChip, {
  CharacteristicItem,
} from "@/src/components/template/pet/CharacteristicChip";
import PhotoView from "@/src/components/views/PhotoView";
import ShareButton from "@/src/components/ui/ShareButton";
import LikeButton from "@/src/components/ui/LikeButton";
import AdoptModal from "@/src/components/modal/AdoptModal";
import AddPetPhotosModal from "@/src/components/modal/AddPetPhotosModal";

import WebTemplate from "@/src/components/template/WebTemplate";
import SexIcon from "@/src/components/ui/SexIcon";
import { CheckCircle, MinusCircle } from "@phosphor-icons/react";

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
    ],
    [initialPet],
  );

  const supabase = createClientSupabase();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      // Only decides whether to show owner controls; the server checks ownership on every write
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id ?? null);
    }

    getUser();
  }, [supabase.auth]);

  const isOwner = userId === initialPet.shelter?.owner_id;

  return (
    <WebTemplate
      side={
        <div className="flex flex-col gap-4 lg:sticky lg:top-8">
          <PhotoView
            key={initialPet.photo_url ?? ""}
            name={initialPet.name}
            photo_url={initialPet.photo_url ?? ""}
            pet_media={initialPet.pet_media ?? []}
          />
          {/* One action row: the primary ask, then like and share at the same height */}
          <div className="flex items-center gap-2">
            <AdoptModal petId={id} />
            <LikeButton targetType="pet" targetId={initialPet.id} variant="outlined" />
            <ShareButton id={initialPet.id} type="pet" variant="outlined" />
          </div>
        </div>
      }
      main={
        <>
          <PetProfileHeader
            title={initialPet.name}
            sex={<SexIcon sex={initialPet.sex} size={28} />}
            subtitle={initialPet.shelter?.shelter_name}
            subtitleHref={
              initialPet.shelter?.id
                ? `/site/profiles/shelter/${initialPet.shelter.id}`
                : undefined
            }
            location={initialPet.shelter?.location ?? "Unknown Location"}
            imageUrl={initialPet.shelter?.logo_url}
            actions={isOwner ? <AddPetPhotosModal petId={id} /> : null}
          />

          <ProfileSection>
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

          <ProfileSection title="Health">
            {[
              { label: "Vaccinated", done: initialPet.vaccinated },
              { label: "Spayed or neutered", done: initialPet.spayed_neutered },
            ].map((row) => (
              <p key={row.label} className="flex items-center gap-2 text-sm text-ink">
                {row.done ? (
                  <CheckCircle size={20} weight="fill" className="text-approved-text" aria-hidden="true" />
                ) : (
                  <MinusCircle size={20} className="text-muted" aria-hidden="true" />
                )}
                {row.label}
                <span className="sr-only">{row.done ? ": yes" : ": not yet"}</span>
              </p>
            ))}
          </ProfileSection>

          <ProfileSection title={`About ${initialPet.name}`}>
            <p className="max-w-[65ch] whitespace-pre-line break-words">
              {initialPet.description || "The shelter hasn't written about this pet yet."}
            </p>
          </ProfileSection>
        </>
      }
    />
  );
}
