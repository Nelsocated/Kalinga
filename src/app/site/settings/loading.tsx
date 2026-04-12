"use client";

import WebTemplate from "@/src/components/template/WebTemplate";

function CircleSkeleton() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yellow-100/90">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
          style={{ animation: "shimmer 1.8s linear infinite" }}
        />
      </div>
    </div>
  );
}

function PillSkeleton({
  className = "",
  active = false,
}: {
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative h-10 overflow-hidden rounded-[15px] border border-black/20 ${
        active ? "bg-primary" : "bg-white"
      } ${className}`}
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

function LineSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-yellow-100/90 ${className}`}
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
        header={<div>Settings</div>}
        scrollable={false}
        main={
          <div className="min-h-0 overflow-y-auto scroll-stable">
            <div className="relative mb-5 flex justify-center gap-6 border-b py-5">
              <div className="flex items-center">
                <div className="absolute left-[calc(50%-230px)] z-10">
                  <CircleSkeleton />
                </div>
                <PillSkeleton active className="ml-7 w-55 border-l-0 pl-6" />
              </div>

              <div className="flex items-center">
                <div className="absolute left-[calc(50%+20px)] z-10">
                  <CircleSkeleton />
                </div>
                <PillSkeleton className="ml-7 w-55 border-l-0 pl-6" />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-4">
              <LineSkeleton className="h-10 w-56" />
              <LineSkeleton className="h-5 w-full" />
              <LineSkeleton className="h-5 w-11/12" />
              <LineSkeleton className="h-12 w-full rounded-[15px]" />
              <LineSkeleton className="h-12 w-full rounded-[15px]" />
              <LineSkeleton className="h-12 w-40 rounded-[15px]" />
            </div>
          </div>
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
