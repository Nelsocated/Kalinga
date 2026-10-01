import Image from "next/image";
import Link from "next/link";

const TAGLINE = "Give Care. Give Love. A Home for Every Paw";

/**
 * Split screen from lg: a sunshine brand field on the left, the form on the right.
 * Below lg the logo and tagline stack above the form on the ground color.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-sunshine p-12 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <Link href="/" className="flex w-fit items-center gap-3 rounded-full bg-ground py-2 pr-5 pl-2">
          <Image src="/kalinga_logo(ver2).svg" alt="" width={48} height={48} priority />
          <span className="text-xl font-bold text-sunshine">Kalinga</span>
        </Link>
        <p className="max-w-[14ch] text-display text-ink">{TAGLINE}</p>
        <Link href="/about" className="w-fit text-sm font-medium text-ink underline-offset-4 hover:underline">
          About Kalinga
        </Link>
      </aside>

      <main className="flex flex-col items-center gap-8 px-4 py-10 sm:px-6 lg:justify-center lg:py-12">
        <div className="flex flex-col items-center gap-3 text-center lg:hidden">
          <Link href="/" aria-label="Kalinga home" className="rounded-full">
            <Image src="/kalinga_logo(ver2).svg" alt="" width={64} height={64} priority />
          </Link>
          <p className="max-w-[22ch] text-headline text-ink">{TAGLINE}</p>
        </div>
        {children}
        <Link href="/about" className="text-sm font-medium text-ink-soft underline-offset-4 hover:underline lg:hidden">
          About Kalinga
        </Link>
      </main>
    </div>
  );
}
