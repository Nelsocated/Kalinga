"use client";

import { useMemo, useState } from "react";
import { Funnel, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";

import type { Pets, SearchPetCardItem } from "@/src/lib/types/pets";
import { fetchJson } from "@/src/lib/fetchJson";

import PetCard from "../cards/PetCard";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";
import FilterControls from "../ui/FilterControls";
import CardGridSkeleton from "../skeletons/CardGridSkeleton";
import { sidebarItemClass } from "../layout/navItems";

type ViewKey = "filters" | "results";

function toggleArrayValue<T extends string>(value: T, values: T[]): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

/**
 * Pet search by species, sex, age and size.
 * "sidebar" is the nav row; "button" is a page-header action for phones and Explore.
 */
export default function FilterModal({ variant = "sidebar" }: { variant?: "sidebar" | "button" }) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("filters");

  const [species, setSpecies] = useState<Pets["species"][]>([]);
  const [sex, setSex] = useState<Pets["sex"][]>([]);
  const [age, setAge] = useState<Pets["age"][]>([]);
  const [size, setSize] = useState<Pets["size"][]>([]);

  const [pets, setPets] = useState<SearchPetCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  const filters = useMemo(() => ({ species, sex, age, size }), [species, sex, age, size]);
  const hasAnyFilter = species.length + sex.length + age.length + size.length > 0;

  function toggle<T extends string>(setter: React.Dispatch<React.SetStateAction<T[]>>) {
    return (value: T) => {
      setFilterError(null);
      setter((prev) => toggleArrayValue(value, prev));
    };
  }

  async function runSearch() {
    if (!hasAnyFilter) {
      setFilterError("Pick at least one filter to see matching pets.");
      return;
    }

    setFilterError(null);
    setSearchFailed(false);
    setActiveView("results");
    setLoading(true);
    try {
      const json = await fetchJson<{ data: SearchPetCardItem[] }>("/api/pets/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      setPets(json.data);
    } catch (error: unknown) {
      console.error("Failed to fetch pets:", error);
      setPets([]);
      setSearchFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSpecies([]);
    setSex([]);
    setAge([]);
    setSize([]);
    setPets([]);
    setFilterError(null);
    setActiveView("filters");
  }

  function openModal() {
    setOpen(true);
    setActiveView("filters");
    setFilterError(null);
  }

  const footer =
    activeView === "filters" ? (
      <>
        <Button variant="ghost" onClick={resetFilters} disabled={!hasAnyFilter}>
          Clear
        </Button>
        <Button variant="primary" onClick={runSearch}>
          See pets
        </Button>
      </>
    ) : (
      <Button variant="secondary" onClick={() => setActiveView("filters")}>
        Change filters
      </Button>
    );

  return (
    <>
      {variant === "sidebar" ? (
        <button type="button" onClick={openModal} className={sidebarItemClass()}>
          <Funnel size={24} aria-hidden="true" />
          <span className="sr-only lg:not-sr-only">Lookup</span>
        </button>
      ) : (
        <Button variant="secondary" onClick={openModal} icon={<MagnifyingGlass aria-hidden="true" />}>
          Find a pet
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={activeView === "filters" ? "Find your match" : "Matching pets"}
        className="sm:max-w-3xl"
        footer={footer}
      >
        {activeView === "filters" ? (
          <div className="flex flex-col gap-6">
            <FilterControls.SpeciesSection selected={species} onToggle={toggle(setSpecies)} />
            <FilterControls.GenderSection selected={sex} onToggle={toggle(setSex)} />
            <FilterControls.AgeSection selected={age} onToggle={toggle(setAge)} />
            <FilterControls.SizeSection selected={size} onToggle={toggle(setSize)} />
            {filterError ? (
              <p role="alert" className="text-sm font-medium text-reject-text">
                {filterError}
              </p>
            ) : null}
          </div>
        ) : loading ? (
          <CardGridSkeleton count={6} />
        ) : searchFailed ? (
          <EmptyState
            icon={<WarningCircle aria-hidden="true" />}
            title="Couldn't load pets"
            description="Check your connection and try again."
            action={
              <Button variant="primary" onClick={runSearch}>
                Retry
              </Button>
            }
          />
        ) : pets.length === 0 ? (
          <EmptyState
            icon={<Funnel aria-hidden="true" />}
            title="No pets match yet"
            description="Try fewer filters to see more pets."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted" role="status">
              {pets.length} pet{pets.length === 1 ? "" : "s"} found
            </p>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {pets.map((pet) => (
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
          </div>
        )}
      </Modal>
    </>
  );
}
