import { cn } from "@/src/lib/cn";

export type ChipStatus =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "approved"
  | "not_approved"
  | "rejected"
  | "withdrawn"
  | "adopted";

// Fill is the status hue at ~14%; the text shade passes WCAG AA on it.
const STYLES: Record<ChipStatus, { label: string; className: string }> = {
  pending: { label: "Submitted", className: "bg-ink/10 text-ink" },
  under_review: {
    label: "Under review",
    className: "bg-under_review/14 text-under_review",
  },
  contacting_applicant: {
    label: "Contacting",
    className: "bg-contacting/14 text-contacting",
  },
  approved: {
    label: "Approved",
    className: "bg-approved/14 text-approved-text",
  },
  not_approved: {
    label: "Not approved",
    className: "bg-reject/14 text-reject-text",
  },
  rejected: { label: "Rejected", className: "bg-reject/14 text-reject-text" },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-withdrawn/14 text-withdrawn-text",
  },
  adopted: { label: "Adopted", className: "bg-adopted/14 text-adopted-text" },
};

type StatusChipProps = {
  status: ChipStatus;
  /** Overrides the default label for this status. */
  label?: string;
  className?: string;
};

export default function StatusChip({
  status,
  label,
  className,
}: StatusChipProps) {
  const style = STYLES[status] ?? STYLES.pending;

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap",
        style.className,
        className,
      )}
    >
      {label ?? style.label}
    </span>
  );
}

/** A plain yellow tag for non-status labels (breed, size, filters). */
export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full bg-sunshine-soft px-3 text-xs font-medium text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
