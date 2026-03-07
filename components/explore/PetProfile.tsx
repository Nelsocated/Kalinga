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

const CHARACTERISTIC_POOL = [
  "Vaccinated",
  "Neutered",
  "Friendly",
  "Playful",
  "Healthy",
  "Adoptable",
  "Litter Trained",
  "Leash Trained",
  "Kid Friendly",
  "Indoor Ready",
  "Social",
  "Affectionate",
];

const LOCATION_POOL = [
  "Iloilo City",
  "Jaro, Iloilo",
  "La Paz, Iloilo",
  "Molo, Iloilo",
  "Mandurriao, Iloilo",
  "Arevalo, Iloilo",
  "Pavia, Iloilo",
  "Leganes, Iloilo",
  "Oton, Iloilo",
  "Sta. Barbara, Iloilo",
  "San Miguel, Iloilo",
  "Guimbal, Iloilo",
];

const STORY_OPENINGS = [
  "{name} arrived at {shelter} after being spotted roaming near a busy road, exhausted and visibly underweight.",
  "Rescuers brought {name} to {shelter} after neighbors reported that this gentle animal had been searching for food alone.",
  "When {name} first entered {shelter}, caregivers focused on restoring strength, hydration, and confidence through a calm routine.",
  "Before settling into care, {name} had spent days outdoors in difficult conditions and needed immediate support from {shelter}.",
];

const STORY_PROGRESS = [
  "Over the next few weeks, appetite improved, sleep became more regular, and overall energy returned in a healthy and steady way.",
  "Daily feeding, wellness checks, and patient handling helped stabilize health markers and improve physical recovery.",
  "Consistent care plans made a clear difference, with weight gain, improved coat condition, and calmer responses during checkups.",
  "With proper nutrition and structured rest, {name} gradually rebuilt strength and began engaging more confidently with caregivers.",
];

const STORY_PERSONALITY = [
  "In the shelter environment, {name} shows a balanced temperament: affectionate with familiar people and curious during supervised play sessions.",
  "Caregivers describe {name} as socially responsive, gentle with handling, and increasingly comfortable with positive reinforcement.",
  "During enrichment time, {name} enjoys interactive toys, short walks, and quiet moments near trusted staff.",
  "As trust has grown, {name} now greets visitors calmly and adapts well to predictable schedules and household-style routines.",
];

const STORY_ADOPTION = [
  "Currently based in {location}, {name} is preparing for adoption and would thrive with a family that can continue patient, consistent care.",
  "From the team in {location}, the recommendation is a forever home that offers structure, gentle guidance, and regular bonding time.",
  "Shelter staff believe {name} is ready for a permanent home where routines, affection, and responsible care remain a daily priority.",
  "The next step for {name} is placement with adopters who value long-term commitment, routine vet care, and a nurturing environment.",
];

const hashSeed = (seed: string) => {
  return Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const pickBySeed = (seed: string, pool: string[], salt: string) => {
  const score = hashSeed(`${seed}:${salt}`);
  return pool[score % pool.length];
};

const pickCharacteristics = (seed: string, count = 6) => {
  const base = hashSeed(seed || "pet");
  return [...CHARACTERISTIC_POOL]
    .sort((a, b) => {
      const aScore = (hashSeed(`${seed}:${a}`) + base) % 997;
      const bScore = (hashSeed(`${seed}:${b}`) + base) % 997;
      return aScore - bScore;
    })
    .slice(0, count);
};

const pickLocation = (seed: string) => {
  const score = hashSeed(seed || "pet");
  return LOCATION_POOL[score % LOCATION_POOL.length];
};

const pickDisplayPhoto = (item: ExplorePet) => {
  const firstPhoto = item.pet_media.find((media) => media.type === "photo" && media.url);
  return firstPhoto?.url;
};

const getStory = (item: ExplorePet) => {
  const seed = item.id ?? item.name ?? "pet";
  const petName = item.name ?? "This pet";
  const shelterName = item.shelter?.shelter_name ?? "the shelter";
  const location = pickLocation(seed);
  const caption = item.pet_media.find((media) => media.caption?.trim())?.caption;
  const opening = pickBySeed(seed, STORY_OPENINGS, "opening")
    .replaceAll("{name}", petName)
    .replaceAll("{shelter}", shelterName);
  const progress = pickBySeed(seed, STORY_PROGRESS, "progress").replaceAll("{name}", petName);
  const personality = pickBySeed(seed, STORY_PERSONALITY, "personality").replaceAll("{name}", petName);
  const adoption = pickBySeed(seed, STORY_ADOPTION, "adoption")
    .replaceAll("{name}", petName)
    .replaceAll("{location}", location);

  const captionLead = caption?.trim() ? `${caption.trim()} ` : "";

  return `${captionLead}${opening} ${progress} ${personality} ${adoption}`;
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
  const characteristicTags = pickCharacteristics(item.id);
  const location = pickLocation(item.id);

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
                setShowAdoptionForm(true);
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
                <p className="text-gray-500">{location}</p>
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
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <AdoptionApplicationForm
              petId={item.id}
              mode="modal"
              onClose={() => setShowAdoptionForm(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}