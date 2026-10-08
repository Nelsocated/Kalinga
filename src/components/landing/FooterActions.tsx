"use client";

import { usePathname } from "next/navigation";
import { Play } from "@phosphor-icons/react";
import { LinkButton } from "@/src/components/ui/Button";

/** The closing ask on About, Help, Terms and Privacy; the landing page already ends on one. */
export default function FooterActions() {
  if (usePathname() === "/") return null;

  return (
    <div className="flex flex-col gap-6 border-b border-line py-12 md:flex-row md:items-center md:justify-between md:py-16">
      <p className="max-w-[22ch] text-headline text-ink">Find the pet that&apos;s waiting for you.</p>
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/site/home" variant="primary" size="lg" icon={<Play weight="fill" aria-hidden="true" />}>
          Start watching
        </LinkButton>
        <LinkButton href="/shelterSignup" variant="secondary" size="lg">
          Apply as a shelter
        </LinkButton>
      </div>
    </div>
  );
}
