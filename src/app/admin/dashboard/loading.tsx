"use client";

import WebTemplate from "@/src/components/template/WebTemplate";

function Shimmer({
  className = "",
  rounded = "rounded-md",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-yellow-100/90 ${rounded} ${className}`}
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

function CardSkeleton() {
  return (
    <div className="rounded-[15px] border p-4 space-y-3 bg-white">
      <Shimmer className="h-full w-30" />
      <div className="flex justify-between">
        <Shimmer className="h-10 w-20" />
        <Shimmer className="h-8 w-15" />
      </div>

      <Shimmer
        className="h-8 w-full border border-black/10"
        rounded="rounded-[15px]"
      />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <WebTemplate
        header={<div>Shelter Application</div>}
        main={
          <>
            {/* TOP BAR */}
            <div className="flex flex-col gap-3 border-b border-primary/20 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black md:text-base">
                  Number of Shelter Applications:
                </span>
                <Shimmer
                  className="h-7 w-10 border border-primary/40"
                  rounded="rounded-[15px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-black md:text-base">
                  Filter:
                </div>
                <Shimmer
                  className="h-10 w-40 border border-black/10"
                  rounded="rounded-[10px]"
                />
              </div>
            </div>

            {/* LIST */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        }
      />

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
    </>
  );
}
