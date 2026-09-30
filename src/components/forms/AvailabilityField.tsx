"use client";

import { cn } from "@/src/lib/cn";

type Availability = "available" | "not_available" | "";

const OPTIONS: { value: Availability; label: string }[] = [
  { value: "", label: "Leave as is" },
  { value: "available", label: "Available" },
  { value: "not_available", label: "Not available" },
];

/** Optionally update the pet's adoption availability while posting. */
export default function AvailabilityField({
  value,
  onChange,
}: {
  value: Availability;
  onChange: (value: Availability) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-semibold text-ink">Adoption availability</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value || "unchanged"}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                selected ? "border-sunshine bg-sunshine text-ink" : "border-line bg-card text-ink hover:bg-sunshine-wash",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
