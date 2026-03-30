"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import WebTemplate from "@/components/template/WebTemplate";
import BackButton from "@/components/ui/BackButton";
import PetCard from "@/components/cards/PetCard";
import FosterCard from "@/components/cards/FosterCard";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";
import Back from "@/public/buttons/Back.svg";
import Forward from "@/public/buttons/Forward.svg";

import type { LongestPet, FosterStory } from "./page";

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
    <div className="mb-4 flex items-center">
      <h2 className="text-subheader font-semibold">{title}</h2>
      <button
        type="button"
        onClick={onClick}
        className="flex h-9 w-9 items-center justify-center text-xl font-bold text-black"
        aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
      >
        {expanded ? (
          <Image src={Back} alt="back-icon" width={40} height={40} />
        ) : (
          <Image src={Forward} alt="forward-icon" width={40} height={40} />
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
      foster.map((item) => {
        const petId = String(item.pet_id);
        const storyId = String(item.id);
        const petName = item.pet_name?.trim() || `Pet #${item.pet_id}`;
        const shelterName = item.shelter_name?.trim() || "Unknown shelter";
        const shelterLogo = item.shelter_logo_url || DEFAULT_AVATAR_URL;
        const imageUrl = item.pet_photo_url || DEFAULT_AVATAR_URL;
        const title = item.title?.trim() || "";
        const description = item.description?.trim() || "";
        const location = item.shelter_location?.trim() || "Unknown location";

        const params = new URLSearchParams({
          petId,
          name: petName,
          sex: item.pet_sex || "unknown",
          shelter_name: shelterName,
          logo_url: shelterLogo,
          url: imageUrl,
          type: "photo",
          title,
          description,
          location,
        });

        return {
          key: storyId,
          petId,
          href: `/site/profiles/foster/${storyId}?${params.toString()}`,
          imageUrl,
          petName,
          sex: item.pet_sex,
          shelterName,
          shelterLogo,
          title,
          description,
          location,
        };
      }),
    [foster],
  );

  const showOnlyLongest = mode === "longest";
  const showOnlyFoster = mode === "foster";
  const showBoth = mode === "none";

  return (
    <WebTemplate
      header={
        <div className="flex items-center px-5">
          <h1 className="text-header font-bold text-black">Explore</h1>
          <BackButton />
        </div>
      }
      main={
        <main className="pt-5">
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
                  <div
                    className={
                      showOnlyLongest
                        ? "grid grid-cols-4 gap-4 pt-3 overflow-y-auto scroll stable"
                        : "grid grid-cols-1 gap-4 pt-3 overflow-y-auto scroll stable"
                    }
                  >
                    {(showOnlyLongest
                      ? longestCards
                      : longestCards.slice(0, 5)
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
                  <div
                    className={
                      showOnlyFoster
                        ? "grid grid-cols-1 gap-4 pt-3 overflow-y-auto scroll stable"
                        : "grid grid-cols-4 gap-4 pt-3"
                    }
                  >
                    {(showOnlyFoster
                      ? fosterCards
                      : fosterCards.slice(0, 4)
                    ).map((card) =>
                      showOnlyFoster ? (
                        <FosterCard
                          key={card.key}
                          href={card.href} // ← foster profile
                          petId={card.petId}
                          title={card.title}
                          description={card.description}
                        >
                          <PetCard
                            href={`/site/profiles/pets/${card.petId}`} // ← pet profile
                            title={`"${card.title}"`}
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
                          title={`"${card.title}"`}
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
      }
    />
  );
}
