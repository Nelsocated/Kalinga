"use client";

import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/src/lib/cn";

export type TabDef<K extends string> = { key: K; label: string; icon: Icon };

/** Pill tabs; the active one gets the wash and a filled icon. */
export default function TabBar<K extends string>({
  tabs,
  active,
  onChange,
  label,
  idPrefix,
}: {
  tabs: TabDef<K>[];
  active: K;
  onChange: (key: K) => void;
  label: string;
  idPrefix: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-line pb-3">
      {tabs.map(({ key, label: text, icon: TabIcon }) => {
        const selected = key === active;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${key}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(key)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const i = tabs.findIndex((t) => t.key === key);
              const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
              onChange(next.key);
              document.getElementById(`${idPrefix}-tab-${next.key}`)?.focus();
            }}
            className={cn(
              "flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink transition-colors hover:bg-sunshine-wash",
              selected && "bg-sunshine-wash font-semibold",
            )}
          >
            <TabIcon size={20} weight={selected ? "fill" : "regular"} aria-hidden="true" />
            {text}
          </button>
        );
      })}
    </div>
  );
}
