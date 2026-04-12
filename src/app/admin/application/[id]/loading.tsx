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

function FieldSkeleton({ labelWidth = "w-24" }: { labelWidth?: string }) {
  return (
    <div>
      <Shimmer className={`mb-2 h-5 ${labelWidth}`} />
      <Shimmer
        className="h-10 w-full border border-black/10"
        rounded="rounded-[10px]"
      />
    </div>
  );
}

function DocumentSkeleton() {
  return (
    <div>
      <Shimmer className="mb-2 h-5 w-52" />
      <Shimmer
        className="h-10 w-full border border-black/10"
        rounded="rounded-[15px]"
      />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <WebTemplate
        header={<div>Shelter Verification</div>}
        main={
          <div className="space-y-4">
            <section className="space-y-3 py-2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Shimmer className="h-7 w-40" />
                <Shimmer
                  className="h-9 w-32 border border-black/10"
                  rounded="rounded-[15px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldSkeleton labelWidth="w-16" />
                <FieldSkeleton labelWidth="w-20" />
                <FieldSkeleton labelWidth="w-28" />
                <FieldSkeleton labelWidth="w-24" />
                <FieldSkeleton labelWidth="w-20" />
                <FieldSkeleton labelWidth="w-16" />
              </div>

              <Shimmer className="mt-4 h-7 w-32" />

              <div className="space-y-4">
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
              </div>
            </section>

            <div className="space-y-3 py-3">
              <Shimmer
                className="h-10 w-full border border-green-300"
                rounded="rounded-[15px]"
              />
              <Shimmer
                className="h-10 w-full border border-red-300"
                rounded="rounded-[15px]"
              />
            </div>

            <Shimmer
              className="h-12 w-full border border-black/10"
              rounded="rounded-[15px]"
            />
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
