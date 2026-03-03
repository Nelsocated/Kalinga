"use client";

import type { ReactNode } from "react";

export default function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-3">
      <div className="mb-3 text-lg font-bold">{title}</div>
      <div className="pr-10 text-justify">{children}</div>
    </section>
  );
}
