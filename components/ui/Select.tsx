"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Filter from "@/public/icons/Filter.svg";
import Cat from "@/public/icons/Cat.svg";
import Dog from "@/public/icons/Dog.svg";

type FilterType = "all" | "dogs" | "cats";

function Icon(icon: string) {
  return <Image src={icon} alt={`${icon}-icon`} width={30} height={30} />;
}

const options: { label: string; value: FilterType; icon: React.ReactNode }[] = [
  { label: "All", value: "all", icon: Icon(Filter) },
  { label: "Dogs", value: "dogs", icon: Icon(Dog) },
  { label: "Cats", value: "cats", icon: Icon(Cat) },
];

export default function Select({
  value,
  onChange,
}: {
  value: FilterType;
  onChange: (val: FilterType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close when clicking outside
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
    <div ref={ref} className="flex flex-col w-fit">
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-[15px] bg-white px-4 py-2 text-lg font-semibold shadow-sm hover:bg-neutral-200 w-35"
      >
        <div className="flex w-full items-center justify-between">
          <span>{selected?.label}</span>
          <div>{selected?.icon}</div>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 rounded-[15px] w-35 bg-white border-2 shadow-md overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                value === opt.value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <span>{opt.label}</span>
              <span>{opt.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
