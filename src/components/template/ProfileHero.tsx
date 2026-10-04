import type { ReactNode } from "react";
import Avatar from "@/src/components/ui/Avatar";

type Props = {
  name: string;
  /** Username for people, location for shelters. */
  subtitle?: string | null;
  imageUrl?: string | null;
  /** Labelled actions; they wrap under the name on phones and sit on the right from md. */
  actions?: ReactNode;
  /** Phone-only icon buttons (notifications, More) beside the avatar; the sidebar has them from md. */
  utilities?: ReactNode;
};

/** Who this profile belongs to: a large avatar, the name as the page heading, then actions. */
export default function ProfileHero({ name, subtitle, imageUrl, actions, utilities }: Props) {
  return (
    <section className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:gap-5">
        <div className="flex items-start justify-between gap-3">
          <Avatar src={imageUrl} name={name} size={96} />
          {utilities ? <div className="-mr-2 flex items-center md:hidden">{utilities}</div> : null}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-display text-balance break-words text-ink">{name}</h1>
          {subtitle ? <p className="truncate text-ink-soft">{subtitle}</p> : null}
        </div>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2 md:shrink-0 md:justify-end">{actions}</div> : null}
    </section>
  );
}
