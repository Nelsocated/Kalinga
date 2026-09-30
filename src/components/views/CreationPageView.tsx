import Link from "next/link";
import { CaretRight, HandHeart, PawPrint, VideoCamera } from "@phosphor-icons/react/dist/ssr";

const actions = [
  {
    label: "Add a pet",
    description: "Create a profile with photos, age, size and health details.",
    icon: PawPrint,
    href: "/shelter/creation/addPet",
  },
  {
    label: "Post a video",
    description: "Share a short clip of a pet. It goes straight to the feed.",
    icon: VideoCamera,
    href: "/shelter/creation/postVideo",
  },
  {
    label: "Write a foster story",
    description: "Tell how a pet is doing in foster care.",
    icon: HandHeart,
    href: "/shelter/creation/writeFoster",
  },
];

/** The shelter's starting points for new content. */
export default function CreationPageView() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {actions.map(({ label, description, icon: Icon, href }) => (
        <li key={href}>
          <Link
            href={href}
            className="group flex h-full items-start gap-4 rounded-lg border border-line bg-card p-5 transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift md:flex-col"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sunshine text-ink">
              <Icon size={26} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-center gap-1 font-semibold text-ink">
                {label}
                <CaretRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm text-ink-soft">{description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
