import { LinkButton } from "@/src/components/ui/Button";
import { Reveal } from "./Reveal";

const POINTS = [
  "Post pet profiles, short videos and foster stories.",
  "Answer messages and work through adoption applications in one inbox.",
  "See how many people watch and like your posts.",
];

/** The shelter pitch on the brand's own yellow. */
export default function ForShelters() {
  return (
    <section aria-labelledby="shelters-title" className="px-4 py-20 sm:px-6 md:py-28">
      <Reveal className="mx-auto grid w-full max-w-6xl gap-10 rounded-xl bg-sunshine p-8 sm:p-12 md:grid-cols-2 md:gap-16 md:p-16">
        <div data-reveal className="flex flex-col gap-5">
          <h2 id="shelters-title" className="max-w-[16ch] text-headline text-ink">
            Run a shelter? Let more people meet your pets.
          </h2>
          <p className="max-w-[44ch] text-ink">
            Apply with your registration documents. Once a Kalinga admin approves your shelter, your pets can appear in the feed.
          </p>
          <LinkButton href="/shelterSignup" variant="secondary" size="lg" className="w-fit border-ink/15">
            Apply as a shelter
          </LinkButton>
        </div>
        <ul className="flex flex-col justify-center gap-4">
          {POINTS.map((point) => (
            <li key={point} data-reveal className="rounded-lg bg-card/70 px-5 py-4 font-medium text-ink">
              {point}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
