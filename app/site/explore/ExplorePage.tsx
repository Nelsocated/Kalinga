"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import PetCard from "@/components/cards/PetCard";
import FosterCard from "@/components/cards/FosterCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import Back from "@/public/buttons/Back.svg";
import Forward from "@/public/buttons/Forward.svg";

type PetGender = "male" | "female" | "unknown";

type LongestPet = {
  id: string;
  years_inShelter: number | null;
  name: string | null;
  sex: PetGender;
  photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

type FosterStory = {
  id: string;
  pet_id: string;
  title: string | null;
  description: string | null;
  pet_name: string | null;
  pet_sex: PetGender;
  pet_photo_url: string | null;
  shelter_name: string | null;
  shelter_logo_url: string | null;
};

type ExplorePageProps = {
  longest: LongestPet[];
  foster: FosterStory[];
};

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
  const [mode, setMode] = useState<SectionMode>("none");

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
        year_inShelter: item.years_inShelter ?? undefined,
      })),
    [longest],
  );

  const fosterCards = useMemo(
    () =>
      foster.map((item) => ({
        key: item.id,
        petId: String(item.pet_id),
        href: `/site/profiles/pets/${item.pet_id}`,
        imageUrl: item.pet_photo_url || DEFAULT_AVATAR_URL,
        petName: item.pet_name?.trim() || `Pet #${item.pet_id}`,
        sex: item.pet_sex,
        shelterName: item.shelter_name?.trim() || "Unknown shelter",
        shelterLogo: item.shelter_logo_url || DEFAULT_AVATAR_URL,
        title: item.title?.trim() || "",
        description: item.description?.trim() || "",
      })),
    [foster],
  );

  const showOnlyLongest = mode === "longest";
  const showOnlyFoster = mode === "foster";
  const showBoth = mode === "none";

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 pl-20">
        <div className="flex h-full w-full max-w-5xl flex-col rounded-[15px] bg-primary">
          <div className="ml-6 p-5 text-6xl font-bold">Explore</div>

          <main className="flex-1 min-h-0 w-full overflow-y-auto scroll-stable rounded-[15px] border-2 bg-white p-6">
            <div className="ml-6 flex flex-col gap-7">
              {(showBoth || showOnlyLongest) && (
                <section>
                  <SectionHeader
                    title="Our Longest Residents"
                    expanded={showOnlyLongest}
                    onClick={() =>
                      setMode((m) => (m === "longest" ? "none" : "longest"))
                    }
                  />
                  {longestCards.length === 0 ? (
                    <p className="text-sm text-gray-600">No data yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 pt-3">
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
                    onClick={() =>
                      setMode((m) => (m === "foster" ? "none" : "foster"))
                    }
                  />

                  {fosterCards.length === 0 ? (
                    <p className="text-sm text-gray-600">No data yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {(showOnlyFoster
                        ? fosterCards
                        : fosterCards.slice(0, 4)
                      ).map((card) =>
                        showOnlyFoster ? (
                          <FosterCard
                            key={card.key}
                            petId={card.petId}
                            title={card.title}
                            description={card.description}
                          >
                            <PetCard
                              href={card.href}
                              imageUrl={card.imageUrl}
                              petName={card.petName}
                              sex={card.sex}
                              shelterName={card.shelterName}
                              shelterLogo={card.shelterLogo}
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
