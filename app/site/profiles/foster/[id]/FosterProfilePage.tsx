"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PetProfileTemplate from "@/components/template/PetProfileTemplate";
import PetProfileHeader from "@/components/template/pet/PetProfileHeader";
import ProfileSection from "@/components/template/ProfileSection";
import Back_Button from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";

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
  const [start, setStart] = useState(0);

  const extraPhotos = useMemo(() => {
    return pet_media
      .filter(
        (item) => item.type === "photo" && item.url && item.url !== photo_url,
      )
      .slice(0, 5);
  }, [pet_media, photo_url]);

  const canSlide = extraPhotos.length > 3;

  const visibleExtras = useMemo(() => {
    if (extraPhotos.length <= 3) {
      return extraPhotos;
    }

    return [0, 1, 2].map(
      (offset) => extraPhotos[(start + offset) % extraPhotos.length],
    );
  }, [extraPhotos, start]);

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
            title={name}
            sex={getSexIcon(sex)}
            subtitle={shelter_name ?? "Unknown shelter"}
            subtitleHref={petId ? `/site/profiles/pets/${petId}` : undefined}
            location={location ?? "Unknown location"}
            imageUrl={logo_url ?? undefined}
          />

          <div>
            <ProfileSection>
              <div className="text-2xl font-semibold">
                {`"${title}"` || "Untitled story"}
              </div>
            </ProfileSection>

            <ProfileSection>
              <div className="whitespace-pre-line text-medium leading-relaxed ">
                {description || "No description yet."}
              </div>
            </ProfileSection>
          </div>
        </>
      }
      side={
        <div className="relevant p-7">
          <div className="absolute top-11">
            <Back_Button />
          </div>

          <div className="mt-5 mb-4 overflow-hidden rounded-2xl bg-black/5">
            {photo_url ? (
              <img
                src={photo_url}
                alt={`${name} main photo`}
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
            <div className="text-sm opacity-70">No extra photos yet.</div>
          )}

          <div className="mt-5 flex justify-center">
            <Button
              type="button"
              onClick={() => router.push(`/site/profiles/pets/${petId}`)}
              className="bg-primary font-semibold text-lg px-5"
            >
              More Info
            </Button>
          </div>
        </div>
      }
    />
  );
}
