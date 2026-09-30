import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";

/** A titled block on a profile page. */
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
    <section className="flex flex-col gap-3 pt-6">
      {title ? <h3 className="text-lg font-semibold text-ink">{title}</h3> : null}
      <div className={cn("flex flex-col gap-2 text-ink-soft", className)}>{children}</div>
    </section>
  );
}
