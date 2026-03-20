"use client";

import { useMemo, useState } from "react";
import type { LongestPet } from "@/lib/services/longest";
import type { FosterStory } from "@/lib/services/foster";
import PetCard from "@/components/cards/PetCard";
import FosterCard from "@/components/cards/FosterCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import Image from "next/image";
import Back from "@/public/buttons/Back.svg";
import Forward from "@/public/buttons/Forward.svg";

// Props received by this page from the parent/server component.
type ExplorePageProps = {
  longest: LongestPet[];
  foster: FosterStory[];
};

// Controls which section is expanded:
// - "none" = both sections shown (preview mode)
// - "longest" = only longest residents section
// - "foster" = only foster story section
type SectionMode = "none" | "longest" | "foster";

function SectionHeader({
  title,
  expanded,
  onClick,
}: {
  title: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-4xl font-semibold">{title}</h2>
      {/* Toggle button for expand/collapse of a section */}
      <button
        type="button"
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center text-xl font-bold text-black"
        aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
      >
        {expanded ? (
          <Image src={Back} alt="back-icon" width={30} height={30} />
        ) : (
          <Image src={Forward} alt="forward-icon" width={30} height={30} />
        )}
      </button>
    </div>
  );
}

export default function ExplorePage({ longest, foster }: ExplorePageProps) {
  // Tracks current display mode for sections.
  const [mode, setMode] = useState<SectionMode>("none");

  // Convert `longest` API data into the exact shape needed by <PetCard />.
  // useMemo avoids rebuilding this array unless `longest` changes.
  const longestCards = useMemo(
    () =>
      longest.map((item) => ({
        key: item.id,
        href: `/site/profiles/pets/${item.id}`,
        imageUrl: item.photo_url || DEFAULT_AVATAR_URL,
        petName: item.name?.trim() || `Pet #${item.id}`,
        sex: item.sex,
        shelterName: item.shelter_name?.trim() || "Unknown shelter",
        shelterLogo: item.shelter_logo_url || DEFAULT_AVATAR_URL,
        year_inShelter: item.years_inShelter,
      })),
    [longest],
  );

  // Convert `foster` API data into card props.
  // Uses a composite key because pet_id may repeat in foster stories.
  const fosterCards = useMemo(
    () =>
      foster.map((item) => ({
        key: item.id, // foster row id
        petId: item.pet_id,
        href: `/site/profiles/pets/${item.pet_id}`,
        imageUrl: item.pet_photo_url || DEFAULT_AVATAR_URL,
        petName: item.pet_name?.trim() || `Pet #${item.pet_id}`,
        sex: item.pet_sex,
        shelterName: item.shelter_name?.trim() || "Unknown shelter",
        shelterLogo: item.shelter_logo_url || DEFAULT_AVATAR_URL,
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
      })),
    [foster],
  );

  // Helper booleans to simplify conditional rendering in JSX.
  const showOnlyLongest = mode === "longest";
  const showOnlyFoster = mode === "foster";
  const showBoth = mode === "none";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content area */}
      <div className="flex-1 flex pl-20">
        <div className="w-full max-w-5xl rounded-xl bg-primary">
          <div className="p-5 ml-6 text-6xl font-bold">Explore</div>

          {/* Scrollable white panel containing sections */}
          <main className="h-screen w-full rounded-2xl bg-white border-4 border-primary overflow-y-auto p-6">
            <div className="flex flex-col gap-7 ml-6">
              {(showBoth || showOnlyLongest) && (
                <section>
                  <SectionHeader
                    title="Our Longest Residents"
                    expanded={showOnlyLongest}
                    // If already expanded -> go back to "none" (show both)
                    // else expand only this section.
                    onClick={() =>
                      setMode((m) => (m === "longest" ? "none" : "longest"))
                    }
                  />
                  {longestCards.length === 0 ? (
                    <p className="text-sm text-gray-600">No data yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {/* In preview mode show first 4 cards, otherwise show all */}
                      {(showOnlyLongest
                        ? longestCards
                        : longestCards.slice(0, 4)
                      ).map((card) => (
                        <PetCard
                          key={card.key}
                          href={card.href}
                          imageUrl={card.imageUrl}
                          petName={card.petName}
                          sex={card.sex}
                          shelterName={card.shelterName}
                          shelterLogo={card.shelterLogo}
                          year_inShelter={card.year_inShelter}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {(showBoth || showOnlyFoster) && (
                <section>
                  <SectionHeader
                    title="Foster's Story"
                    expanded={showOnlyFoster}
                    // Same toggle behavior as longest section.
                    onClick={() =>
                      setMode((m) => (m === "foster" ? "none" : "foster"))
                    }
                  />
                  {fosterCards.length === 0 ? (
                    <p className="text-sm text-gray-600">No data yet.</p>
                  ) : (
                    <div className="grid grid-cols-1">
                      {(showOnlyFoster
                        ? fosterCards
                        : fosterCards.slice(0, 4)
                      ).map((card) =>
                        showOnlyFoster ? (
                          <FosterCard
                            key={card.key}
                            petId={card.petId}
                            title={card.title ?? ""}
                            description={card.description ?? ""}
                          >
                            <PetCard
                              href={card.href}
                              imageUrl={card.imageUrl}
                              petName={card.petName}
                              sex={card.sex}
                              shelterName={card.shelterName}
                              shelterLogo={card.shelterLogo}
                              title={card.title ?? ""}
                            />
                          </FosterCard>
                        ) : (
                          <PetCard
                            key={card.key}
                            href={card.href}
                            imageUrl={card.imageUrl}
                            petName={card.petName}
                            sex={card.sex}
                            shelterName={card.shelterName}
                            shelterLogo={card.shelterLogo}
                            title={card.title ?? ""}
                          />
                        ),
                      )}
                    </div>
                  )}
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
