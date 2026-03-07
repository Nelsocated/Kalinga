"use client";

import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreSections from "@/components/explore/ExploreSections";
import { ExplorePet } from "@/components/explore/types";

const FALLBACK_RESIDENTS: ExplorePet[] = [
  {
    id: "fallback-resident-1",
    name: "Nelson",
    shelter: { shelter_name: "Kalinga Shelter" },
    pet_media: [],
  },
  {
    id: "fallback-resident-2",
    name: "Mochi",
    shelter: { shelter_name: "Paw Haven" },
    pet_media: [],
  },
  {
    id: "fallback-resident-3",
    name: "Kopi",
    shelter: { shelter_name: "Happy Tails" },
    pet_media: [],
  },
  {
    id: "fallback-resident-4",
    name: "Bituin",
    shelter: { shelter_name: "Fur Friends" },
    pet_media: [],
  },
];

const FALLBACK_STORIES: ExplorePet[] = [
  {
    id: "fallback-story-1",
    name: "Nelson",
    shelter: { shelter_name: "Kalinga Shelter" },
    pet_media: [{ type: "video", url: "", caption: "Cancer survivor" }],
  },
  {
    id: "fallback-story-2",
    name: "Mimi",
    shelter: { shelter_name: "Paw Haven" },
    pet_media: [{ type: "video", url: "", caption: "Rescued and recovering" }],
  },
  {
    id: "fallback-story-3",
    name: "Rico",
    shelter: { shelter_name: "Happy Tails" },
    pet_media: [{ type: "video", url: "", caption: "Now in foster care" }],
  },
  {
    id: "fallback-story-4",
    name: "Tala",
    shelter: { shelter_name: "Fur Friends" },
    pet_media: [{ type: "video", url: "", caption: "Learning to trust again" }],
  },
];

type ExtendedExploreProps = {
  residents?: ExplorePet[];
  stories?: ExplorePet[];
};

export default function ExtendedExplore({ residents, stories }: ExtendedExploreProps) {
  const residentsToRender = residents?.length ? residents : FALLBACK_RESIDENTS;
  const storiesToRender = stories?.length ? stories : FALLBACK_STORIES;

  return (
    <div className="min-h-[85vh] rounded-2xl border-2 border-[#f3be0f] bg-white p-6 md:p-8">
      <ExploreHeader />
      <ExploreSections residents={residentsToRender} stories={storiesToRender} />
    </div>
  );
}
