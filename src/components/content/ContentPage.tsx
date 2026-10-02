import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export type ContentSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  title: string;
  intro?: React.ReactNode;
  /** Shown under the title, e.g. "October 3, 2026". */
  updated?: string;
  sections: ContentSection[];
};

// Long-read styles for the section bodies: Navy Ink Soft text at a 65ch measure,
// sunshine list markers and link underlines (yellow is never the text itself).
const PROSE =
  "flex flex-col gap-4 text-ink-soft leading-relaxed " +
  "[&_strong]:font-semibold [&_strong]:text-ink " +
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:marker:text-sunshine-deep " +
  "[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-sunshine [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-ink";

function Toc({ sections }: { sections: ContentSection[] }) {
  return (
    <ol className="flex flex-col gap-1">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="block rounded-md px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-sunshine-wash hover:text-ink"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Shared layout for Terms, Privacy and Help: title, contents and a 65ch reading column. */
export default function ContentPage({ title, intro, updated, sections }: Props) {
  return (
    <article className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 md:pt-16">
      <header className="flex max-w-3xl flex-col gap-4 border-b border-line pb-10 md:pb-12">
        <h1 className="text-display text-ink">{title}</h1>
        {intro ? <div className="max-w-[60ch] text-lg leading-relaxed text-ink-soft">{intro}</div> : null}
        {updated ? <p className="text-sm text-muted">Last updated {updated}</p> : null}
      </header>

      <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          {/* Phones and tablets: folded away so the reading starts right after the title */}
          <details className="group rounded-lg border border-line bg-card lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <CaretDown size={16} aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-line p-2">
              <Toc sections={sections} />
            </div>
          </details>
          <div className="hidden lg:block">
            <p className="mb-2 px-3 text-sm font-semibold text-ink">On this page</p>
            <Toc sections={sections} />
          </div>
        </nav>

        <div className="flex max-w-[65ch] flex-col gap-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24">
              <h2 id={`${section.id}-title`} className="mb-4 text-2xl font-bold tracking-tight text-ink">
                {section.title}
              </h2>
              <div className={PROSE}>{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
