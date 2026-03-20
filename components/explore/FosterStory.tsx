"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ExplorePet } from "@/components/explore/types";

const STORY_BADGE_TEMPLATES = [
  "Brave Recovery Journey",
  "Second Chance Star",
  "From Rescue to Ready",
  "Gentle Soul in Foster",
  "Playful Heart, Big Hope",
  "Ready for a Forever Home",
];

const pickStoryBadge = (story: ExplorePet) => {
  const key = story.id ?? story.name ?? "story";
  const hash = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const template = STORY_BADGE_TEMPLATES[hash % STORY_BADGE_TEMPLATES.length];
  return `\"${story.name ?? "This pet"} - ${template}\"`;
};

const pickDisplayPhoto = (story: ExplorePet) => {
  const photoUrls = story.pet_media
    .filter((media) => media.type === "photo" && Boolean(media.url))
    .map((media) => media.url);

  if (photoUrls.length === 0) {
    return null;
  }

  // Keep photo selection deterministic to avoid hydration mismatch.
  return photoUrls[0];
};

export default function FosterStory({ items }: { items: ExplorePet[] }) {
  const randomPhotoByStoryId = useMemo(() => {
    const entries = items.map((story) => {
      return [story.id, pickDisplayPhoto(story)] as const;
    });

    return Object.fromEntries(entries) as Record<string, string | null>;
  }, [items]);

  const visibleStories = items.slice(0, 4);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Foster&apos;s story</h2>
        <Link
          href="/site/explore/foster-story"
          aria-label="Open foster story page"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8bf42] bg-white text-xl font-bold text-black"
        >
          &gt;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleStories.map((story) => {
          const selectedPhoto = randomPhotoByStoryId[story.id];
          const shelter = story.shelter?.shelter_name ?? "Available for adoption";
          const storyBadge = pickStoryBadge(story);

          return (
            <article
              key={story.id}
              className="rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-3"
            >
              <div className="relative">
                <div className="absolute -top-5 left-1/2 z-10 min-w-55 -translate-x-1/2 rounded-full border-2 border-[#f3be0f] bg-white px-5 py-1 text-center text-xs font-semibold text-[#f3be0f] shadow">
                  {storyBadge}
                </div>
                {selectedPhoto ? (
                  <img
                    src={selectedPhoto}
                    alt={story.name ?? "Foster story"}
                    className="h-40 w-full rounded-xl bg-white object-cover"
                  />
                ) : (
                  <div className="h-40 rounded-xl bg-white" />
                )}
              </div>
              <div className="mt-3 flex w-full items-center justify-between gap-3">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-black">{story.name ?? "Unnamed"}</h3>
                  <p className="mt-1 text-sm text-black/70">{shelter}</p>
                </div>
                <Link
                  href={`/site/pet/${story.id}?name=${encodeURIComponent(story.name ?? "")}&shelter=${encodeURIComponent(shelter)}`}
                  className="rounded-full border border-[#f3be0f] bg-white px-4 py-1 text-sm font-semibold text-[#f3be0f] hover:bg-[#f3be0f] hover:text-white"
                >
                  More Info
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
