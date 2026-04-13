"use client";

import { useRouter } from "next/navigation";

import WebTemplate from "@/src/components/template/WebTemplate";
import PetProfileHeader from "@/src/components/template/pet/PetProfileHeader";
import ProfileSection from "@/src/components/template/ProfileSection";
import Button from "@/src/components/ui/Button";
import PhotoView from "@/src/components/views/PhotoView";
import LikeButton from "@/src/components/ui/LikeButton";
import { getSexIcon } from "../../pets/[id]/PetProfileClient";
import { PetGender } from "@/src/lib/types/shelters";

type Media = {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
};

type FosterProfileProps = {
  petId: string;
  name: string;
  sex: PetGender;
  shelter_name?: string | null;
  logo_url?: string | null;
  location?: string | null;
  photo_url: string;
  title: string;
  description: string;
  pet_media?: Media[];
};

export default function FosterProfilePage({
  petId,
  name,
  sex,
  shelter_name,
  logo_url,
  location,
  photo_url,
  title,
  description,
  pet_media = [],
}: FosterProfileProps) {
  const router = useRouter();

  return (
    <WebTemplate
      header={<div>Foster Story</div>}
      side={
        <div className="p-5">
          <PhotoView name={name} photo_url={photo_url} pet_media={pet_media} />

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={() => router.push(`/site/profiles/pets/${petId}`)}
              className="bg-primary px-4 text-lg font-semibold"
            >
              More Info
            </Button>
          </div>
        </div>
      }
      main={
        <>
          <PetProfileHeader
            title={name}
            sex={getSexIcon(sex)}
            subtitle={shelter_name ?? "Unknown shelter"}
            subtitleHref={petId ? `/site/profiles/pets/${petId}` : undefined}
            location={location ?? "Unknown location"}
            imageUrl={logo_url ?? undefined}
            likeButton={<LikeButton targetType="pet" targetId={petId} />}
          />

          <ProfileSection>
            <h3
              className="text-primary
[text-shadow:-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black,1px_1px_0_black] text-subtitle leading-7 font-extrabold text-justify"
            >
              “{title}”
            </h3>
          </ProfileSection>

          <ProfileSection>
            <div className="text-description whitespace-pre-line wrap-break-words text-justify">
              {description || "No description yet."}
            </div>
          </ProfileSection>
        </>
      }
    />
  );
}
