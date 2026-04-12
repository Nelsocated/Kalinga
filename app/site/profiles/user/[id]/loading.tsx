"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <div className="flex-1 flex justify-center pl-20 py-5">
        <div className="w-full max-w-240 max-h-[94vh] rounded-[15px] border-4 bg-primary flex flex-col overflow-hidden shadow-lg">
          {/* HEADER */}
          <div className="flex items-center bg-primary px-5 shrink-0">
            <div className="w-full py-2">
              <div className="flex w-full items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center py-2">
                  {/* avatar */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-yellow-100/70">
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
                        style={{ animation: "shimmer 1.8s linear infinite" }}
                      />
                    </div>
                  </div>

                  {/* name + username */}
                  <div className="min-w-0 flex flex-col pl-2 leading-5">
                    <div className="h-7 w-40 rounded-lg bg-yellow-100/90 animate-pulse" />
                    <div className="mt-2 h-5 w-28 rounded-lg bg-yellow-100/80 animate-pulse" />
                  </div>
                </div>

                {/* edit button */}
                <div className="ml-10 h-11 w-11 shrink-0 rounded-full bg-yellow-100/80 animate-pulse" />
              </div>
            </div>
          </div>

          {/* BODY */}
          <main className="flex-1 bg-white overflow-hidden scroll-stable">
            <aside className="py-2 px-5">
              {/* Bio */}
              <section className="p-2">
                <div className="mb-2 h-5 w-16 rounded-md bg-yellow-200/80 animate-pulse" />
                <div className="flex flex-col gap-2 pr-4">
                  <div className="h-4 w-64 rounded-md bg-yellow-100/90 animate-pulse" />
                  <div className="h-4 w-52 rounded-md bg-yellow-100/80 animate-pulse" />
                </div>
              </section>

              {/* Contact */}
              <section className="p-2">
                <div className="mb-2 h-5 w-20 rounded-md bg-yellow-200/80 animate-pulse" />
                <div className="flex flex-col gap-2 pr-4">
                  <div className="h-4 w-56 rounded-md bg-yellow-100/90 animate-pulse" />
                </div>
              </section>

              {/* Tabs */}
              <div className="min-h-0 pr-7">
                <div className="flex min-h-0 flex-col rounded-[15px] bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-start gap-12 sm:gap-16">
                      <TabSkeleton />
                      <TabSkeleton />
                      <TabSkeleton />
                    </div>
                  </div>

                  <div className="px-4">
                    <hr className="border-black/10" />
                  </div>

                  <div className="mt-3 min-h-0 flex-1 px-4 pr-1">
                    <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <CardSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </main>
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

function TabSkeleton() {
  return (
    <div className="flex min-w-21 flex-col items-center gap-1 rounded-full px-3">
      <div className="h-15 w-15 rounded-full bg-yellow-100/85 animate-pulse" />
      <div className="h-4 w-14 rounded-md bg-yellow-200/80 animate-pulse" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="relative block w-50 overflow-visible rounded-[15px] border bg-primary shadow-sm">
      <div className="p-1">
        <div className="relative h-80 overflow-hidden rounded-[15px] bg-yellow-100/70">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
              style={{ animation: "shimmer 1.8s linear infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
