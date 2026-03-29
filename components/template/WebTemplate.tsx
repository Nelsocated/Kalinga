"use client";

import React from "react";

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
        <div className="w-full max-w-240 max-h-[94vh] rounded-[15px] bg-primary flex flex-col">
          {/* Top section */}
          <div className="p-2 pl-5 shrink-0">{header}</div>

          {/* Scrollable section */}
          <main
            className={`flex-1 rounded-[15px] bg-white border-2 pb-3 overflow-y-auto scroll-stable`}
          >
            {main ? <aside className="pl-5">{main}</aside> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
