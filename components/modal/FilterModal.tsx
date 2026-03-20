"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Pets, SearchPetCardItem } from "@/lib/types/pets";
import { fetchSearchPets } from "@/lib/services/pet/petSearchClient";

import PetCard from "@/components/cards/PetCard";
import Button from "@/components/ui/Button";
import BackButton from "../ui/BackButton";

import Filter from "@/public/icons/Filter.svg";
import Gender from "@/public/icons/Gender.svg";
import Dog from "@/public/icons/Dog.svg";
import Cat from "@/public/icons/Cat.svg";
import Species from "@/public/icons/Species.svg";
import Meet from "@/public/icons/meet(ver2).svg";
import male_icon from "@/public/icons/male-icon.svg";
import female_icon from "@/public/icons/female-icon.svg";
import Date from "@/public/icons/Date.svg";
import Size from "@/public/icons/Size.svg";

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

  const sectionTitle = "flex items-center gap-2 text-2xl font-semibold";
  const buttonGroup = "ml-12 mt-2 flex flex-wrap gap-2";

  const filterBtn = (active: boolean) =>
    [
      "min-w-[130px] rounded-[15px] border flex items-center justify-center gap-2 text-center leading-none transition",
      active
        ? "bg-primary text-black"
        : "border-black/50 bg-white text-black hover:bg-primary/10",
    ].join(" ");

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
            <div className="relative flex items-center justify-center rounded-t-[15px] bg-primary py-4 text-4xl font-bold text-white">
              <div className="absolute left-4">
                <BackButton onClick={handleBack} />
              </div>

              {activeView === "filters" ? "Find your match" : "Recommendations"}
            </div>

            <div className="max-h-[82vh] overflow-y-auto scroll-stable p-5">
              {activeView === "filters" ? (
                <div className="space-y-3">
                  <div>
                    <div className={sectionTitle}>
                      <Image src={Species} alt="" width={45} height={45} />
                      Species
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(species.includes("dog"))}
                        onClick={() => handleSpeciesToggle("dog")}
                      >
                        <Image src={Dog} alt="" width={32} height={32} />
                        Dog
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(species.includes("cat"))}
                        onClick={() => handleSpeciesToggle("cat")}
                      >
                        <Image src={Cat} alt="" width={32} height={32} />
                        Cat
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className={sectionTitle}>
                      <Image src={Gender} alt="gender" width={40} height={40} />
                      Gender
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(sex.includes("male"))}
                        onClick={() => handleSexToggle("male")}
                      >
                        <Image
                          src={male_icon}
                          alt="male icon"
                          width={26}
                          height={26}
                        />
                        Male
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(sex.includes("female"))}
                        onClick={() => handleSexToggle("female")}
                      >
                        <Image
                          src={female_icon}
                          alt="female icon"
                          width={26}
                          height={26}
                        />
                        Female
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className={sectionTitle}>
                      <Image
                        src={Date}
                        alt="date-icon"
                        width={35}
                        height={35}
                      />
                      Age
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(age.includes("kitten/puppy"))}
                        onClick={() => handleAgeToggle("kitten/puppy")}
                      >
                        <div>
                          Puppy/Kitten
                          <br />
                          (Under 1 year)
                        </div>
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(age.includes("young_adult"))}
                        onClick={() => handleAgeToggle("young_adult")}
                      >
                        <div>
                          Young Adult
                          <br />
                          (1–3 years)
                        </div>
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(age.includes("adult"))}
                        onClick={() => handleAgeToggle("adult")}
                      >
                        <div>
                          Adult
                          <br />
                          (3–7 years)
                        </div>
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(age.includes("senior"))}
                        onClick={() => handleAgeToggle("senior")}
                      >
                        <div>
                          Senior
                          <br />
                          (7+ years)
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className={sectionTitle}>
                      <Image
                        src={Size}
                        alt="size-icon"
                        width={35}
                        height={35}
                      />
                      Size
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(size.includes("small"))}
                        onClick={() => handleSizeToggle("small")}
                      >
                        Small
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(size.includes("medium"))}
                        onClick={() => handleSizeToggle("medium")}
                      >
                        Medium
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(size.includes("large"))}
                        onClick={() => handleSizeToggle("large")}
                      >
                        Large
                      </Button>
                    </div>
                  </div>

                  <div>
                    {filterError ? (
                      <div className="mb-2 text-center text-sm font-medium text-red-600">
                        {filterError}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap justify-center gap-3">
                      <Button
                        type="button"
                        onClick={runSearch}
                        className="flex items-center justify-center gap-2 border bg-white"
                      >
                        <Image
                          src={Meet}
                          alt="meet-icon"
                          width={32}
                          height={32}
                        />
                        See Pets
                      </Button>

                      <Button
                        type="button"
                        onClick={resetFilters}
                        className="border border-black/20 bg-white text-black"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
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
