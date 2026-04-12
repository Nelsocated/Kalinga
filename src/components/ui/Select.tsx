"use client";

import React, { useEffect, useRef, useState } from "react";

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
};

export default function Select<T extends string>({
  value,
  onChange,
  options,
  className = "",
  dropdownClassName = "",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11 w-40 items-center justify-between rounded-[15px] border border-primary/40 bg-white px-4 text-sm font-semibold ${className}`}
      >
        <span>{selected?.label ?? "Select"}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute left-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-[15px] border border-primary/40 bg-white shadow-md ${dropdownClassName}`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-gray-100 ${
                value === opt.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <span>{opt.label}</span>
              {opt.icon && <span>{opt.icon}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
