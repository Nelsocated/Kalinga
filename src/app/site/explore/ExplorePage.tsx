"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, MagnifyingGlass, PawPrint, WarningCircle } from "@phosphor-icons/react";

import WebTemplate from "@/src/components/template/WebTemplate";
import PetCard from "@/src/components/cards/PetCard";
import FosterCard from "@/src/components/cards/FosterCard";
import EmptyState from "@/src/components/ui/EmptyState";
import FilterModal from "@/src/components/modal/FilterModal";
import Button from "@/src/components/ui/Button";
import SearchField from "@/src/components/ui/SearchField";
import CardGridSkeleton from "@/src/components/skeletons/CardGridSkeleton";
import { fetchJson } from "@/src/lib/fetchJson";
import type { SearchPetCardItem } from "@/src/lib/types/pets";
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

const SEARCH_DELAY_MS = 250;

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; pets: SearchPetCardItem[] };

/** Available pets by name or breed, through the same endpoint as Lookup. */
function usePetSearch(query: string) {
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const [attempt, setAttempt] = useState(0);
  const q = query.trim();

  useEffect(() => {
    if (!q) return;

    let alive = true;
    const timer = setTimeout(() => {
      setState({ status: "loading" });
      fetchJson<{ data: SearchPetCardItem[] }>("/api/pets/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
      })
        .then((res) => alive && setState({ status: "ready", pets: res.data ?? [] }))
        .catch(() => alive && setState({ status: "error" }));
    }, SEARCH_DELAY_MS);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q, attempt]);

  return { state: q ? state : ({ status: "idle" } as const), retry: () => setAttempt((n) => n + 1) };
}

function SearchResults({
  query,
  state,
  onClear,
  onRetry,
}: {
  query: string;
  state: SearchState;
  onClear: () => void;
  onRetry: () => void;
}) {
  if (state.status === "error") {
    return (
      <EmptyState
        icon={<WarningCircle aria-hidden="true" />}
        title="Couldn't search right now"
        description="Check your connection and try again."
        action={<Button variant="secondary" onClick={onRetry}>Retry</Button>}
      />
    );
  }

  if (state.status !== "ready") return <CardGridSkeleton />;

  if (state.pets.length === 0) {
    return (
      <EmptyState
        icon={<MagnifyingGlass aria-hidden="true" />}
        title={`No pets match "${query.trim()}"`}
        description="Try another name or breed."
        action={<Button variant="secondary" onClick={onClear}>Clear search</Button>}
      />
    );
  }

  return (
    <section aria-label="Search results" className="flex flex-col gap-4">
      <p role="status" className="text-sm text-muted">
        {state.pets.length === 1 ? "1 pet" : `${state.pets.length} pets`}
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {state.pets.map((pet) => (
          <li key={pet.id}>
            <PetCard
              href={`/site/profiles/pets/${pet.id}`}
              imageUrl={pet.photo_url}
              petName={pet.pet_name}
              shelterLogo={pet.shelter?.logo_url ?? undefined}
              shelterName={pet.shelter?.shelter_name ?? "Kalinga shelter"}
              sex={pet.sex}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ExplorePage({ longest, foster }: ExplorePageProps) {
  const [expanded, setExpanded] = useState<"longest" | "foster" | null>(null);
  const [query, setQuery] = useState("");
  const search = usePetSearch(query);

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
        const petName = item.pet_name?.trim() || "Unnamed pet";
        return {
          key: String(item.id),
          href: `/site/profiles/foster/${item.id}`,
          imageUrl: item.pet_photo_url,
          petName,
          sex: item.pet_sex,
          shelterName: item.shelter_name?.trim() || "Kalinga shelter",
          shelterLogo: item.shelter_logo_url ?? undefined,
          title: item.title?.trim() || `${petName}'s story`,
          description: item.description?.trim() || "",
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
      top={
        <SearchField
          value={query}
          onChange={setQuery}
          label="Search pets"
          placeholder="Search pets by name or breed"
        />
      }
      main={
        query.trim() ? (
          <SearchResults
            query={query}
            state={search.state}
            onClear={() => setQuery("")}
            onRetry={search.retry}
          />
        ) : (
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
                ) : (
                  <ul
                    className={
                      expanded === "foster"
                        ? "grid gap-4 md:grid-cols-2"
                        : "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0"
                    }
                  >
                    {(expanded === "foster" ? fosterCards : fosterCards.slice(0, PREVIEW_COUNT)).map(({ key, ...card }) => (
                      <li
                        key={key}
                        className={expanded === "foster" ? "" : "w-[78vw] max-w-80 shrink-0 snap-start md:w-auto md:max-w-none"}
                      >
                        <FosterCard {...card} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            ) : null}
          </div>
        )
      }
    />
  );
}
