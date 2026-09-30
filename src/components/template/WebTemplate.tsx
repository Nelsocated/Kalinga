"use client";

import BackButton from "../ui/BackButton";
import { cn } from "@/src/lib/cn";

type Props = {
  /** A page title string, or a richer header node (profile headers). */
  header?: React.ReactNode;
  main: React.ReactNode;
  side?: React.ReactNode;
  top?: React.ReactNode;
  /** Rendered to the right of the title. */
  actions?: React.ReactNode;
  scrollable?: boolean;
};

/** Page shell: title row on the ground, then content; optional side column on lg. */
export default function WebTemplate({
  header,
  main,
  side,
  top,
  actions,
  scrollable = true,
}: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:py-8">
      <header className="flex items-center gap-3">
        <BackButton />
        {typeof header === "string" ? (
          <h1 className="min-w-0 flex-1 truncate text-headline text-ink">{header}</h1>
        ) : (
          <div className="min-w-0 flex-1">{header}</div>
        )}
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>

      {top ? <div className="flex flex-wrap items-center gap-3">{top}</div> : null}

      {side ? (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <section className="min-w-0">{side}</section>
          <section className={cn("min-w-0", !scrollable && "overflow-hidden")}>{main}</section>
        </div>
      ) : (
        <section className={cn("min-h-0 min-w-0 flex-1", !scrollable && "overflow-hidden")}>
          {main}
        </section>
      )}
    </div>
  );
}
