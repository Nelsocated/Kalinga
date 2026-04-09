"use client";

import WebTemplate from "@/components/template/WebTemplate";

export default function Loading() {
  return (
    <>
      <WebTemplate
        header={<div>Dashboard</div>}
        main={
          <main className="flex h-full min-h-0 flex-col">
            {/* HEADER STATS */}
            <section className="border-b-2 bg-white px-2 py-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatSkeleton label="Views" />
                <StatSkeleton label="Likes" />
                <StatSkeleton label="Adoption Completed" />
              </div>
            </section>

            {/* CONTENT */}
            <section className="flex min-h-0 flex-1 flex-col px-4 py-3">
              <h2 className="mb-3 text-3xl font-extrabold text-black">
                Content
              </h2>

              <div className="flex h-full min-h-0 flex-col rounded-[15px] border-2">
                {/* HEADER */}
                <div className="px-4 py-2">
                  <div className="grid w-full grid-cols-[1fr_45px_120px_120px] items-center gap-6">
                    <div className="h-8 w-24 rounded-md bg-yellow-100/90 animate-pulse" />
                    <div />
                    <div className="text-center text-subtitle font-medium text-black">
                      Views
                    </div>
                    <div className="text-center text-subtitle font-medium text-black">
                      Likes
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="min-h-0 flex-1 px-3 py-1">
                  <div className="space-y-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ContentRowSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
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

function StatSkeleton({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-[15px] bg-primary px-4 py-4.5">
      {/* Icon placeholder */}
      <div className="h-10 w-20 rounded-md bg-yellow-100/80 animate-pulse" />

      {/* Text */}
      <div className="flex flex-col items-center justify-center">
        {/* NUMBER ONLY is loading */}
        <div className="h-6 w-16 rounded-md bg-yellow-100/90 animate-pulse" />

        {/* LABEL stays visible */}
        <div className="text-description font-medium text-black">{label}</div>
      </div>
    </div>
  );
}

function ContentRowSkeleton() {
  return (
    <div className="grid grid-cols-[56px_1fr] items-center gap-3 rounded-[15px] bg-white px-3 py-1 sm:grid-cols-[50px_1fr_120px_120px]">
      {/* IMAGE */}
      <div className="relative h-14 w-16 overflow-hidden rounded-md bg-yellow-100/70">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
            style={{ animation: "shimmer 1.8s linear infinite" }}
          />
        </div>
      </div>

      {/* TEXT */}
      <div className="min-w-0 ml-2">
        <div className="h-5 w-48 rounded-md bg-yellow-100/90 animate-pulse" />
        <div className="mt-2 h-4 w-32 rounded-md bg-yellow-100/80 animate-pulse" />
      </div>

      {/* VIEWS */}
      <div className="flex justify-center">
        <div className="h-5 w-16 rounded-md bg-yellow-100/90 animate-pulse" />
      </div>

      {/* LIKES */}
      <div className="flex justify-center">
        <div className="h-5 w-16 rounded-md bg-yellow-100/90 animate-pulse" />
      </div>
    </div>
  );
}
