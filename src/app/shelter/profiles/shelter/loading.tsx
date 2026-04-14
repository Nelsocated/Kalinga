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
        header={
          <div className="flex items-center justify-between w-full px-2 py-1 gap-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-18 w-18 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>

            <div className="flex gap-1">
              <Skeleton className="h-8 w-45 ml-10 rounded-full" />
              <Skeleton className="h-8 w-45 ml-10 rounded-full" />
            </div>
          </div>
        }
        main={
          <div className="p-5">
            {/* Bio */}
            <div className="mb-5">
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Contact */}
            <div className="mb-5">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="py-2">
              <hr className="bg-primary" />
            </div>

            <div className="grid grid-cols-4 py-">
              <Skeleton className="w-48 h-77 rounded-[15px] border-2 border-secondary" />
              <Skeleton className="w-48 h-77 rounded-[15px] border-2 border-secondary" />
              <Skeleton className="w-48 h-77 rounded-[15px] border-2 border-secondary" />
              <Skeleton className="w-48 h-77 rounded-[15px] border-2 border-secondary" />
            </div>
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
