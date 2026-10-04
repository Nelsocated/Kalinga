"use client";

import { useId } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Read by screen readers; the placeholder shows what can be searched. */
  label: string;
  placeholder: string;
  className?: string;
};

/** The search pill at the top of a list: filters as you type, X clears. */
export default function SearchField({ value, onChange, label, placeholder, className }: Props) {
  const id = useId();

  return (
    <div role="search" className={cn("relative w-full sm:max-w-sm", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <MagnifyingGlass
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="h-12 w-full rounded-full border border-line bg-card pr-12 pl-11 text-base text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted hover:border-ink-soft/40 focus:border-ink focus:ring-2 focus:ring-ink/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sunshine-wash hover:text-ink"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

/** Case- and accent-insensitive "contains" for client-side filtering. */
export function matchesQuery(query: string, ...fields: (string | null | undefined)[]) {
  const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const q = fold(query.trim());
  return !q || fields.some((field) => field && fold(field).includes(q));
}
