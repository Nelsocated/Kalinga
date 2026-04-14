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
    <section className="py-2">
      {title && (
        <div className="text-subtitle text-secondary font-bold wrap-break-words">
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
