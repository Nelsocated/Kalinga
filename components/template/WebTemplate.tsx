"use client";

import React from "react";
import BackButton from "../ui/BackButton";

export default function WebTemplate({
  header,
  main,
  scrollable = true,
}: {
  header?: React.ReactNode;
  main: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div className="flex-1 flex justify-center pl-20 py-5">
        <div className="w-full max-w-240 max-h-[94vh] rounded-[15px] border-4 bg-primary flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center bg-primary px-5 shrink-0">
            <h1 className="text-header font-bold text-black">{header}</h1>
            <BackButton />
          </div>

          {/* BODY */}
          <main
            className={`flex-1 bg-white ${
              scrollable ? "overflow-y-auto scroll-stable" : "overflow-hidden"
            }`}
          >
            {main ? <aside className="py-2 px-5 h-full">{main}</aside> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
