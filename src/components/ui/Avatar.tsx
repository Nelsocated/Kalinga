import Image from "next/image";
import { cn } from "@/src/lib/cn";

type AvatarProps = {
  src?: string | null;
  name: string;
  /** Rendered size in px. */
  size?: number;
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts.at(-1)![0] : parts[0]?.slice(0, 2);
  return (letters ?? "?").toUpperCase();
}

/** Round photo with an initials fallback on sunshine. */
export default function Avatar({
  src,
  name,
  size = 40,
  className,
}: AvatarProps) {
  const url = src?.trim();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunshine-soft font-semibold text-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {url ? (
        <Image
          src={url}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span aria-label={name}>{initials(name)}</span>
      )}
    </span>
  );
}
