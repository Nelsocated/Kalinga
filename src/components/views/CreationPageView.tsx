import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CaretRight,
  HandHeart,
  PawPrint,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Avatar from "../ui/Avatar";

export type WaitingPet = { id: string; name: string; photoUrl: string | null };

type Action = { label: string; description: string; icon: Icon; href: string };

const POST_VIDEO: Action = {
  label: "Post a video",
  description: "Short clips are how people find your pets. They go straight to the For You feed.",
  icon: VideoCamera,
  href: "/shelter/creation/postVideo",
};
const ADD_PET: Action = {
  label: "Add a pet",
  description: "A profile with a photo, age, size and health details.",
  icon: PawPrint,
  href: "/shelter/creation/addPet",
};
const ADD_FIRST_PET: Action = {
  ...ADD_PET,
  label: "Add your first pet",
  description: "Videos and foster stories are always about a pet, so start with a profile.",
};
const WRITE_FOSTER: Action = {
  label: "Write a foster story",
  description: "Tell people how a pet is doing in a foster home.",
  icon: HandHeart,
  href: "/shelter/creation/writeFoster",
};

const SHOWN_WAITING = 12;

/** The shelter's starting points for new content, led by the one that gets pets seen. */
export default function CreationPageView({
  petCount,
  waiting,
}: {
  petCount: number;
  waiting: WaitingPet[];
}) {
  const hasPets = petCount > 0;
  const primary = hasPets ? POST_VIDEO : ADD_FIRST_PET;
  const secondary = hasPets ? [ADD_PET, WRITE_FOSTER] : [POST_VIDEO, WRITE_FOSTER];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <PrimaryAction action={primary} />
        <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-lg border border-line">
          {secondary.map((action) => (
            <li key={action.href} className="flex-1">
              <SecondaryAction action={action} />
            </li>
          ))}
        </ul>
      </div>

      {hasPets && waiting.length ? (
        <section aria-labelledby="waiting-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="waiting-heading" className="text-xl font-semibold text-ink">
              Not in the feed yet
            </h2>
            <p className="text-sm text-ink-soft">
              {waiting.length === 1
                ? "This pet doesn't have a video yet. Post one so people can find them."
                : `${waiting.length} of your pets don't have a video yet. Post one so people can find them.`}
            </p>
          </div>
          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {waiting.slice(0, SHOWN_WAITING).map((pet) => (
              <li key={pet.id} className="w-32 shrink-0 snap-start sm:w-36">
                <WaitingPetTile pet={pet} />
              </li>
            ))}
          </ul>
          {waiting.length > SHOWN_WAITING ? (
            <p className="text-sm text-muted">
              And {waiting.length - SHOWN_WAITING} more. Pick any of them from Post a video.
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function PrimaryAction({ action }: { action: Action }) {
  const { label, description, icon: Icon, href } = action;

  return (
    <Link
      href={href}
      className="group flex min-h-56 flex-col justify-between gap-8 rounded-xl bg-sunshine p-6 text-ink transition-[background-color,box-shadow,scale] duration-200 ease-out-expo hover:bg-sunshine-deep hover:shadow-lift active:scale-[0.99] sm:p-8"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-ink text-sunshine">
        <Icon size={28} weight="fill" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-headline">
          {label}
          <ArrowRight
            size={28}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
        <span className="max-w-[46ch] text-base">{description}</span>
      </span>
    </Link>
  );
}

function SecondaryAction({ action }: { action: Action }) {
  const { label, description, icon: Icon, href } = action;

  return (
    <Link
      href={href}
      className="group flex h-full items-center gap-4 p-5 transition-colors hover:bg-sunshine-wash"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sunshine-soft text-ink">
        <Icon size={24} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-sm text-ink-soft">{description}</span>
      </span>
      <CaretRight
        size={18}
        aria-hidden="true"
        className="shrink-0 text-ink transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}

function WaitingPetTile({ pet }: { pet: WaitingPet }) {
  return (
    <Link
      href={`/shelter/creation/postVideo?pet=${pet.id}`}
      className="group flex flex-col gap-2"
      aria-label={`Post a video of ${pet.name}`}
    >
      <span className="relative block aspect-4/5 overflow-hidden rounded-lg border border-line bg-sunshine-wash">
        {pet.photoUrl ? (
          <Image
            src={pet.photoUrl}
            alt=""
            fill
            sizes="144px"
            className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <Avatar name={pet.name} size={56} />
          </span>
        )}
        <span className="absolute right-2 bottom-2 flex size-9 items-center justify-center rounded-full bg-sunshine text-ink">
          <VideoCamera size={18} weight="fill" aria-hidden="true" />
        </span>
      </span>
      <span className="truncate text-sm font-semibold text-ink">{pet.name}</span>
    </Link>
  );
}
