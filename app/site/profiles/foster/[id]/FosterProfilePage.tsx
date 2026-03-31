"use client";

import { useRouter } from "next/navigation";

import PetProfileTemplate from "@/components/template/PetProfileTemplate";
import PetProfileHeader from "@/components/template/pet/PetProfileHeader";
import ProfileSection from "@/components/template/ProfileSection";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import PhotoView from "@/components/views/PhotoView";
import LikeButton from "@/components/ui/LikeButton";
import { getSexIcon } from "../../pets/[id]/PetProfileClient";

type Media = {
  id: string;
  type: "photo" | "video";
  url: string;
  caption: string | null;
};

type FosterProfileProps = {
  id: string;
  petId: string;
  name: string;
  sex: string;
  shelter_name?: string | null;
  logo_url?: string | null;
  location?: string | null;
  photo_url: string;
  title: string;
  description: string;
  pet_media?: Media[];
};

export default function FosterProfilePage({
  id,
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
    <PetProfileTemplate
      main={
        <div>
          <PetProfileHeader
            title={name}
            sex={getSexIcon(sex)}
            subtitle={shelter_name ?? "Unknown shelter"}
            subtitleHref={petId ? `/site/profiles/pets/${petId}` : undefined}
            location={location ?? "Unknown location"}
            imageUrl={logo_url ?? undefined}
          />

          <div>
            <ProfileSection>
              <div className="text-lg font-semibold whitespace-normal text-justify [word-break:normal] wrap-normal ">
                {title ? `"${title}"` : "Untitled story"}
              </div>
            </ProfileSection>

            <ProfileSection>
              <div className="text-description whitespace-pre-line [word-break:normal] wrap-break-word text-justify">
                {description || "No description yet."}
              </div>
            </ProfileSection>
          </div>
        </div>
      }
      side={
        <div className="px-7 pb-2">
          <PhotoView name={name} photo_url={photo_url} pet_media={pet_media} />

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={() => router.push(`/site/profiles/pets/${petId}`)}
              className="bg-primary font-semibold text-lg px-4"
            >
              More Info
            </Button>
          </div>
        </div>
      }
      top={
        <>
          <BackButton />

          <LikeButton
            targetType="pet"
            targetId={petId}
            className="text-primary h-15"
          />
        </>
      }
    />
  );
}
