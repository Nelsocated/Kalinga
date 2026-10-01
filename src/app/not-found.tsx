import Image from "next/image";
import { LinkButton } from "@/src/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-6 px-6 py-16 sm:mx-auto sm:max-w-xl">
      <Image src="/kalinga_logo(ver2).svg" alt="" width={64} height={64} priority />
      <h1 className="text-display text-ink">This page wandered off</h1>
      <p className="text-ink-soft">The link may be old, or the page has moved. The pets are still where you left them.</p>
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/site/home" variant="primary" size="lg">
          Go to the feed
        </LinkButton>
        <LinkButton href="/" variant="ghost" size="lg">
          Back to home
        </LinkButton>
      </div>
    </main>
  );
}
