"use client";

import React from "react";
import BackButton from "../ui/BackButton";

export default function WebTemplate({
  header,
  main,
}: {
  header?: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div className="flex-1 flex justify-center pl-20 py-5">
        {/* Card container */}
        <div className="w-full max-w-240 max-h-[94vh] rounded-[15px] border-4 bg-primary flex flex-col overflow-hidden">
          {/* HEADER (inside same border) */}
          <div className="flex items-center bg-primary px-5 shrink-0">
            <h1 className="text-header font-bold text-black">{header}</h1>
            <BackButton />
          </div>

          {/* BODY */}
          <main className="flex-1 bg-white overflow-y-auto scroll-stable">
            {main ? <aside className="py-2 px-5">{main}</aside> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
