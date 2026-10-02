import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/src/components/ui/Button";

/** Top bar for the landing and content pages. */
export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-ground/90 backdrop-blur supports-[backdrop-filter]:bg-ground/75">
      <nav aria-label="Main" className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-full" aria-label="Kalinga home">
          <Image src="/kalinga_logo(ver2).svg" alt="" width={36} height={36} priority />
          <span className="text-lg font-bold text-sunshine">Kalinga</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/about" className="hidden rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-sunshine-wash sm:block">
            About
          </Link>
          <Link href="/login" className="rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-sunshine-wash">
            Log in
          </Link>
          <LinkButton href="/site/home" variant="primary" size="sm">
            Start watching
          </LinkButton>
        </div>
      </nav>
    </header>
  );
}
