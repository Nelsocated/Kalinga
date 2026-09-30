import { cn } from "@/src/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Adds the hover lift used by clickable cards. */
  interactive?: boolean;
};

/** The standard surface: card white on the cream ground, flat at rest. */
export default function Card({
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-card",
        interactive &&
          "transition-[box-shadow,transform] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}
