import { cn } from "@/src/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

/**
 * The soft page panel shared by WebTemplate and the loading skeletons.
 * From sm: a Card White panel with a 1px Line border and the 24px large-panel radius,
 * flat at rest, centered on the ground. Phones: the panel runs edge to edge.
 */
export default function PageFrame({ className, children, ...props }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col sm:px-6 sm:py-6 md:py-8">
      <div
        className={cn(
          "flex flex-1 flex-col gap-4 bg-card px-4 py-4 sm:rounded-xl sm:border sm:border-line sm:p-6",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
