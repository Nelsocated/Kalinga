"use client";

import React from "react";

export default function ProfileTemplate({
  main,
  side,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex pl-20">
        <div className="w-full max-w-5xl rounded-[15px] bg-primary">
          <div className="p-3 pl-5">{main}</div>

          <main className="w-full h-screen rounded-[15px] bg-white border-2 overflow-hidden">
            {side ? <aside className="pl-5">{side}</aside> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
