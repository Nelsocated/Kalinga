"use client";
import React from "react";

export default function PetProfileTemplate({
  main,
  side,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex pl-20">
        <div className="max-w-5xl rounded-[15px] bg-primary">
          <main className="p-10">
            <div className="h-[88svh] w-full rounded-[15px] bg-background overflow-hidden">
              <div className="grid h-full gap-3 lg:grid-cols-[60svh_1fr]">
                <div>{side}</div>
                <div>{main}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
