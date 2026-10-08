import { cn } from "@/src/lib/cn";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  /** Usually a Button or LinkButton that fills the empty space. */
  action?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full bg-sunshine-soft text-3xl text-ink"
      >
        {icon}
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-xl font-semibold text-ink">{title}</p>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
