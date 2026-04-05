"use client";

import type { ReactNode } from "react";

export default function RightSlot({ children }: { children: ReactNode }) {
  return <section className="flex flex-col">{children}</section>;
}
