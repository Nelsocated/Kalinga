"use client";

import { useId, useState, type FormEvent } from "react";
import { House } from "@phosphor-icons/react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button, { LinkButton } from "../ui/Button";
import Modal from "../ui/Modal";
import { fetchJson } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import { createAdoptionRequestAction } from "@/src/app/actions/social";
import type { PetStatus } from "@/src/lib/types/adoptionRequests";

type Props = {
  petId: string;
};

type ModalView = "form" | "submitted" | "adopted";

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
  confirm_safe: boolean;
  confirm_allergies: boolean;
  confirm_food: boolean;
  confirm_attention: boolean;
  confirm_vet: boolean;
};

type ChecklistKey = Extract<keyof FormState, `confirm_${string}`>;

const initialForm: FormState = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  occupation: "",
  reason: "",
  confirm_safe: false,
  confirm_allergies: false,
  confirm_food: false,
  confirm_attention: false,
  confirm_vet: false,
};

const CHECKLIST: { key: ChecklistKey; label: string }[] = [
  { key: "confirm_safe", label: "I have a safe home where pets are allowed." },
  { key: "confirm_allergies", label: "No one in my household has allergies or fears of animals." },
  { key: "confirm_food", label: "I can provide daily feeding and fresh water." },
  { key: "confirm_attention", label: "I can give enough time, care and attention." },
  { key: "confirm_vet", label: "I can provide veterinary care when needed." },
];

const TITLES: Record<ModalView, string> = {
  form: "Apply to adopt",
  submitted: "Application sent",
  adopted: "Already adopted",
};

export default function AdoptModal({ petId }: Props) {
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [view, setView] = useState<ModalView>("form");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  function closeModal() {
    setIsOpen(false);
    setErrorMsg(null);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function openModal() {
    setIsOpen(true);
    setErrorMsg(null);
    setView("form");
    setStatus(null);
    setCheckingStatus(true);

    try {
      const { data } = await fetchJson<{ data: { id: string; status: PetStatus } }>(
        `/api/pets/${encodeURIComponent(petId)}/adoption`,
        { cache: "no-store" },
      );
      setStatus(data.status);
      setView(data.status === "adopted" ? "adopted" : "form");
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Couldn't check this pet's status.");
    } finally {
      setCheckingStatus(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!CHECKLIST.every(({ key }) => form[key])) {
      setErrorMsg("Tick every item in the pet care checklist to continue.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      unwrap(await createAdoptionRequestAction(petId, form));
      setView("submitted");
      setForm(initialForm);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Couldn't send your application. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const footer =
    view === "form" ? (
      <>
        <Button variant="ghost" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" form={formId} variant="primary" loading={loading} disabled={checkingStatus}>
          Send application
        </Button>
      </>
    ) : view === "adopted" ? (
      <LinkButton href="/site/explore" variant="primary">
        Find another pet
      </LinkButton>
    ) : (
      <Button variant="primary" onClick={closeModal}>
        Done
      </Button>
    );

  return (
    <>
      <Button variant="primary" size="lg" onClick={openModal} icon={<House weight="fill" aria-hidden="true" />} className="min-w-0 flex-1">
        Apply to adopt
      </Button>

      <Modal open={isOpen} onClose={closeModal} title={TITLES[view]} footer={footer}>
        {checkingStatus ? (
          <p className="text-sm text-muted" role="status">
            Checking whether this pet is still available…
          </p>
        ) : view === "adopted" ? (
          <p className="text-sm text-ink-soft">
            This pet has already found a home. There are more pets waiting on Explore.
          </p>
        ) : view === "submitted" ? (
          <p className="text-sm text-ink-soft">
            Thank you for offering a home. The shelter will review your application, and
            you&apos;ll see status updates in Notifications.
          </p>
        ) : (
          <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === "pending" ? (
              <p className="rounded-md bg-sunshine-wash px-3 py-2 text-sm text-ink">
                Someone has already applied for this pet. You can still send your application.
              </p>
            ) : null}

            <Input label="Full name" value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} autoComplete="name" required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" required />
            <Input label="Phone number" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} autoComplete="tel" required />
            <Input label="Address" value={form.address} onChange={(e) => updateField("address", e.target.value)} autoComplete="street-address" required />
            <Input label="Occupation" value={form.occupation} onChange={(e) => updateField("occupation", e.target.value)} autoComplete="organization-title" />
            <Textarea
              label="Why do you want to adopt this pet?"
              value={form.reason}
              onChange={(e) => updateField("reason", e.target.value)}
              rows={4}
              required
            />

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 text-sm font-semibold text-ink">Pet care checklist</legend>
              {CHECKLIST.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => updateField(key, e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-ink"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            {errorMsg ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {errorMsg}
              </p>
            ) : null}
          </form>
        )}
      </Modal>
    </>
  );
}
