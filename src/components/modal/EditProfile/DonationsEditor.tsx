"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Plus, QrCode, Trash, X } from "@phosphor-icons/react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { cn } from "@/src/lib/cn";
import type { DonationSettings, MonetaryMethod } from "@/src/lib/types/donation";

export type DraftMethod = MonetaryMethod & { key: string };
export type DonationDraft = Omit<DonationSettings, "monetary"> & { monetary: DraftMethod[] };

let nextKey = 0;
const newKey = () => `method-${nextKey++}`;

export function toDraft(settings: DonationSettings): DonationDraft {
  return { ...settings, monetary: settings.monetary.map((m) => ({ ...m, key: newKey() })) };
}

/**
 * Turns the draft into what the server saves: empty methods are dropped, the rest are trimmed.
 * Returns the index of each kept method that is missing a name, so the form can point at it.
 */
export function fromDraft(draft: DonationDraft): { settings: DonationSettings; unnamed: string[] } {
  const filled = draft.monetary.filter(
    (m) => m.method.trim() || m.account_name.trim() || m.account_number.trim() || m.qr_url,
  );

  return {
    settings: {
      enabled: draft.enabled,
      goods: { ...draft.goods, note: draft.goods.note.trim() },
      monetary: filled.map((m) => ({
        id: m.id,
        qr_url: m.qr_url,
        method: m.method.trim(),
        account_name: m.account_name.trim(),
        account_number: m.account_number.trim(),
      })),
    },
    unnamed: filled.filter((m) => !m.method.trim()).map((m) => m.key),
  };
}

type Props = {
  value: DonationDraft;
  onChange: (next: DonationDraft) => void;
  uploadQr: (file: File) => Promise<string>;
  onBusyChange: (busy: boolean) => void;
  /** Keys of payment methods that need a name before saving. */
  unnamed: string[];
};

/** The Donations part of the shelter's Edit profile form. */
export default function DonationsEditor({ value, onChange, uploadQr, onBusyChange, unnamed }: Props) {
  const headingId = useId();
  const switchHintId = useId();

  function patchMethod(key: string, patch: Partial<MonetaryMethod>) {
    onChange({ ...value, monetary: value.monetary.map((m) => (m.key === key ? { ...m, ...patch } : m)) });
  }

  return (
    <section aria-labelledby={headingId} className="mt-2 flex flex-col gap-6 border-t border-line pt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 id={headingId} className="text-lg font-semibold text-ink">
            Donations
          </h3>
          <p id={switchHintId} className="text-sm text-ink-soft">
            {value.enabled
              ? "Your profile shows a Donate button with the details below."
              : "The Donate button is hidden. Your details are kept for when you turn it back on."}
          </p>
        </div>
        <Switch
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
          label="Show Donate on my profile"
          describedBy={switchHintId}
        />
      </div>

      {value.enabled ? (
        <>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-base font-semibold text-ink">Money</legend>
            {value.monetary.length === 0 ? (
              <p className="text-sm text-muted">
                Add the e-wallets or bank accounts people can send money to.
              </p>
            ) : null}
            {value.monetary.map((method, index) => (
              <MethodFields
                key={method.key}
                method={method}
                index={index}
                missingName={unnamed.includes(method.key)}
                onPatch={(patch) => patchMethod(method.key, patch)}
                onRemove={() =>
                  onChange({ ...value, monetary: value.monetary.filter((m) => m.key !== method.key) })
                }
                uploadQr={uploadQr}
                onBusyChange={onBusyChange}
              />
            ))}
            {value.monetary.length < 10 ? (
              <Button
                variant="secondary"
                size="sm"
                className="self-start"
                icon={<Plus aria-hidden="true" />}
                onClick={() =>
                  onChange({
                    ...value,
                    monetary: [
                      ...value.monetary,
                      { key: newKey(), method: "", account_name: "", account_number: "", qr_url: "" },
                    ],
                  })
                }
              >
                Add payment method
              </Button>
            ) : null}
          </fieldset>

          <div className="border-t border-line pt-6">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-3 text-base font-semibold text-ink">Goods</legend>
            <Wishlist
              items={value.goods.items}
              onChange={(items) => onChange({ ...value, goods: { ...value.goods, items } })}
            />
            <Textarea
              label="Drop-off instructions"
              hint="Where and when people can bring items."
              rows={3}
              maxLength={1000}
              value={value.goods.note}
              onChange={(e) => onChange({ ...value, goods: { ...value.goods, note: e.target.value } })}
            />
          </fieldset>
          </div>
        </>
      ) : null}
    </section>
  );
}

