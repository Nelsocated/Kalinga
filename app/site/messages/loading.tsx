"use client";

import WebTemplate from "@/components/template/WebTemplate";

export default function Loading() {
  return (
    <>
      <WebTemplate
        header={<div>Messages</div>}
        scrollable={false}
        main={
          <div className="grid h-full min-h-0 grid-cols-[320px_1fr] overflow-hidden">
            {/* LEFT */}
            <div className="flex min-h-0 flex-col border-r bg-white">
              <div className="border-b px-5 py-3">
                <div className="flex gap-3">
                  <div className="h-10 w-24 rounded-full bg-yellow-100/90 animate-pulse" />
                  <div className="h-10 w-24 rounded-full bg-yellow-100/70 animate-pulse" />
                </div>
              </div>

              <ListSkeleton />
            </div>

            {/* RIGHT */}
            <ViewSkeleton />
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

type Props = {
  header?: boolean;
};

export function ListSkeleton({ header }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {header ? (
        <div className="w-full border-b-2 px-5 text-center">
          <div className="mx-auto my-1 h-7 w-48 rounded-md bg-yellow-100/90 animate-pulse" />
        </div>
      ) : (
        ""
      )}

      <div className="min-h-0 flex-1 overflow-hidden scroll-stable">
        <div className="space-y-2 p-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded-[15px] border px-4 py-2 bg-white"
            >
              <div className="flex items-start gap-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-yellow-100/70">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
                      style={{ animation: "shimmer 1.8s linear infinite" }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="h-5 w-28 rounded-md bg-yellow-100/90 animate-pulse" />
                      <div className="mt-2 h-4 w-36 rounded-md bg-yellow-100/70 animate-pulse" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="h-5 w-8 rounded-full bg-yellow-100/90 animate-pulse" />
                      <div className="h-4 w-12 rounded-md bg-yellow-100/70 animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="h-4 w-full rounded-md bg-yellow-100/80 animate-pulse" />
                    <div className="h-4 w-3/4 rounded-md bg-yellow-100/70 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ViewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col border-l bg-white">
      {/* Header */}
      <div className="shrink-0 border-b px-6 py-2">
        <div className="h-7 w-52 rounded-md bg-yellow-100/90 animate-pulse" />
        <div className="mt-2 h-4 w-40 rounded-md bg-yellow-100/70 animate-pulse" />
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <article key={i} className="border-b px-6 py-3">
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-yellow-100/70">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-yellow-300/50 to-transparent"
                      style={{ animation: "shimmer 1.8s linear infinite" }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-28 rounded-md bg-yellow-100/90 animate-pulse" />
                  <div className="mt-2 h-4 w-36 rounded-md bg-yellow-100/70 animate-pulse" />

                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-full rounded-md bg-yellow-100/80 animate-pulse" />
                    <div className="h-4 w-11/12 rounded-md bg-yellow-100/80 animate-pulse" />
                    <div className="h-4 w-2/3 rounded-md bg-yellow-100/70 animate-pulse" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reply */}
      <div className="shrink-0 border-t bg-white px-5 py-2">
        <div className="h-11 w-24 rounded-[15px] bg-yellow-100/90 animate-pulse" />
      </div>
    </div>
  );
}
