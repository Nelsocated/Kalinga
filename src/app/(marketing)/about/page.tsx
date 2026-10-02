import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/landing/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Why Kalinga exists, our mission and vision, and the team behind it.",
};

const STATEMENTS = [
  {
    title: "Our mission",
    text: "To connect people with pets in need by making adoption simple and accessible while empowering shelters to reach more adopters.",
  },
  {
    title: "Our vision",
    text: "To maximize visibility for every shelter and pet, making it easier for people everywhere to discover and adopt.",
  },
];

const TEAM = [
  { given: "Chrisciel Joy A.", family: "Catedrilla" },
  { given: "Nelson A.", family: "Lago III" },
  { given: "Elijah Arian G.", family: "Mardoquio" },
  { given: "Niño Kriebel C.", family: "Olmo" },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro: the tagline beside the logo on a sunshine-wash tile; stacks on phones */}
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:pb-24 md:pt-16">
        <div className="flex flex-col items-start gap-6">
          <h1 className="max-w-[14ch] text-display text-ink">Give Care. Give Love. A Home for Every Paw</h1>
          <p className="max-w-[48ch] text-lg leading-relaxed text-ink-soft">
            Kalinga is a short-video feed of dogs and cats waiting in shelters. You watch, you fall for one, and you can
            apply to adopt right from its profile.
          </p>
        </div>
        <div className="flex aspect-square w-full max-w-56 items-center justify-center justify-self-center rounded-xl border border-line bg-sunshine-wash md:max-w-none">
          <Image src="/kalinga_logo.svg" alt="Kalinga paw logo" width={280} height={280} priority className="w-1/2" />
        </div>
      </section>

      {/* Mission and vision: heading left, statement right; one column on phones */}
      <section aria-label="Mission and vision" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Reveal className="divide-y divide-line border-y border-line">
          {STATEMENTS.map((item) => (
            <div
              key={item.title}
              data-reveal
              className="grid gap-3 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-14"
            >
              <h2 className="text-headline text-ink">{item.title}</h2>
              <p className="max-w-[40ch] text-2xl font-medium leading-snug text-ink md:text-3xl">{item.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* The problem it solves, on the brand's full yellow field */}
      <section aria-labelledby="why-title" className="mt-20 bg-sunshine md:mt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 md:py-28">
          <h2 id="why-title" className="max-w-[16ch] text-display text-ink">
            Every pet deserves to be seen.
          </h2>
          <p className="max-w-[56ch] text-lg leading-relaxed text-ink md:text-xl">
            Shelters do the hard work of caring for animals, but a pet nobody sees is a pet nobody adopts. People already
            spend their evenings scrolling short videos, so Kalinga puts adoptable pets there, and gives shelters a simple
            way to post, answer questions and handle adoption requests.
          </p>
        </div>
      </section>

      {/* Team: names only, set as type */}
      <section aria-labelledby="team-title" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col gap-2">
          <h2 id="team-title" className="text-display text-ink">The team</h2>
          <p className="text-lg text-ink-soft">404NotFound, SE-4</p>
        </div>
        <Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <li key={member.family} data-reveal className="flex flex-col gap-1 border-t-2 border-ink py-6">
                <span className="text-2xl font-bold tracking-tight text-ink">{member.family}</span>
                <span className="text-ink-soft">{member.given}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Closing: one way in for each side */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 border-t border-line px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[24ch] text-headline text-ink">Meet the pets waiting for you.</p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/site/home" variant="primary" size="lg">
            Start watching
          </LinkButton>
          <LinkButton href="/shelterSignup" variant="secondary" size="lg">
            Apply as a shelter
          </LinkButton>
        </div>
      </section>
    </>
  );
}
