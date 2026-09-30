import { Cat, Dog, GenderFemale, GenderMale } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/lib/cn";
import type { Pets } from "@/src/lib/types/pets";

type Option<T extends string> = { value: T; label: string; hint?: string; icon?: React.ReactNode };

/** A labelled group of pill toggles. Several can be on at once. */
function ToggleGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: Option<T>[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-semibold text-ink">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option.value)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-sunshine bg-sunshine text-ink"
                  : "border-line bg-card text-ink hover:bg-sunshine-wash",
              )}
            >
              {option.icon}
              <span>
                {option.label}
                {option.hint ? <span className="ml-1 text-xs font-normal text-ink-soft">{option.hint}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SpeciesSection({ selected, onToggle }: { selected: Pets["species"][]; onToggle: (v: Pets["species"]) => void }) {
  return (
    <ToggleGroup
      title="Species"
      selected={selected}
      onToggle={onToggle}
      options={[
        { value: "dog", label: "Dog", icon: <Dog size={18} aria-hidden="true" /> },
        { value: "cat", label: "Cat", icon: <Cat size={18} aria-hidden="true" /> },
      ]}
    />
  );
}

function GenderSection({ selected, onToggle }: { selected: Pets["sex"][]; onToggle: (v: Pets["sex"]) => void }) {
  return (
    <ToggleGroup
      title="Sex"
      selected={selected}
      onToggle={onToggle}
      options={[
        { value: "male", label: "Male", icon: <GenderMale size={18} aria-hidden="true" /> },
        { value: "female", label: "Female", icon: <GenderFemale size={18} aria-hidden="true" /> },
      ]}
    />
  );
}

function AgeSection({ selected, onToggle }: { selected: Pets["age"][]; onToggle: (v: Pets["age"]) => void }) {
  return (
    <ToggleGroup
      title="Age"
      selected={selected}
      onToggle={onToggle}
      options={[
        { value: "kitten/puppy", label: "Puppy or kitten", hint: "under 1" },
        { value: "young_adult", label: "Young adult", hint: "1 to 3" },
        { value: "adult", label: "Adult", hint: "3 to 7" },
        { value: "senior", label: "Senior", hint: "7+" },
      ]}
    />
  );
}

function SizeSection({ selected, onToggle }: { selected: Pets["size"][]; onToggle: (v: Pets["size"]) => void }) {
  return (
    <ToggleGroup
      title="Size"
      selected={selected}
      onToggle={onToggle}
      options={[
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ]}
    />
  );
}

const FilterControls = {
  SpeciesSection,
  GenderSection,
  AgeSection,
  SizeSection,
};
export default FilterControls;
