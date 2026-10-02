import { ChatsCircle, Eye, VideoCamera } from "@phosphor-icons/react/dist/ssr";
import { LinkButton } from "@/src/components/ui/Button";

const POINTS = [
  { icon: VideoCamera, text: "Post pet profiles, short videos and foster stories." },
  { icon: ChatsCircle, text: "Answer messages and work through adoption applications in one inbox." },
  { icon: Eye, text: "See how many people watch and like your posts." },
];

/** The shelter pitch on a full field of the brand's yellow. */
export default function ForShelters() {
  return (
    <section aria-labelledby="shelters-title" className="bg-sunshine">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-2 md:gap-16 md:py-32">
        <div className="flex flex-col items-start gap-6">
          <h2 id="shelters-title" className="max-w-[14ch] text-display text-ink">
            Run a shelter? Let more people meet your pets.
          </h2>
          <p className="max-w-[44ch] text-lg text-ink">
            Apply with your registration documents. Once a Kalinga admin approves your shelter, your pets can appear in the feed.
          </p>
          <LinkButton href="/shelterSignup" variant="secondary" size="lg" className="border-ink/10">
            Apply as a shelter
          </LinkButton>
        </div>

        <ul className="flex flex-col justify-center divide-y divide-ink/15">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-5 py-6 first:pt-0 last:pb-0">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink text-sunshine">
                <Icon size={28} weight="fill" aria-hidden="true" />
              </span>
              <p className="text-xl font-medium text-ink">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
