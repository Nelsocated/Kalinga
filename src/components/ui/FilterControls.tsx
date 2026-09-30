import BackButton from "./BackButton";
import Button from "./Button";

import type { Pets } from "@/src/lib/types/pets";
import { CalendarBlank, Cat, Dog, GenderFemale, GenderIntersex, GenderMale, Handshake, PawPrint, Ruler } from "@phosphor-icons/react/dist/ssr";

const sectionTitle = "flex items-center gap-2 text-subtitle font-semibold";
const buttonGroup = "mt-1 flex flex-nowrap gap-2 ";

const filterBtn = (active: boolean) =>
  [
    "rounded-[15px] hover:scale-105  w-full py-2 border text-[18px] font-medium flex items-center justify-center gap-2 text-center leading-none transition",
    active
      ? "bg-primary text-black"
      : "border-primary bg-white text-black hover:bg-primary/10",
  ].join(" ");

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="relative flex items-center justify-center rounded-t-[15px]  bg-primary py-1 px-5 text-subheader font-bold text-white">
      <div className="absolute left-4">
        <BackButton onClick={onBack} />
      </div>
      {title}
    </div>
  );
}

function SpeciesSection({
  selected,
  onToggle,
}: {
  selected: Pets["species"][];
  onToggle: (v: Pets["species"]) => void;
}) {
  return (
    <div>
      <div className={sectionTitle}>
        <PawPrint size={45} aria-hidden="true" />
        Species
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("dog"))}
          onClick={() => onToggle("dog")}
        >
          <Dog size={32} aria-hidden="true" />
          Dog
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("cat"))}
          onClick={() => onToggle("cat")}
        >
          <Cat size={30} aria-hidden="true" />
          Cat
        </button>
      </div>
    </div>
  );
}

function GenderSection({
  selected,
  onToggle,
}: {
  selected: Pets["sex"][];
  onToggle: (v: Pets["sex"]) => void;
}) {
  return (
    <div>
      <div className={sectionTitle}>
        <GenderIntersex size={40} aria-hidden="true" />
        Gender
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("male"))}
          onClick={() => onToggle("male")}
        >
          <GenderMale size={26} aria-hidden="true" />
          Male
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("female"))}
          onClick={() => onToggle("female")}
        >
          <GenderFemale size={26} aria-hidden="true" />
          Female
        </button>
      </div>
    </div>
  );
}

function AgeSection({
  selected,
  onToggle,
}: {
  selected: Pets["age"][];
  onToggle: (v: Pets["age"]) => void;
}) {
  return (
    <div>
      <div className={sectionTitle}>
        <CalendarBlank size={35} aria-hidden="true" />
        Age
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("kitten/puppy"))}
          onClick={() => onToggle("kitten/puppy")}
        >
          <div>
            Puppy/Kitten
            <br />
            (Under 1 year)
          </div>
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("young_adult"))}
          onClick={() => onToggle("young_adult")}
        >
          <div>
            Young Adult
            <br />
            (1–3 years)
          </div>
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("adult"))}
          onClick={() => onToggle("adult")}
        >
          <div>
            Adult
            <br />
            (3–7 years)
          </div>
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("senior"))}
          onClick={() => onToggle("senior")}
        >
          <div>
            Senior
            <br />
            (7+ years)
          </div>
        </button>
      </div>
    </div>
  );
}

function SizeSection({
  selected,
  onToggle,
}: {
  selected: Pets["size"][];
  onToggle: (v: Pets["size"]) => void;
}) {
  return (
    <div>
      <div className={sectionTitle}>
        <Ruler size={35} aria-hidden="true" />
        Size
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("small"))}
          onClick={() => onToggle("small")}
        >
          Small
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("medium"))}
          onClick={() => onToggle("medium")}
        >
          Medium
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("large"))}
          onClick={() => onToggle("large")}
        >
          Large
        </button>
      </div>
    </div>
  );
}

function Actions({
  onReset,
  onSearch,
  error,
}: {
  onReset: () => void;
  onSearch: () => void;
  error?: string | null;
}) {
  return (
    <div>
      {error ? (
        <div className="mb-2 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={onReset}
          className="border border-black/20 bg-innerbg hover:bg-chip text-black hover:scale-105 "
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={onSearch}
          className="flex items-center justify-center gap-2 px-y bg-primary hover:scale-105 "
        >
          <Handshake size={32} aria-hidden="true" />
          See Pets
        </Button>
      </div>
    </div>
  );
}

const FilterControls = {
  Header,
  SpeciesSection,
  GenderSection,
  AgeSection,
  SizeSection,
  Actions,
};
export default FilterControls;
