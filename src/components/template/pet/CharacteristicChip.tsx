"use client";

export type CharacteristicItem = {
  label: string;
  value: string | boolean | null | undefined;
};

export default function CharacteristicChip({
  label,
  value,
}: {
  label: string;
  value: string | boolean;
}) {
  const displayValue: string = String(value);

  return (
    <div className="flex items-center gap-3 px-3 py-1 rounded-lg border border-secondary text-sm font-medium bg-chip text-secondary">
      <span className="opacity-90 capitalize">{label}:</span>
      <span className="font-semibold capitalize">{displayValue}</span>
    </div>
  );
}
