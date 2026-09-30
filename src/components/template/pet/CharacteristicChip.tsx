import { Chip } from "@/src/components/ui/StatusChip";

export type CharacteristicItem = {
  label: string;
  value: string | boolean | null | undefined;
};

/** "Label value" tag, e.g. "Breed Domestic Shorthair". */
export default function CharacteristicChip({ label, value }: { label: string; value: string | boolean }) {
  return (
    <Chip>
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold capitalize">{String(value).replace(/_/g, " ")}</span>
    </Chip>
  );
}
