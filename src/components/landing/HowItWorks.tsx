import { FileText, Heart, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    verb: "Watch",
    icon: PlayCircle,
    text: "Scroll short videos of dogs and cats, posted by the shelters caring for them.",
  },
  {
    verb: "Like",
    icon: Heart,
    text: "Tap the heart to keep a pet, a video or a shelter. Message shelters you like.",
  },
  {
    verb: "Apply",
    icon: FileText,
    text: "Send an adoption application from the pet's page and follow its status as the shelter reviews it.",
  },
];

/** The adopter path as three verbs, set large, one per row. */
export default function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <Reveal className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <h2 id="how-title" data-reveal className="text-headline text-ink md:sticky md:top-28 md:self-start">
          From a video to a home in three taps
        </h2>
        <ol className="flex flex-col">
          {STEPS.map(({ verb, icon: Icon, text }) => (
            <li key={verb} data-reveal className="flex gap-5 border-t border-line py-8 first:border-t-0 first:pt-0">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-sunshine text-ink">
                <Icon size={28} weight="fill" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{verb}</h3>
                <p className="max-w-[46ch] text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
