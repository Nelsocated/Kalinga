import { GenderFemale, GenderMale } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/lib/cn";
import type { PetGender } from "@/src/lib/types/shelters";

/** Male/female indicator in the sex colors; nothing for unknown. */
export default function SexIcon({
  sex,
  size = 20,
  className,
}: {
  sex: PetGender | string | null | undefined;
  size?: number;
  className?: string;
}) {
  if (sex === "male") {
    return (
      <GenderMale
        size={size}
        weight="bold"
        role="img"
        aria-label="Male"
        className={cn("shrink-0 text-male", className)}
      />
    );
  }

  if (sex === "female") {
    return (
      <GenderFemale
        size={size}
        weight="bold"
        role="img"
        aria-label="Female"
        className={cn("shrink-0 text-female", className)}
      />
    );
  }

  return null;
}
