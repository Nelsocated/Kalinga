"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { fetchJson } from "@/src/lib/fetchJson";
import type { answer } from "@/src/lib/types/adoptionRequests";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  answerId: string | null;
};

const CHECKLIST: { key: keyof answer; label: string }[] = [
  { key: "confirm_safe", label: "Has a safe home where pets are allowed" },
  { key: "confirm_allergies", label: "No one in the household has allergies or fears of animals" },
  { key: "confirm_food", label: "Can provide daily feeding and fresh water" },
  { key: "confirm_attention", label: "Can give enough time, care and attention" },
  { key: "confirm_vet", label: "Can provide veterinary care when needed" },
];

/** A shelter's read-only view of an adoption application. */
export default function AnswerModal({ isOpen, onClose, answerId }: Props) {
  const [answer, setAnswer] = useState<answer | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !answerId?.trim()) return;
    let alive = true;

    // answerId is the adoption request id
    fetchJson<{ data: answer }>(`/api/users/${encodeURIComponent(answerId)}/adoption/answer`, {
      cache: "no-store",
    })
      .then(({ data }) => {
        if (!alive) return;
        setAnswer(data);
        setErrorMsg(null);
      })
      .catch((error: unknown) => {
        if (!alive) return;
        setErrorMsg(error instanceof Error ? error.message : "Couldn't load this application.");
      });

    return () => {
      alive = false;
    };
  }, [isOpen, answerId]);

  const shown = answer && answer.id === answerId ? answer : null;

  const details: [string, string][] = shown
    ? [
        ["Name", shown.full_name],
        ["Email", shown.email],
        ["Phone", shown.phone ?? "Not given"],
        ["Address", shown.address ?? "Not given"],
        ["Occupation", shown.occupation ?? "Not given"],
      ]
    : [];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Adoption application"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {errorMsg ? (
        <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
          {errorMsg}
        </p>
      ) : !shown ? (
        <p role="status" className="text-sm text-muted">
          Loading the application…
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
            {details.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="text-sm font-medium break-words text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-ink">Why they want to adopt</h3>
            <p className="whitespace-pre-line text-sm text-ink-soft">{shown.reason || "No reason given."}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-ink">Pet care checklist</h3>
            <ul className="flex flex-col gap-2">
              {CHECKLIST.map(({ key, label }) => {
                const yes = Boolean(shown[key]);
                return (
                  <li key={key} className="flex items-start gap-2 text-sm text-ink">
                    {yes ? (
                      <CheckCircle size={20} weight="fill" className="shrink-0 text-approved-text" aria-hidden="true" />
                    ) : (
                      <XCircle size={20} className="shrink-0 text-reject-text" aria-hidden="true" />
                    )}
                    {label}
                    <span className="sr-only">{yes ? ": yes" : ": no"}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
}
