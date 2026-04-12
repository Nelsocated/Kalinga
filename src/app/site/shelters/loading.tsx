"use client";

import WebTemplate from "@/src/components/template/WebTemplate";

export default function Loading() {
  return (
    <WebTemplate
      header={<div>Shelters</div>}
      main={
        <main className="pt-2">
          <div className="m-4 flex flex-col gap-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShelterCardSkeleton key={i} />
            ))}
          </div>
        </main>
      }
      scrollable={false}
    />
  );
}

function ShelterCardSkeleton() {
  return (
    <div className="block w-full rounded-[15px] bg-background p-3 shadow-sm">
      <div className="flex items-center gap-5">
        {/* image */}
        <div className="relative h-25 w-30 shrink-0 overflow-hidden rounded-md bg-yellow-100/70">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
              style={{ animation: "shimmer 1.8s linear infinite" }}
            />
          </div>
        </div>

        {/* name + location */}
        <div className="px-2 p-2 pt-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-12 w-30 rounded-[15px] bg-yellow-100/90 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded-[15px] bg-yellow-100/80 animate-pulse" />
          </div>
        </div>

        <div className="px-2 ml-3 gap-5 flex flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-50 rounded-[15px] bg-yellow-100/90 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-50 rounded-[15px] bg-yellow-100/90 animate-pulse" />
          </div>
        </div>

        {/* like */}
        <div className="pr-5 flex items-center">
          <div className="h-12 w-12 rounded-full bg-yellow-100/90 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-160%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </div>
  );
}
