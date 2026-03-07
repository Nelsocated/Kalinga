"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdoptionApplicationForm from "@/components/explore/AdoptionApplicationForm";
import { ExplorePet } from "@/components/explore/types";

type PetProfileProps = {
  item: ExplorePet;
  mode?: "page" | "modal";
  onClose?: () => void;
};

const characteristicTags = ["Vaccinated", "Neutered", "Friendly", "Playful", "Healthy", "Adoptable"];

const pickDisplayPhoto = (item: ExplorePet) => {
  const firstPhoto = item.pet_media.find((media) => media.type === "photo" && media.url);
  return firstPhoto?.url;
};

const getStory = (item: ExplorePet) => {
  const caption = item.pet_media.find((media) => media.caption?.trim())?.caption;
  if (caption && caption.trim().length > 0) {
    return caption.trim();
  }

  return "This pet is ready for a loving forever home. Reach out to the shelter to learn more about personality, care needs, and the adoption process.";
};

const pickPhotos = (item: ExplorePet) => {
  return item.pet_media
    .filter((media) => media.type === "photo" && Boolean(media.url))
    .map((media) => media.url);
};

export default function PetProfile({ item, mode = "page", onClose }: PetProfileProps) {
  const router = useRouter();
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const isModal = mode === "modal";
  const petName = item.name ?? "Pet Name";
  const shelterName = item.shelter?.shelter_name ?? "Shelter Name";
  const photo = pickDisplayPhoto(item);
  const photos = pickPhotos(item);
  const thumbnails = photos.slice(0, 3);
  const story = getStory(item);
  const adoptHref = `/site/adoption/${item.id}`;

  return (
    <div
      className={isModal
        ? "rounded-2xl bg-[#fff4cf] p-4 md:p-6"
        : "flex min-h-[82vh] w-full items-center justify-center rounded-2xl bg-[#f6cf55] p-[1cm]"}
    >
      <div className={isModal
        ? "w-full max-w-5xl rounded-xl border border-[#e8bf42] bg-white p-6 shadow-lg md:p-8"
        : "w-full rounded-xl border border-[#e8bf42] bg-[#fff6dd] p-6 shadow-lg md:p-8"}
      >
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex w-full max-w-65 flex-col items-center">
            <div className="w-full aspect-square overflow-hidden rounded-xl border border-[#e8bf42] bg-[#f6cf55] p-1">
              {photo ? (
                <img
                  src={photo}
                  alt={petName}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-[#f6cf55]" />
              )}
            </div>

            <div className="mt-3 flex w-full justify-center gap-3">
              {thumbnails.map((thumb, index) => (
                <img
                  key={`${thumb}-${index}`}
                  src={thumb}
                  alt={`${petName} thumbnail ${index + 1}`}
                  className="h-14 w-14 rounded-md border border-[#e8bf42] object-cover"
                />
              ))}
              {Array.from({ length: Math.max(0, 3 - thumbnails.length) }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="h-14 w-14 rounded-md border border-[#e8bf42] bg-[#ffd672]"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (isModal) {
                  setShowAdoptionForm(true);
                  return;
                }

                router.push(adoptHref);
              }}
              className="mt-4 inline-flex rounded-md bg-[#d69d00] px-8 py-2 font-semibold text-white hover:bg-[#b88600]"
            >
              Adopt
            </button>

            {isModal ? (
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex text-sm font-semibold text-black/70 hover:underline"
              >
                Close
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/site/explore")}
                className="mt-3 inline-flex text-sm font-semibold text-black/70 hover:underline"
              >
                Back to Explore
              </button>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-black">{petName}</h1>

            <div className="mt-2 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="text-sm">
                <p className="font-medium text-black">{shelterName}</p>
                <p className="text-gray-500">Location</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-black">Characteristics</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {characteristicTags.map((tag) => (
                  <span key={tag} className="rounded bg-[#e49d00] px-3 py-1 text-xs text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-black">Information</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{story}</p>
            </div>
          </div>
        </div>
      </div>

      {showAdoptionForm ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Adoption application"
          onClick={() => setShowAdoptionForm(false)}
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <AdoptionApplicationForm
              petId={item.id}
              petName={petName}
              shelterName={shelterName}
              mode="modal"
              onClose={() => setShowAdoptionForm(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}