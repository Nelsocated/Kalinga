import Image from "next/image";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/ui/Button";
import { Reveal } from "./Reveal";

/** Close on the one action that matters. */
export default function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-24 sm:px-6 md:pb-32">
      <Reveal className="flex flex-col items-start gap-6">
        <Image data-reveal src="/kalinga_logo(ver2).svg" alt="" width={56} height={56} />
        <h2 id="final-title" data-reveal className="max-w-[18ch] text-display text-ink">
          Your next best friend might be one video away.
        </h2>
        <div data-reveal>
          <LinkButton href="/site/home" variant="primary" size="lg" icon={<Play weight="fill" aria-hidden="true" />}>
            Start watching
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}
