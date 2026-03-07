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
      <div className="text-lg font-bold">{title}</div>
      <div className="pr-10">{children}</div>
    </section>
  );
}