function Switch({
  checked,
  onChange,
  label,
  describedBy,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className="group flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-7 w-12 rounded-full border transition-colors duration-200",
          "group-focus-visible:ring-2 group-focus-visible:ring-ink group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-card",
          checked ? "border-sunshine-deep bg-sunshine" : "border-ink-soft/60 bg-ground",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 left-0.5 size-5 -translate-y-1/2 rounded-full transition-[translate,background-color] duration-200 ease-out-expo motion-reduce:transition-none",
            checked ? "translate-x-5 bg-ink" : "bg-ink-soft",
          )}
        />
      </span>
    </button>
  );
}

function MethodFields({
  method,
  index,
  missingName,
  onPatch,
  onRemove,
  uploadQr,
  onBusyChange,
}: {
  method: DraftMethod;
  index: number;
  missingName: boolean;
  onPatch: (patch: Partial<MonetaryMethod>) => void;
  onRemove: () => void;
  uploadQr: (file: File) => Promise<string>;
  onBusyChange: (busy: boolean) => void;
}) {
  const fileId = useId();
  const [uploading, setUploading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const name = method.method.trim() || `Payment method ${index + 1}`;

  async function pickQr(file: File) {
    setQrError(null);
    setUploading(true);
    onBusyChange(true);
    try {
      onPatch({ qr_url: await uploadQr(file) });
    } catch (error) {
      setQrError(error instanceof Error ? error.message : "Couldn't upload that image.");
    } finally {
      setUploading(false);
      onBusyChange(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-ground p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-semibold text-ink">{name}</p>
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 shrink-0"
          icon={<Trash aria-hidden="true" />}
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          Remove
        </Button>
      </div>

      <Input
        label="Method"
        hint="For example GCash, Maya or BDO."
        error={missingName ? "Give this payment method a name." : undefined}
        maxLength={60}
        value={method.method}
        onChange={(e) => onPatch({ method: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Account name"
          maxLength={120}
          value={method.account_name}
          onChange={(e) => onPatch({ account_name: e.target.value })}
        />
        <Input
          label="Account number"
          inputMode="numeric"
          maxLength={120}
          inputClassName="tabular-nums"
          value={method.account_number}
          onChange={(e) => onPatch({ account_number: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">QR code</p>
        <div className="flex flex-wrap items-center gap-3">
          {method.qr_url ? (
            <Image
              src={method.qr_url}
              alt={`QR code for ${name}`}
              width={72}
              height={72}
              className="size-18 rounded-md border border-line bg-card object-contain"
            />
          ) : null}
          <label
            htmlFor={fileId}
            className={cn(
              "flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold text-ink transition-colors",
              "focus-within:ring-2 focus-within:ring-ink hover:border-ink/20 hover:bg-sunshine-wash",
              uploading && "cursor-wait opacity-60",
            )}
          >
            <QrCode size={18} aria-hidden="true" />
            {uploading ? "Uploading…" : method.qr_url ? "Replace QR" : "Upload QR"}
            <input
              id={fileId}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void pickQr(file);
                e.target.value = "";
              }}
            />
          </label>
          {method.qr_url && !uploading ? (
            <Button variant="ghost" size="sm" onClick={() => onPatch({ qr_url: "" })}>
              Remove QR
            </Button>
          ) : null}
        </div>
        {qrError ? (
          <p role="alert" className="text-sm text-reject-text">
            {qrError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Wishlist({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState("");

  // Commas split a pasted list into separate items; repeats are skipped
  function commit() {
    const seen = new Set(items.map((item) => item.toLowerCase()));
    const added = draft
      .split(",")
      .map((item) => item.trim().slice(0, 60))
      .filter((item) => {
        if (!item || seen.has(item.toLowerCase())) return false;
        seen.add(item.toLowerCase());
        return true;
      });
    if (added.length) onChange([...items, ...added].slice(0, 40));
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
          label="Items you need"
          hint="Press Enter after each item, or separate them with commas."
          value={draft}
          disabled={items.length >= 40}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
      {items.length ? (
        <ul className="flex flex-wrap gap-2" aria-label="Your wishlist">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1 rounded-full bg-sunshine-soft py-1 pr-1 pl-3 text-sm font-medium text-ink"
            >
              <span className="[overflow-wrap:anywhere]">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                aria-label={`Remove ${item}`}
                className="relative flex size-6 items-center justify-center rounded-full transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:bg-sunshine-deep/40"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No items yet. Food, litter and blankets are common asks.</p>
      )}
    </div>
  );
}
