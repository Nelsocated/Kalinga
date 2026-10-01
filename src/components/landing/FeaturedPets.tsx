import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Pets } from "@/src/lib/types/pets";
import { cn } from "@/src/lib/cn";
import { Reveal } from "./Reveal";

function yearsLabel(years: number) {
  return `Waiting ${years} year${years === 1 ? "" : "s"}`;
}

/**
 * The pets who have waited longest, live from the database.
 * One large tile leads; the rest fill a grid beside it. Phones: two columns.
 */
export default function FeaturedPets({ pets }: { pets: Pets[] }) {
  if (!pets.length) return null;

  return (
    <section aria-labelledby="residents-title" className="bg-sunshine-wash py-20 md:py-28">
      <Reveal className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="residents-title" className="max-w-[18ch] text-headline text-ink">
            They have waited the longest
          </h2>
          <Link
            href="/site/explore"
            className="flex items-center gap-1.5 rounded-full py-2 font-semibold text-ink underline-offset-4 hover:underline"
          >
            Meet more pets
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {pets.map((pet, i) => (
            <li key={pet.id} data-reveal className={cn(i === 0 && "col-span-2 lg:row-span-2")}>
              <Link
                href={`/site/profiles/pets/${pet.id}`}
                className="group relative block h-full overflow-hidden rounded-lg bg-sunshine-soft"
              >
                <div className={cn("relative", i === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[4/5]")}>
                  {pet.photo_url ? (
                    <Image
                      src={pet.photo_url}
                      alt=""
                      fill
                      sizes={i === 0 ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, 50vw"}
                      className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-ink/80 to-transparent p-3 pt-12 sm:p-4 sm:pt-14">
                  <span className={cn("font-semibold text-card", i === 0 ? "text-2xl" : "text-base")}>{pet.pet_name || "Unnamed pet"}</span>
                  {pet.years_inShelter > 0 ? (
                    <span className="text-xs text-card/85 sm:text-sm">{yearsLabel(pet.years_inShelter)}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
