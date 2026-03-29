"use client";

export type CharacteristicItem = {
  label: string;
  value: string | boolean | null | undefined;
  type?: "boolean";
};

export default function CharacteristicChip({
  label,
  value,
  type,
}: {
  label: string;
  value: string | boolean;
  type?: "boolean";
}) {
  let displayValue: string = String(value);
  let classes = "bg-primary text-black";

  if (type === "boolean") {
    const bool = Boolean(value);
    displayValue = bool ? "Yes" : "No";
    classes = bool ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white";
  }

  return (
    <div
      className={`flex items-center gap-3 px-3 py-1 rounded-[15px] text-sm font-medium ${classes}`}
    >
      <span className="opacity-70">{label}:</span>
      <span className="font-semibold">{displayValue}</span>
    </div>
  );
}
