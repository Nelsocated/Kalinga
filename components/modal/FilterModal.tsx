"use client";

import { useMemo, useState } from "react";
import { fetchSearchPets } from "@/lib/services/search_pets";
import PetCard from "@/components/cards/PetCard";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Back_Button from "../ui/Back";

import Filter from "@/public/icons/Filter.svg";
import Gender from "@/public/icons/Gender.svg";
import Dog from "@/public/icons/Dog.svg";
import Cat from "@/public/icons/Cat.svg";
import Species from "@/public/icons/Species.svg";
import Meet from "@/public/icons/meet(ver 2).svg";
import male_icon from "@/public/icons/male-icon.svg";
import female_icon from "@/public/icons/female-icon.svg";
import Age from "@/public/icons/Age.svg";
import Size from "@/public/icons/Size.svg";

function toggleValue(
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
  );
}

type ViewKey = "filters" | "results";

export default function FilterModal() {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("filters");

  const [species, setSpecies] = useState<string[]>([]);
  const [sex, setSex] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);

  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({ species, sex, age, size }),
    [species, sex, age, size],
  );

  function handleToggle(
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setFilterError(null); // clear immediately on any filter click
    toggleValue(value, setter);
  }

  async function runSearch() {
    const hasAnyFilter =
      species.length > 0 || sex.length > 0 || age.length > 0 || size.length > 0;

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
      setPets(data ?? []);
      setActiveView("results");
    } catch (error) {
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

  function handleBack() {
    if (activeView === "results") {
      setActiveView("filters");
      return;
    }

    setOpen(false);
  }

  const sectionTitle = "flex items-center gap-2 text-2xl font-semibold";
  const buttonGroup = "flex flex-wrap gap-2 mt-2 ml-12";

  const filterBtn = (active: boolean) =>
    [
      "min-w-[130px] rounded-md border flex items-center justify-center gap-2 text-center leading-none transition",
      active
        ? "bg-primary text-black border-primary"
        : "bg-white text-black border-black/20 hover:bg-primary/10",
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
        className="border border-primary"
      >
        <div className="flex gap-3">
          <Image src={Filter} alt="filter-icon" width={25} height={25} />
          Lookup
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-180 max-w-[92%] rounded-2xl border-2 border-primary bg-white">
            {/* HEADER */}
            <div className="relative rounded-t-2xl bg-primary py-4 text-4xl font-bold text-white flex items-center justify-center">
              <div className="absolute left-4">
                <Back_Button onClick={handleBack} />
              </div>

              {activeView === "filters" ? "Find your match" : "Recommendations"}
            </div>

            {/* CONTENT */}
            <div className="max-h-[82vh] overflow-y-auto p-5">
              {activeView === "filters" ? (
                <div className="space-y-3">
                  {/* SPECIES */}
                  <div>
                    <div className={sectionTitle}>
                      <Image src={Species} alt="" width={45} height={45} />
                      Species
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(species.includes("dog"))}
                        onClick={() => handleToggle("dog", setSpecies)}
                      >
                        <Image src={Dog} alt="" width={32} height={32} />
                        Dog
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(species.includes("cat"))}
                        onClick={() => handleToggle("cat", setSpecies)}
                      >
                        <Image src={Cat} alt="" width={32} height={32} />
                        Cat
                      </Button>
                    </div>
                  </div>

                  {/* SEX */}
                  <div>
                    <div className={sectionTitle}>
                      <Image src={Gender} alt="gender" width={40} height={40} />
                      Gender
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(sex.includes("male"))}
                        onClick={() => handleToggle("male", setSex)}
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
                        onClick={() => handleToggle("female", setSex)}
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

                  {/* AGE */}
                  <div>
                    <div className={sectionTitle}>
                      <Image src={Age} alt="age-icon" width={35} height={35} />
                      Age
                    </div>

                    <div className={buttonGroup}>
                      <Button
                        type="button"
                        className={filterBtn(age.includes("puppy/kitten"))}
                        onClick={() => handleToggle("puppy/kitten", setAge)}
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
                        onClick={() => handleToggle("young_adult", setAge)}
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
                        onClick={() => handleToggle("adult", setAge)}
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
                        onClick={() => handleToggle("senior", setAge)}
                      >
                        <div>
                          Senior
                          <br />
                          (7+ years)
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* SIZE */}
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
                        onClick={() => handleToggle("small", setSize)}
                      >
                        Small
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(size.includes("medium"))}
                        onClick={() => handleToggle("medium", setSize)}
                      >
                        Medium
                      </Button>

                      <Button
                        type="button"
                        className={filterBtn(size.includes("large"))}
                        onClick={() => handleToggle("large", setSize)}
                      >
                        Large
                      </Button>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div>
                    {filterError && (
                      <div className="mb-2 text-center text-sm font-medium text-red-600">
                        {filterError}
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-3">
                      <Button
                        onClick={runSearch}
                        className="flex items-center justify-center gap-2 border border-primary"
                      >
                        <Image src={Meet} alt="" width={32} height={32} />
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
                  {loading && <div>Loading...</div>}

                  {!loading && pets.length === 0 && (
                    <div className="text-center text-sm opacity-60">
                      No pets found. Try changing your filters.
                    </div>
                  )}

                  {!loading && pets.length > 0 && (
                    <div className="text-center text-sm font-medium">
                      {pets.length} pet{pets.length > 1 ? "s" : ""} found
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pets.map((pet: any) => (
                      <PetCard
                        key={pet.id}
                        href={`/site/profiles/pets/${pet.id}`}
                        imageUrl={pet.photo_url}
                        petName={pet.name}
                        shelterLogo={pet.shelter?.logo_url}
                        shelterName={pet.shelter?.shelter_name}
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
