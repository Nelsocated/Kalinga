"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";

type FosterCardProps = {
  href: string;
  title: string;
  description: string;
  /** The pet tile shown beside the story. */
  children: ReactNode;
};

/** A foster story: the pet on one side, the story excerpt on the other. */
export default function FosterCard({ href, title, description, children }: FosterCardProps) {
  return (
    <article className="relative flex flex-col gap-3 rounded-lg border border-line bg-card p-3 transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift sm:flex-row">
      <div className="w-full shrink-0 sm:w-40">{children}</div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
        <h3 className="line-clamp-2 text-xl font-semibold text-ink">{title}</h3>
        <p className="line-clamp-4 text-sm text-ink-soft">{description}</p>
        <Link
          href={href}
          className="mt-auto flex w-fit items-center gap-1 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          Read the story
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
