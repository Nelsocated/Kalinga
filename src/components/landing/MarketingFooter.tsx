import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/src/lib/constants/site";
import FooterActions from "./FooterActions";

const GROUPS = [
  {
    title: "Adopt",
    links: [
      { href: "/site/home", label: "For You" },
      { href: "/site/explore", label: "Explore" },
      { href: "/site/shelters", label: "Shelters" },
    ],
  },
  {
    title: "For shelters",
    links: [
      { href: "/shelterSignup", label: "Apply as a shelter" },
      { href: "/help#shelters", label: "Help for shelters" },
    ],
  },
  {
    title: "Kalinga",
    links: [
      { href: "/about", label: "About" },
      { href: "/help", label: "Help" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

/** The marketing pages' footer: who we are, where to go next, how to reach us. */
export default function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-sunshine-wash">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <FooterActions />

        <div className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="flex min-h-11 w-fit items-center gap-2.5 rounded-full" aria-label="Kalinga home">
              <Image src="/kalinga_logo(ver2).svg" alt="" width={40} height={40} />
              <span className="text-2xl font-bold text-sunshine">Kalinga</span>
            </Link>
            <p className="font-semibold text-ink">Give Care. Give Love. A Home for Every Paw</p>
            <p className="text-ink-soft">Short videos of shelter pets, so every one of them gets seen.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kalinga</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 w-fit items-center [overflow-wrap:anywhere] underline-offset-4 hover:text-ink hover:underline">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
