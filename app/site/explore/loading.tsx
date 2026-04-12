"use client";

import WebTemplate from "@/components/template/WebTemplate";

export default function Loading() {
  return (
    <WebTemplate
      header={<div>Explore</div>}
      main={
        <div className="ml-6 flex flex-col gap-7">
          {/* Longest Residents */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-subheader font-semibold">
                Our Longest Residents
              </h2>
              <div className="h-9 w-9 rounded-full bg-yellow-100/80 animate-pulse" />
            </div>

            <div className="grid grid-cols-4 gap-4 pt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <PetCardSkeleton key={`longest-${i}`} hasTopLabel />
              ))}
            </div>
          </section>

          {/* Foster Story */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-subheader font-semibold">
                Foster&apos;s Story
              </h2>
              <div className="h-9 w-9 rounded-full bg-yellow-100/80 animate-pulse" />
            </div>

            <div className="grid grid-cols-4 gap-4 pt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <PetCardSkeleton key={`foster-${i}`} hasTopLabel />
              ))}
            </div>
          </section>
        </div>
      }
      scrollable={false}
    />
  );
}

function PetCardSkeleton({ hasTopLabel = false }: { hasTopLabel?: boolean }) {
  return (
    <div className="relative block w-50 overflow-visible rounded-[15px] border bg-primary shadow-sm">
      {hasTopLabel && (
        <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-yellow-100/90 animate-pulse" />
      )}

      <div className="p-1">
        <div className="relative h-45 overflow-hidden rounded-[15px] bg-yellow-100/70">
          <div className="absolute inset-0">
            <div
              className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
              style={{ animation: "shimmer 1.8s linear infinite" }}
            />
          </div>
        </div>
      </div>

      <div className="ml-1 p-2 pt-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-5 w-24 rounded-md bg-yellow-100/90 animate-pulse" />
          <div className="h-4 w-4 rounded-full bg-yellow-100/80 animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4.5 w-4.5 rounded-full bg-yellow-100/90 animate-pulse" />
          <div className="h-3 w-24 rounded-md bg-yellow-100/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
