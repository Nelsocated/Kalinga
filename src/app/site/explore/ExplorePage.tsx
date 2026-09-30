"use client";

import { useMemo, useState } from "react";
import { BookOpen, PawPrint } from "@phosphor-icons/react";

import WebTemplate from "@/src/components/template/WebTemplate";
import PetCard from "@/src/components/cards/PetCard";
import FosterCard from "@/src/components/cards/FosterCard";
import EmptyState from "@/src/components/ui/EmptyState";
import FilterModal from "@/src/components/modal/FilterModal";
import { cn } from "@/src/lib/cn";

import type { LongestPet, FosterStory } from "./page";

type ExplorePageProps = {
  longest: LongestPet[];
  foster: FosterStory[];
};

const PREVIEW_COUNT = 4;

/** Section title with a See all / Show less toggle when there's more to show. */
function Section({
  id,
  title,
  expanded,
  canExpand,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  expanded: boolean;
  canExpand: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="text-xl font-semibold text-ink">
          {title}
        </h2>
        {canExpand ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="rounded-full px-3 py-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            {expanded ? "Show less" : "See all"}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Phones: a sideways snap row. From lg (or when expanded): a grid. */
function rowOrGrid(expanded: boolean, cols = "lg:grid-cols-4") {
  return cn(
    expanded
      ? "grid grid-cols-2 gap-4 sm:grid-cols-3"
      : "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0",
    cols,
  );
}

const rowItem = "w-[44vw] max-w-52 shrink-0 snap-start lg:w-auto lg:max-w-none";

export default function ExplorePage({ longest, foster }: ExplorePageProps) {
  const [expanded, setExpanded] = useState<"longest" | "foster" | null>(null);

  const longestCards = useMemo(
    () =>
      longest.map((item) => ({
        key: item.id,
        href: `/site/profiles/pets/${item.id}`,
        imageUrl: item.photo_url,
        petName: item.name?.trim() || "Unnamed pet",
        sex: item.sex,
        shelterName: item.shelter_name?.trim() || "Kalinga shelter",
        shelterLogo: item.shelter_logo_url ?? undefined,
        year_inShelter: item.years_inShelter ?? undefined,
      })),
    [longest],
  );

  const fosterCards = useMemo(
    () =>
      foster.map((item) => {
        const petId = String(item.pet_id);
        const storyId = String(item.id);
        const petName = item.pet_name?.trim() || "Unnamed pet";
        const shelterName = item.shelter_name?.trim() || "Kalinga shelter";
        const imageUrl = item.pet_photo_url ?? "";
        const title = item.title?.trim() || `${petName}'s story`;
        const description = item.description?.trim() || "";
        const location = item.shelter_location?.trim() || "";

        const params = new URLSearchParams({
          petId,
          name: petName,
          sex: item.pet_sex || "unknown",
          shelter_name: shelterName,
          logo_url: item.shelter_logo_url ?? "",
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
          shelterLogo: item.shelter_logo_url ?? undefined,
          title,
          description,
        };
      }),
    [foster],
  );

  const showLongest = expanded !== "foster";
  const showFoster = expanded !== "longest";

  return (
    <WebTemplate
      header="Explore"
      actions={<FilterModal variant="button" />}
      main={
        <div className="flex flex-col gap-10">
          {showLongest ? (
            <Section
              id="longest-residents"
              title="Our longest residents"
              expanded={expanded === "longest"}
              canExpand={longestCards.length > PREVIEW_COUNT}
              onToggle={() => setExpanded((m) => (m === "longest" ? null : "longest"))}
            >
              {longestCards.length === 0 ? (
                <EmptyState icon={<PawPrint aria-hidden="true" />} title="No pets here yet" />
              ) : (
                <ul className={rowOrGrid(expanded === "longest")}>
                  {(expanded === "longest" ? longestCards : longestCards.slice(0, PREVIEW_COUNT)).map(({ key, ...card }) => (
                    <li key={key} className={expanded === "longest" ? "" : rowItem}>
                      <PetCard {...card} />
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          ) : null}

          {showFoster ? (
            <Section
              id="foster-stories"
              title="Foster stories"
              expanded={expanded === "foster"}
              canExpand={fosterCards.length > PREVIEW_COUNT}
              onToggle={() => setExpanded((m) => (m === "foster" ? null : "foster"))}
            >
              {fosterCards.length === 0 ? (
                <EmptyState icon={<BookOpen aria-hidden="true" />} title="No foster stories yet" />
              ) : expanded === "foster" ? (
                <ul className="grid gap-4 md:grid-cols-2">
                  {fosterCards.map((card) => (
                    <li key={card.key}>
                      <FosterCard href={card.href} title={card.title} description={card.description}>
                        <PetCard
                          href={`/site/profiles/pets/${card.petId}`}
                          imageUrl={card.imageUrl}
                          petName={card.petName}
                          sex={card.sex}
                          resize
                        />
                      </FosterCard>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className={rowOrGrid(false)}>
                  {fosterCards.slice(0, PREVIEW_COUNT).map((card) => (
                    <li key={card.key} className={rowItem}>
                      <PetCard
                        href={card.href}
                        title={card.title}
                        imageUrl={card.imageUrl}
                        petName={card.petName}
                        sex={card.sex}
                        shelterName={card.shelterName}
                        shelterLogo={card.shelterLogo}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          ) : null}
        </div>
      }
    />
  );
}
