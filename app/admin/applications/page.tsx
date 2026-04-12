// app/admin/applications/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MOCK_APPLICATIONS = [
  { id: "1", name: "Shelter Name", time: "4 hrs ago" },
  { id: "2", name: "Shelter Name", time: "4 hrs ago" },
  { id: "3", name: "Shelter Name", time: "4 hrs ago" },
  { id: "4", name: "Shelter Name", time: "4 hrs ago" },
  { id: "5", name: "Shelter Name", time: "4 hrs ago" },
];

export default function ShelterApplicationsPage() {
  const router = useRouter();
  const [count] = useState(MOCK_APPLICATIONS.length);

  return (
    <div className="min-h-svh bg-background px-10 pt-10 pb-10">
      <div className="mx-auto max-w-4xl">
        <div className="w-full bg-primary rounded-2xl overflow-hidden shadow-lg">

          {/* Yellow Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-primary">
            <h1 className="text-3xl font-black text-black">Shelter Applications</h1>
            <button
              onClick={() => router.back()}
              className="text-black text-2xl font-bold hover:opacity-70 transition-opacity"
            >
              ‹
            </button>
          </div>

          {/* White sub-header — Number + Filter */}
          <div className="flex items-center justify-between px-6 py-3 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-black font-semibold text-sm">
                Number of Shelter Applications
              </span>
              <div className="border border-black rounded-md px-3 py-1 text-black font-bold text-sm min-w-[40px] text-center">
                {count}
              </div>
            </div>
            <button className="w-9 h-9 border border-black rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>

          {/* Applications List */}
          <div className="bg-background px-6 pt-4 pb-6 space-y-4">
            {MOCK_APPLICATIONS.map((app) => (
              <div key={app.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-black text-xl">{app.name}</span>
                    <span className="text-xs text-gray-500">{app.time}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/applications/${app.id}`)}
                      className="w-full border border-primary rounded-lg py-1.5 text-sm font-medium text-black hover:bg-primary/10 transition-colors"
                      >
                          Review Application
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}