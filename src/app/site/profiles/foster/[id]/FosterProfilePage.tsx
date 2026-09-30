"use client";

import { ArrowRight } from "@phosphor-icons/react";
import WebTemplate from "@/src/components/template/WebTemplate";
import PetProfileHeader from "@/src/components/template/pet/PetProfileHeader";
import ProfileSection from "@/src/components/template/ProfileSection";
import { LinkButton } from "@/src/components/ui/Button";
import PhotoView from "@/src/components/views/PhotoView";
import LikeButton from "@/src/components/ui/LikeButton";
import SexIcon from "@/src/components/ui/SexIcon";
import type { PetGender } from "@/src/lib/types/shelters";

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

/** A foster story: the story leads, the pet and its shelter follow. */
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
  return (
    <WebTemplate
      header="Foster story"
      side={
        <div className="flex flex-col gap-4 lg:sticky lg:top-8">
          <PhotoView key={photo_url} name={name} photo_url={photo_url} pet_media={pet_media} />
          {petId ? (
            <LinkButton
              href={`/site/profiles/pets/${petId}`}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Meet {name}
              <ArrowRight aria-hidden="true" />
            </LinkButton>
          ) : null}
        </div>
      }
      main={
        <div className="flex flex-col">
          <article className="flex flex-col gap-4 pb-6">
            <h2 className="text-headline text-ink">{title || `${name}'s story`}</h2>
            <p className="max-w-[65ch] whitespace-pre-line text-ink-soft">
              {description || "The shelter hasn't written this story yet."}
            </p>
          </article>

          <ProfileSection title="The pet">
            <PetProfileHeader
              compact
              title={name}
              sex={<SexIcon sex={sex} size={24} />}
              subtitle={shelter_name ?? undefined}
              subtitleHref={petId ? `/site/profiles/pets/${petId}` : undefined}
              location={location}
              imageUrl={logo_url ?? undefined}
              likeButton={petId ? <LikeButton targetType="pet" targetId={petId} /> : null}
            />
          </ProfileSection>
        </div>
      }
    />
  );
}
