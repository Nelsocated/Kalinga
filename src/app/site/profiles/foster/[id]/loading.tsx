"use client";
import WebTemplate from "@/src/components/template/WebTemplate";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[15px] bg-yellow-100/80 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
          style={{ animation: "shimmer 1.8s linear infinite" }}
        />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <WebTemplate
        header={<div>Foster Story</div>}
        side={
          <div className="p-5">
            {/* Main photo */}
            <Skeleton className="h-60 w-full" />

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Skeleton className="aspect-3/4 w-full rounded-xl" />
              <Skeleton className="aspect-3/4 w-full rounded-xl" />
              <Skeleton className="aspect-3/4 w-full rounded-xl" />
            </div>

            {/* Adopt button */}
            <div className="mt-4 flex justify-center">
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>
        }
        main={
          <div className="py-5 pr-5">
            {/* Header */}
            <div className="flex w-full items-center gap-1">
              <Skeleton className="h-9 w-35 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="mt-4 gap-1 flex-1 flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="flex flex-col">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>

            {/* Information */}
            <section className="mt-6 space-y-1">
              <Skeleton className="mb-3 h-8 w-full rounded-md" />
              <Skeleton className="mb-3 h-8 w-full rounded-md" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </section>
          </div>
        }
      />
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-160%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </>
  );
}
