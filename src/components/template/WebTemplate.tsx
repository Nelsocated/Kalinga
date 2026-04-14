"use client";

import React from "react";
import BackButton from "../ui/BackButton";

type Props = {
  header?: React.ReactNode;
  main: React.ReactNode;
  side?: React.ReactNode; // 👈 NEW
  top?: React.ReactNode; // 👈 optional like pet template
  scrollable?: boolean;
};

export default function WebTemplate({
  header,
  main,
  side,
  top,
  scrollable = true,
}: Props) {
  const isPetLayout = !!side; // 👈 auto enable if side exists

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div className="flex-1 flex justify-center pl-20 py-5">
        <div className="w-full max-w-240 max-h-[94vh] rounded-[15px] border-4 border-secondary bg-white flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 bg-secondary px-5 py-3 shrink-0">
            <div className="text-header font-bold leading-none text-textwhite">
              {header}
            </div>
            <div className="mr-5 flex items-center">
              <BackButton isModal />
            </div>
          </div>

          {/* OPTIONAL TOP (for pet style) */}
          {top && (
            <div className="px-5 shrink-0">
              <div className="flex items-center gap-3">{top}</div>
            </div>
          )}

          {/* BODY */}
          <main className="flex-1 min-h-0 py-2">
            {isPetLayout ? (
              // 👇 PET STYLE GRID
              <div className="grid h-full min-h-0 gap-3 px-3 lg:grid-cols-[60svh_1fr]">
                {/* SIDE */}
                <div className="min-h-0 overflow-y-auto scroll-stable">
                  {side}
                </div>

                {/* MAIN */}
                <div
                  className={`min-h-0 ${
                    scrollable
                      ? "overflow-y-auto scroll-stable"
                      : "overflow-hidden"
                  }`}
                >
                  <div className="">{main}</div>
                </div>
              </div>
            ) : (
              // 👇 NORMAL LAYOUT (default)
              <div
                className={`h-full ${
                  scrollable
                    ? "overflow-y-auto scroll-stable"
                    : "overflow-hidden"
                }`}
              >
                <aside className="px-5 h-full">{main}</aside>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
