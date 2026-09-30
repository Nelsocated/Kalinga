"use client";

import WebTemplate from "@/src/components/template/WebTemplate";

import { CalendarBlank, House, PawPrint } from "@phosphor-icons/react";

export default function Loading() {
  const headerStyle =
    "text-title font-semibold flex items-center rounded-[15px] pl-7 border bg-white px-2 ml-6 border-l-0";

  return (
    <WebTemplate
      header="Notifications"
      main={
        <div className="flex-1 min-h-0 overflow-hidden scroll-stable py-5">
          {/* top labels */}
          <div className="mb-5 grid grid-cols-3 place-items-center gap-15">
            <div className="relative flex items-center">
              <span className="absolute">
                <House size={40} aria-hidden="true" />
              </span>
              <span className={headerStyle}>Shelter</span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute">
                <PawPrint size={40} aria-hidden="true" />
              </span>
              <span className={headerStyle}>Applications</span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute rounded-full bg-primary">
                <CalendarBlank size={40} aria-hidden="true" />
              </span>
              <span className={headerStyle}>Date</span>
            </div>
          </div>

          {/* notif skeleton rows */}
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NotifCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
      scrollable={false}
    />
  );
}

function NotifCardSkeleton() {
  return (
    <div className="relative grid w-full grid-cols-1 gap-3 border-y bg-white px-4 py-2 text-left md:grid-cols-[1.1fr_1.7fr_1fr] md:items-center">
      <div className="pointer-events-none absolute top-0 bottom-0 hidden w-px bg-primary md:block left-[calc(1.1/(1.1+1.7+1)*100%)]" />
      <div className="pointer-events-none absolute top-0 bottom-0 hidden w-px bg-primary md:block left-[calc((1.1+1.7)/(1.1+1.7+1)*100%)]" />

      <div className="flex justify-center">
        <div className="h-7 w-32 rounded-md bg-yellow-100/90 animate-pulse" />
      </div>

      <div className="md:px-6">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-full rounded-md bg-yellow-100/90 animate-pulse" />
          <div className="h-6 w-3/4 rounded-md bg-yellow-100/80 animate-pulse" />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="h-7 w-24 rounded-md bg-yellow-100/90 animate-pulse" />
      </div>
    </div>
  );
}
