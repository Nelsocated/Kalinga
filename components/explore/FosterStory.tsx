"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExplorePet } from "@/components/explore/types";

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
  const [pageStart, setPageStart] = useState(0);

  const randomPhotoByStoryId = useMemo(() => {
    const entries = items.map((story) => {
      return [story.id, pickDisplayPhoto(story)] as const;
    });

    return Object.fromEntries(entries) as Record<string, string | null>;
  }, [items]);

  const storiesPerPage = 4;
  const canCycle = items.length > storiesPerPage;
  const visibleStories = useMemo(() => {
    if (items.length <= storiesPerPage) {
      return items;
    }

    const firstChunk = items.slice(pageStart, pageStart + storiesPerPage);
    if (firstChunk.length === storiesPerPage) {
      return firstChunk;
    }

    const remaining = storiesPerPage - firstChunk.length;
    return [...firstChunk, ...items.slice(0, remaining)];
  }, [items, pageStart]);

  const showNextStories = () => {
    if (!canCycle) {
      return;
    }

    setPageStart((current) => (current + storiesPerPage) % items.length);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Foster&apos;s story</h2>
        <button
          type="button"
          onClick={showNextStories}
          disabled={!canCycle}
          aria-label="Show other pets"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f3be0f] bg-white text-xl font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleStories.map((story) => {
          const selectedPhoto = randomPhotoByStoryId[story.id];
          const firstCaption = story.pet_media.find((media) => media.caption)?.caption;

          return (
          <article
            key={story.id}
            className="rounded-2xl border border-[#f3be0f] bg-[#f3be0f] p-3"
          >
            {selectedPhoto ? (
              <img
                src={selectedPhoto}
                alt={story.name ?? "Foster story"}
                className="h-40 w-full rounded-xl bg-white object-cover"
              />
            ) : (
              <div className="h-40 rounded-xl bg-white" />
            )}
            <h3 className="mt-3 text-2xl font-bold text-black">{story.name ?? "Unnamed"}</h3>
            <p className="text-sm text-black/70 line-clamp-2">{firstCaption ?? "No story yet."}</p>
            <Link
              href={`/site/pet/${story.id}`}
              className="mt-3 rounded-full border border-white px-4 py-1 text-sm font-semibold text-black"
            >
              more info
            </Link>
          </article>
          );
        })}
      </div>
    </div>
  );
}