"use client";
import React from "react";

export default function PetProfileTemplate({
  main,
  side,
  top,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
  top?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-6 py-5">
      <div className="mx-auto w-full max-w-260">
        <div className="rounded-[15px] bg-primary ml-20 p-10">
          <div className="flex h-[82vh] min-h-0 w-full flex-col overflow-hidden rounded-[15px] bg-white">
            <div className="shrink-0 px-5 py-2">
              <div className="flex items-center justify-between">{top}</div>
            </div>

            <div className="grid flex-1 min-h-0 gap-3 px-3 pb-3 lg:grid-cols-[60svh_1fr]">
              <div className="min-h-0 overflow-y-auto">{side}</div>

              <div className="min-h-0 overflow-y-auto scroll-stable">
                {main}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
