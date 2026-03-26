"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Image from "next/image";
import More from "@/public/icons/More.svg";
import BackButton from "../ui/BackButton";

export default function MoreModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buttonStyle =
    "bg-white hover:bg-background border-0 flex items-center gap-3";

  return (
    <div ref={wrapperRef} className="relative inline-block w-full">
      {!open && (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full gap-3 border-none"
        >
          <Image src={More} alt="more-icon" width={25} height={25} />
          <span>More</span>
        </Button>
      )}

      <div
        className={`absolute bottom-0 left-0 z-20 max-w-3xs overflow-hidden rounded-[15px] border bg-white shadow-lg transition-all duration-500 ease-in-out origin-bottom ${
          open
            ? "pointer-events-auto max-h-xs opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between bg-primary px-5 py-2">
          <h2 className="text-2xl font-bold text-black">More</h2>
          <BackButton onClick={() => setOpen(false)} />
        </div>

        <div className="space-y-1 p-2 text-lg text-black flex flex-col">
          <Button
            type="button"
            onClick={() => router.push("/site/createShelter")}
            className={buttonStyle}
          >
            <Image src={More} alt="more-icon" width={25} height={25} />
            <span>Create Shelter</span>
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/site/about")}
            className={buttonStyle}
          >
            <Image src={More} alt="more-icon" width={25} height={25} />
            <span>About</span>
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/site/settings")}
            className={buttonStyle}
          >
            <Image src={More} alt="more-icon" width={25} height={25} />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
