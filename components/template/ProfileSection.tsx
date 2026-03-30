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
    <section className="p-2">
      {title && (
        <div className="text-lg font-bold leading-5 wrap-break-words">
          {title}
        </div>
      )}

      <div className="pt-1 pr-4 whitespace-pre-line leading-5 wrap-break-words *:m-0">
        {children}
      </div>
    </section>
  );
}
