"use client";

import React from "react";
import Navbar from "@/components/layout/NavBar";

export default function UserProfileTemplate({
  main,
  side,
}: {
  main: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="pl-10">
        <Navbar />
      </div>

      <div className="flex-1 flex pl-20">
        <div className="w-full max-w-5xl rounded-xl bg-primary">
          <div className="p-5">{main}</div>

          <main className="w-full h-screen rounded-2xl bg-white border-4 border-primary overflow-hidden">
            {side ? <aside className="pl-5">{side}</aside> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
