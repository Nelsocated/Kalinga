"use client";
export default function Loading() {
  return (
    <div className="flex h-svh bg-background px-10 overflow-hidden">
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Fake Feed */}
            <div className="relative h-[85svh] w-[48svh] overflow-hidden rounded-[28px] border-2 bg-yellow-100/60 shadow-lg">
              {/* moving yellow shimmer */}
              <div className="absolute inset-0">
                <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-[shimmer_1.8s_linear_infinite] bg-linear-to-r from-transparent via-yellow-300/40 to-transparent" />
              </div>

              {/* video/content structure */}
              <div className="relative flex h-full flex-col justify-end p-5">
                <div className="space-y-3">
                  <div className="h-4 w-40 rounded-full bg-yellow-300/70 animate-pulse" />
                  <div className="h-4 w-64 rounded-full bg-yellow-200/90 animate-pulse" />
                  <div className="h-4 w-52 rounded-full bg-yellow-200/80 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Fake RightBar - no shelter side stuff */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="h-17 w-17 rounded-full border bg-yellow-200/80 animate-pulse" />
              <div className="h-15 w-15 rounded-full bg-yellow-300/70 animate-pulse" />
              <div className="h-13 w-13 rounded-full bg-yellow-300/70 animate-pulse" />
            </div>
          </div>

          {/* Fake ScrollBar */}
          <div className="absolute right-10">
            <div className="flex h-svh flex-col items-center justify-between py-6">
              <div className="h-0" />

              <div className="flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-yellow-200/80 animate-pulse" />
                <div className="h-20 w-20 rounded-full bg-yellow-300/80 animate-pulse" />
              </div>

              <div className="h-0" />
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
