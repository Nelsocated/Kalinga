"use client";

import WebTemplate from "@/src/components/template/WebTemplate";

function PillSkeleton({
  className = "",
  tone = "bg-yellow-100/90",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <div
      className={`relative h-9.5 overflow-hidden rounded-[15px] border border-yellow-500/80 ${tone} ${className}`}
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
        scrollable={false}
        header={<div>Notification</div>}
        main={
          <main>
            <div className="border-b-2 pb-4">
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="text-lg font-semibold text-black">
                  Select Species:
                </span>

                <div className="flex gap-3">
                  <PillSkeleton className="w-24 py-6" tone="bg-yellow-200/90" />
                  <PillSkeleton className="w-24 p" tone="bg-white/70" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-5 py-5">
              <h2 className="mb-6 pt-5 text-center text-subheader font-bold text-black">
                Select Status to review:
              </h2>

              <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                <PillSkeleton className="w-42 bg-white/80" />
                <PillSkeleton className="w-42 bg-white/80" />
                <PillSkeleton className="w-42 bg-white/80" />

                <PillSkeleton className="w-42 bg-white/80" />
                <PillSkeleton className="w-42 bg-white/80" />
                <PillSkeleton className="w-42 bg-white/80" />

                <PillSkeleton className="w-42 bg-white/80" />
              </div>

              <PillSkeleton className="mt-10 w-30 bg-white/80" />
            </div>
          </main>
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
