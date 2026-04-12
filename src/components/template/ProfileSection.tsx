"use client";

import type { ReactNode } from "react";

export default function ProfileSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="p-2">
      {title && (
        <div className="text-lg font-bold leading-5 wrap-break-words mb-2">
          {title}
        </div>
      )}

      <div
        className={`pr-4 whitespace-pre-line leading-5 wrap-break-words flex flex-col *:m-0 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
