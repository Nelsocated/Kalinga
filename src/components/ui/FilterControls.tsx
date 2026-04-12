import Image from "next/image";
import BackButton from "./BackButton";
import Button from "./Button";

import Gender from "@/public/icons/Gender.svg";
import Dog from "@/public/icons/Dog.svg";
import Cat from "@/public/icons/Cat.svg";
import Species from "@/public/icons/Species.svg";
import Meet from "@/public/icons/meet(ver2).svg";
import male_icon from "@/public/icons/male-icon.svg";
import female_icon from "@/public/icons/female-icon.svg";
import Date from "@/public/icons/Date.svg";
import Size from "@/public/icons/Size.svg";

import type { Pets } from "@/src/lib/types/pets";

const sectionTitle = "flex items-center gap-2 text-subtitle font-semibold";
const buttonGroup = "mt-1 flex flex-wrap gap-2 ";

const filterBtn = (active: boolean) =>
  [
    "rounded-[15px] px-2 py-1 border text-lg font-medium flex items-center justify-center gap-2 text-center leading-none transition",
    active
      ? "bg-primary text-black"
      : "border-black/50 bg-white text-black hover:bg-primary/10",
  ].join(" ");

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="relative flex items-center justify-center rounded-t-[15px] bg-primary text-subheader font-bold text-white">
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
        <Image src={Species} alt="" width={45} height={45} />
        Species
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("dog"))}
          onClick={() => onToggle("dog")}
        >
          <Image src={Dog} alt="" width={32} height={32} />
          Dog
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("cat"))}
          onClick={() => onToggle("cat")}
        >
          <Image src={Cat} alt="" width={30} height={30} />
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
        <Image src={Gender} alt="gender" width={40} height={40} />
        Gender
      </div>
      <div className={buttonGroup}>
        <button
          type="button"
          className={filterBtn(selected.includes("male"))}
          onClick={() => onToggle("male")}
        >
          <Image src={male_icon} alt="male icon" width={26} height={26} />
          Male
        </button>
        <button
          type="button"
          className={filterBtn(selected.includes("female"))}
          onClick={() => onToggle("female")}
        >
          <Image src={female_icon} alt="female icon" width={26} height={26} />
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
        <Image src={Date} alt="date-icon" width={35} height={35} />
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
        <Image src={Size} alt="size-icon" width={35} height={35} />
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
          className="border border-black/20 bg-white text-black"
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={onSearch}
          className="flex items-center justify-center gap-2 border bg-white"
        >
          <Image src={Meet} alt="meet-icon" width={32} height={32} />
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
