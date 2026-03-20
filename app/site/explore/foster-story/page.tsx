"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";


const NAMES = ["Nelson", "Luna", "Mochi", "Biscuit", "Coco", "Peanut", "Kimchi", "Patches", "Shadow", "Ginger", "Tofu", "Nugget", "Pepper", "Oreo", "Caramel", "Mocha"];
const SHELTERS = ["Bonggo Puppies", "Paws of Hope", "Kalinga Shelter", "Happy Tails", "Furry Friends", "Safe Haven", "Second Chance", "New Beginnings", "Loving Paws"];
const BADGES = ["Miracle Cancer Survivor", "Brave Recovery Journey", "Second Chance Star", "From Rescue to Ready", "Gentle Soul in Foster", "Playful Heart, Big Hope", "Ready for a Forever Home"];
const IMAGES = ["/dog1.jpg", "/dog2.jpg", "/dog3.jpg", "/dog4.jpg", "/dog5.jpg", "/dog6.jpg"];
const PREVIEWS = [
  "A heartwarming story of resilience and hope.",
  "This pet overcame incredible odds to find joy again.",
  "A gentle soul looking for a forever home.",
  "From rescue to ready for adoption!",
  "Playful, loving, and ready for a new chapter.",
  "A true survivor with a big heart.",
  "Waiting patiently for a family to love.",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const STORIES = Array.from({ length: 4 }, (_, i) => {
  return {
    id: `foster-${i + 1}`,
    badge: BADGES[getRandomInt(BADGES.length)],
    name: NAMES[getRandomInt(NAMES.length)],
    gender: Math.random() > 0.5 ? "♂" : "♀",
    shelter: SHELTERS[getRandomInt(SHELTERS.length)],
    image: IMAGES[getRandomInt(IMAGES.length)],
    preview: PREVIEWS[getRandomInt(PREVIEWS.length)],
  };
});

export default function FosterStoryPage() {
  return (
    <div className="flex min-h-svh gap-6 bg-background px-6 md:px-8 lg:gap-8 xl:px-10">
      <NavBar />
      <main className="min-w-0 flex-1 py-6 lg:py-8">
        <div className="mx-auto w-full max-w-[1180px] px-2 md:px-4">
    <div className="rounded-2xl border border-yellow-500 overflow-hidden">
        {/* HEADER */}
        <div className="bg-yellow-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-black">Explore</h1>
        </div>

        {/* CONTENT */}
        <div className="bg-[#F5F5F5] p-8">
          {/* TITLE */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/site/explore" className="hover:opacity-70">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h2 className="text-2xl font-semibold">Foster&apos;s story</h2>
          </div>

          {/* STORY CARDS */}
          <div className="flex flex-col gap-6">
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="flex border border-yellow-500 rounded-xl overflow-hidden"
              >
                {/* IMAGE SECTION */}
                <div className="bg-yellow-500 p-3 w-[220px] shrink-0">
                  <div className="relative">
                    <div className="absolute -top-5 left-1/2 z-10 min-w-55 -translate-x-1/2 rounded-full border-2 border-[#f3be0f] bg-white px-5 py-1 text-center text-xs font-semibold text-[#f3be0f] shadow">
                      {story.badge}
                    </div>
                    <Image
                      src={story.image}
                      alt={story.name}
                      width={200}
                      height={120}
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold text-sm">
                      {story.name} <span>{story.gender}</span>
                    </p>
                    <p className="text-xs">{story.shelter}</p>

                    <Link
                      href={`/site/explore/foster-story/${story.id}?name=${encodeURIComponent(story.name)}&shelter=${encodeURIComponent(story.shelter)}&badge=${encodeURIComponent(story.badge)}&story=${encodeURIComponent(story.preview)}&mainImg=${encodeURIComponent(story.image)}&img2=${encodeURIComponent(IMAGES[0])}&img3=${encodeURIComponent(IMAGES[1])}&img4=${encodeURIComponent(IMAGES[2])}`}
                      className="mt-1 inline-block text-[10px] bg-white px-2 py-[2px] rounded-full hover:bg-yellow-100"
                    >
                      more info
                    </Link>
                  </div>
                </div>

                {/* TEXT SECTION */}
                <div className="flex-1 bg-white p-4 flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      &ldquo;{story.badge}&rdquo;
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {story.preview}
                    </p>
                  </div>

                    <div className="flex flex-col justify-between items-center ml-4">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 cursor-pointer hover:fill-yellow-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                      <Link
                        href={`/site/explore/foster-story/${story.id}?name=${encodeURIComponent(story.name)}&shelter=${encodeURIComponent(story.shelter)}&badge=${encodeURIComponent(story.badge)}&story=${encodeURIComponent(story.preview)}&mainImg=${encodeURIComponent(story.image)}&img2=${encodeURIComponent(IMAGES[0])}&img3=${encodeURIComponent(IMAGES[1])}&img4=${encodeURIComponent(IMAGES[2])}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 hover:opacity-70"><path d="m9 18 6-6-6-6"/></svg>
                      </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
