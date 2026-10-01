import Image from "next/image";
import Link from "next/link";

// Help, Terms and Privacy join this list as those pages ship
const LINKS = [
  { href: "/about", label: "About" },
  { href: "/site/explore", label: "Explore pets" },
  { href: "/shelterSignup", label: "Apply as a shelter" },
  { href: "/login", label: "Log in" },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Image src="/kalinga_logo(ver2).svg" alt="" width={32} height={32} />
          <p className="text-sm text-ink-soft">Give Care. Give Love. A Home for Every Paw</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium text-ink underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
