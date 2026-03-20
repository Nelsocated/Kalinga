"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExplorePet } from "@/components/explore/types";
import AdoptModal from "@/components/modal/AdoptModal";

type PetProfileProps = {
  item: ExplorePet;
};

function firstPhoto(item: ExplorePet) {
  return item.pet_media.find((media) => media.type === "photo" && media.url)?.url;
}

function firstCaption(item: ExplorePet) {
  return item.pet_media.find((media) => media.caption?.trim())?.caption?.trim();
}

function photos(item: ExplorePet) {
  return item.pet_media
    .filter((media) => media.type === "photo" && Boolean(media.url))
    .map((media) => media.url);
}

const TAG_POOL = [
  "Vaccinated",
  "Friendly",
  "Playful",
  "Indoor Ready",
  "Healthy",
  "Adoptable",
  "Affectionate",
  "Social",
  "Neutered",
  "Leash Trained",
];

function pickTags(seed: string, count = 6) {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [...TAG_POOL]
    .sort((a, b) => {
      const aScore = (hash + a.length * 17) % 101;
      const bScore = (hash + b.length * 17) % 101;
      return aScore - bScore;
    })
    .slice(0, count);
}

export default function PetProfile({ item }: PetProfileProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const LOCATIONS = ["Iloilo City", "Cebu City", "Manila", "Davao City", "Bacolod", "Tagbilaran", "Dumaguete", "Roxas City"];
  const FALLBACK_NAMES = ["Brownie", "Luna", "Mochi", "Biscuit", "Coco", "Peanut", "Kimchi", "Patches"];
  const FALLBACK_SHELTERS = ["Paws of Hope", "Kalinga Shelter", "Happy Tails", "Furry Friends", "Safe Haven"];
  const h = Array.from(item.id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const name = item.name ?? FALLBACK_NAMES[h % FALLBACK_NAMES.length];
  const shelter = item.shelter?.shelter_name ?? FALLBACK_SHELTERS[h % FALLBACK_SHELTERS.length];
  const location = LOCATIONS[h % LOCATIONS.length];
  const photo = firstPhoto(item);
  const thumbnails = photos(item).slice(0, 3);
  const tags = pickTags(item.id);
  const info =
    firstCaption(item) ??
    "This pet is available for adoption. Contact the shelter for complete health and behavior details.";

  return (
    <div className="flex w-full min-h-screen bg-[#F3BE0F] p-10">
      {/* MAIN CARD */}
      <div className="w-full max-w-6xl mx-auto bg-[#F4F1EA] rounded-2xl shadow-md p-10 relative">
        {/* Top Buttons */}
        <div className="flex justify-between mb-6">
          <button
            type="button"
            onClick={() => router.push("/site/explore")}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Back to Explore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={liked ? "#f3be0f" : "none"} stroke={liked ? "#f3be0f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div>
            {/* Main Pet Image */}
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={name}
                className="w-full h-[260px] bg-orange-400 rounded-xl mb-4 object-cover"
              />
            ) : (
              <div className="w-full h-[260px] bg-orange-400 rounded-xl mb-4" />
            )}

            {/* Small Images */}
            <div className="flex justify-center gap-4 mb-6">
              {thumbnails.map((thumb, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${thumb}-${index}`}
                  src={thumb}
                  alt={`${name} thumbnail ${index + 1}`}
                  className="w-24 h-20 rounded-lg object-cover"
                />
              ))}
              {Array.from({ length: Math.max(0, 3 - thumbnails.length) }).map((_, index) => (
                <div
                  key={`thumb-placeholder-${index}`}
                  className={`w-24 h-20 rounded-lg ${
                    index === 0
                      ? "bg-orange-400"
                      : index === 1
                        ? "bg-yellow-400"
                        : "bg-yellow-200"
                  }`}
                />
              ))}
            </div>

            {/* Adopt Button */}
            <div className="flex justify-center">
              <AdoptModal petId={item.id} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Pet Name */}
            <h1 className="text-2xl font-bold mb-3">{name}</h1>

            {/* Shelter */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <p className="text-sm font-medium">{shelter}</p>
                <p className="text-xs text-gray-500">{location}</p>
              </div>
            </div>

            {/* Characteristics */}
            <h2 className="font-semibold mb-2">Characteristics</h2>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-yellow-400 text-xs px-3 py-1 rounded-md text-center"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            {/* Information */}
            <h2 className="font-semibold mb-2">Information</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {info}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
