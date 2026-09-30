import { Check } from "@phosphor-icons/react/dist/ssr";
import type { NotificationStatus } from "@/src/app/site/notification/page";
import { cn } from "@/src/lib/cn";

type Step = { key: NotificationStatus; label: string };

const STATUS_INDEX: Record<NotificationStatus, number> = {
  pending: 0,
  under_review: 1,
  contacting_applicant: 2,
  not_approved: 3,
  approved: 3,
  withdrawn: 4,
  adopted: 4,
};

// Dot color for the step the application has reached
const DOT: Partial<Record<NotificationStatus, string>> = {
  under_review: "bg-under_review",
  contacting_applicant: "bg-contacting",
  approved: "bg-approved",
  not_approved: "bg-reject",
  adopted: "bg-adopted",
  withdrawn: "bg-withdrawn",
};

function getSteps(status: NotificationStatus): Step[] {
  return [
    { key: "pending", label: "Submitted" },
    { key: "under_review", label: "Under review" },
    { key: "contacting_applicant", label: "Contacting you" },
    status === "not_approved"
      ? { key: "not_approved", label: "Not approved" }
      : { key: "approved", label: "Approved" },
    status === "withdrawn"
      ? { key: "withdrawn", label: "Withdrawn" }
      : { key: "adopted", label: "Adopted" },
  ];
}

/** Where an adoption application is, as a vertical list of steps. */
export default function StatusSteps({ status }: { status: NotificationStatus }) {
  const active = STATUS_INDEX[status] ?? 0;

  return (
    <ol className="flex flex-col" aria-label="Application progress">
      {getSteps(status).map((step, i) => {
        const reached = i <= active;
        const current = i === active;
        const last = i === 4;
        return (
          <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
            {!last ? (
              <span
                aria-hidden="true"
                className={cn("absolute top-6 left-[11px] h-[calc(100%-1rem)] w-0.5", i < active ? "bg-ink/40" : "bg-line")}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                reached ? cn("border-transparent text-white", DOT[step.key] ?? "bg-ink") : "border-line bg-card",
                current && "ring-4 ring-sunshine-soft",
              )}
            >
              {reached && !current ? <Check size={12} weight="bold" /> : null}
            </span>
            <span className={cn("pt-0.5 text-sm", current ? "font-semibold text-ink" : reached ? "text-ink" : "text-muted")}>
              {step.label}
              {current ? <span className="sr-only"> (current step)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
