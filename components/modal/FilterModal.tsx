"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Pets, SearchPetCardItem } from "@/lib/types/pets";
import { fetchSearchPets } from "@/lib/services/pet/petSearchClient";

import PetCard from "@/components/cards/PetCard";
import Button from "@/components/ui/Button";
import FilterControls from "@/components/ui/FilterControls";

import Filter from "@/public/icons/Filter.svg";

type ViewKey = "filters" | "results";

function toggleArrayValue<T extends string>(value: T, values: T[]): T[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export default function FilterModal() {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("filters");

  const [species, setSpecies] = useState<Pets["species"][]>([]);
  const [sex, setSex] = useState<Pets["sex"][]>([]);
  const [age, setAge] = useState<Pets["age"][]>([]);
  const [size, setSize] = useState<Pets["size"][]>([]);

  const [pets, setPets] = useState<SearchPetCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({ species, sex, age, size }),
    [species, sex, age, size],
  );

  const hasAnyFilter = useMemo(
    () =>
      species.length > 0 || sex.length > 0 || age.length > 0 || size.length > 0,
    [species, sex, age, size],
  );

  function handleSpeciesToggle(value: Pets["species"]) {
    setFilterError(null);
    setSpecies((prev) => toggleArrayValue(value, prev));
  }

  function handleSexToggle(value: Pets["sex"]) {
    setFilterError(null);
    setSex((prev) => toggleArrayValue(value, prev));
  }

  function handleAgeToggle(value: Pets["age"]) {
    setFilterError(null);
    setAge((prev) => toggleArrayValue(value, prev));
  }

  function handleSizeToggle(value: Pets["size"]) {
    setFilterError(null);
    setSize((prev) => toggleArrayValue(value, prev));
  }

  async function runSearch() {
    if (!hasAnyFilter) {
      setFilterError(
        "Please select at least one filter before clicking See Pets.",
      );
      return;
    }

    try {
      setFilterError(null);
      setLoading(true);
      const data = await fetchSearchPets(filters);
      setPets(data);
      setActiveView("results");
    } catch (error: unknown) {
      console.error("Failed to fetch pets:", error);
      setPets([]);
      setActiveView("results");
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

  function closeModal() {
    setOpen(false);
  }

  function handleBack() {
    if (activeView === "results") {
      setActiveView("filters");
      return;
    }
    closeModal();
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setOpen(true);
          setActiveView("filters");
          setFilterError(null);
        }}
        className="border"
      >
        <div className="flex gap-3">
          <Image src={Filter} alt="filter-icon" width={25} height={25} />
          Lookup
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative z-10 w-180 max-w-[92%] rounded-[15px] border-2 bg-white">
            <FilterControls.Header
              title={
                activeView === "filters" ? "Find your match" : "Recommendations"
              }
              onBack={handleBack}
            />

            <div className="max-h-[82vh] overflow-y-auto scroll-stable py-3">
              {activeView === "filters" ? (
                <div className="space-y-5 flex flex-col items-center justify-center">
                  <FilterControls.SpeciesSection
                    selected={species}
                    onToggle={handleSpeciesToggle}
                  />
                  <FilterControls.GenderSection
                    selected={sex}
                    onToggle={handleSexToggle}
                  />
                  <FilterControls.AgeSection
                    selected={age}
                    onToggle={handleAgeToggle}
                  />
                  <FilterControls.SizeSection
                    selected={size}
                    onToggle={handleSizeToggle}
                  />
                  <FilterControls.Actions
                    onReset={resetFilters}
                    onSearch={runSearch}
                    error={filterError}
                  />
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {loading ? <div>Loading...</div> : null}

                  {!loading && pets.length === 0 ? (
                    <div className="text-center text-sm opacity-60">
                      No pets found. Try changing your filters.
                    </div>
                  ) : null}

                  {!loading && pets.length > 0 ? (
                    <div className="text-center text-sm font-medium">
                      {pets.length} pet{pets.length > 1 ? "s" : ""} found
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pets.map((pet) => (
                      <PetCard
                        key={pet.id}
                        href={`/site/profiles/pets/${pet.id}`}
                        imageUrl={pet.photo_url}
                        petName={pet.pet_name}
                        shelterLogo={pet.shelter?.logo_url ?? ""}
                        shelterName={
                          pet.shelter?.shelter_name ?? "Unknown Shelter"
                        }
                        sex={pet.sex}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      onClick={() => setActiveView("filters")}
                      className="border border-black/20 bg-white text-black"
                    >
                      Back to Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
