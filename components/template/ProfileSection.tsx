"use client";

import type { ReactNode } from "react";

export default function ProfileSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-3 p-2">
      <div className="line-clamp-2 wrap-break-words text-lg font-bold">
        {title}
      </div>

      <div className="line-clamp-6 wrap-break-words overflow-hidden pt-2 pr-10 whitespace-pre-line break-all text-justify">
        {children}
      </div>
    </section>
  );
}
