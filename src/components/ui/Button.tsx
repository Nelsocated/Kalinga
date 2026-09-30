import Link from "next/link";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[background-color,box-shadow,transform,color] duration-200 ease-out-expo " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-sunshine text-ink hover:bg-sunshine-deep hover:shadow-lift",
  secondary:
    "border border-line bg-card text-ink hover:bg-sunshine-wash hover:shadow-lift",
  ghost: "text-ink hover:bg-sunshine-wash",
  destructive: "bg-reject text-white hover:bg-reject-text hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-7 text-base",
  icon: "size-11 text-xl",
};

export function buttonStyles({
  variant = "secondary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  loading?: boolean;
};

export default function Button({
  children,
  icon,
  type = "button",
  loading = false,
  disabled = false,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <CircleNotch className="animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
};

/** A link that looks like a button, for navigation actions. */
export function LinkButton({
  children,
  icon,
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      {icon}
      {children}
    </Link>
  );
}
