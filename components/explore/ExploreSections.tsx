"use client";

import { useState } from "react";
import FosterStory from "@/components/explore/FosterStory";
import LongestResidents from "@/components/explore/LongestResidents";
import { ExplorePet } from "@/components/explore/types";

type ExploreSectionsProps = {
  residents: ExplorePet[];
  stories: ExplorePet[];
};

export default function ExploreSections({ residents, stories }: ExploreSectionsProps) {
  const [showAdoptionPosts, setShowAdoptionPosts] = useState(false);

  return (
    <>
      <section className="mt-8">
        <LongestResidents
          items={residents}
          showAdoptionPosts={showAdoptionPosts}
          onToggleAdoptionPosts={() => setShowAdoptionPosts((current) => !current)}
        />
      </section>

      {!showAdoptionPosts ? (
        <section className="mt-10">
          <FosterStory items={stories} />
        </section>
      ) : null}
    </>
  );
}
