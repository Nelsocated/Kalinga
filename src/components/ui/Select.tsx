"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

type Option<T extends string> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
};

type Props<T extends string> = {
  value: T;
  onChange: (val: T) => void;
  options: Option<T>[];
  className?: string;
  dropdownClassName?: string;
  "aria-label"?: string;
};

export default function Select<T extends string>({
  value,
  onChange,
  options,
  className,
  dropdownClassName,
  "aria-label": ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);

    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setActive(selectedIndex);
      return setOpen(true);
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    }
  }

  return (
    <div ref={ref} className="relative inline-block" onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => {
          setActive(selectedIndex);
          setOpen((prev) => !prev);
        }}
        className={cn(
          "flex h-11 w-44 items-center justify-between gap-2 rounded-full border border-line bg-card px-4 text-sm font-medium text-ink",
          "transition-[background-color,box-shadow] duration-200 hover:bg-sunshine-wash",
          open && "ring-2 ring-ink/15",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selected?.icon}
          {selected?.label ?? "Select"}
        </span>
        <CaretDown
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-activedescendant={`${listId}-${active}`}
          className={cn(
            "absolute left-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-card p-1 shadow-float",
            dropdownClassName,
          )}
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;

            return (
              <li
                key={opt.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm text-ink",
                  index === active && "bg-sunshine-wash",
                  isSelected && "font-semibold",
                )}
              >
                <span className="flex items-center gap-2">
                  {opt.icon}
                  {opt.label}
                </span>
                {isSelected ? <Check aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
