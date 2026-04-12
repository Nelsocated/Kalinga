"use client";

import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Back_Button from "../ui/BackButton";
import { fetchAdoptionAnswer } from "@/src/lib/services/adoption/adoptionClient";
import type { answer } from "@/src/lib/types/adoptionRequests";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  answerId: string | null;
};

type ModalView = "loading" | "answer" | "error";

export default function AnswerModal({ isOpen, onClose, answerId }: Props) {
  const [view, setView] = useState<ModalView>("loading");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [answer, setAnswer] = useState<answer | null>(null);

  function resetModalState() {
    setView("loading");
    setLoading(false);
    setErrorMsg(null);
    setAnswer(null);
  }

  function closeModal() {
    onClose();
    resetModalState();
  }

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function loadAnswer() {
      try {
        setLoading(true);
        setErrorMsg(null);
        setView("loading");

        if (!answerId?.trim()) {
          throw new Error("Missing answer id.");
        }

        const data = await fetchAdoptionAnswer(answerId);

        if (!isMounted) return;
        setAnswer(data);
        setView("answer");
      } catch (error: unknown) {
        if (!isMounted) return;
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load answer.",
        );
        setView("error");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAnswer();

    return () => {
      isMounted = false;
    };
  }, [isOpen, answerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      <div className="relative z-10 w-125 max-w-[90%] overflow-hidden rounded-[15px] border-2 bg-white shadow-2xl">
        {view === "loading" ? (
          <>
            <div className="rounded-t-[15px] bg-primary py-4 text-center text-xl font-bold text-white">
              Adoption Answer
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5">
              <div className="text-center text-base font-medium">
                Loading answer...
              </div>
            </div>
          </>
        ) : view === "error" ? (
          <>
            <div className="rounded-t-[15px] bg-primary py-4 text-center text-xl font-bold text-white">
              Adoption Answer
            </div>

            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5 text-center">
              <div className="font-semibold text-red-600">{errorMsg}</div>

              <div className="pt-2">
                <Button type="button" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : answer ? (
          <>
            <div className="grid grid-cols-3 items-center rounded-t-[15px] bg-primary py-4">
              <div className="pl-4">
                <Back_Button onClick={closeModal} />
              </div>
              <div className="text-center text-xl font-bold text-white">
                Adoption Answer
              </div>
              <div />
            </div>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto scroll-stable p-5">
              <Input label="Name" value={answer.full_name} readOnly />

              <Input label="Address" value={answer.address ?? "N/A"} readOnly />

              <Input
                label="Phone Number"
                value={answer.phone ?? "N/A"}
                readOnly
              />

              <Input label="Email" value={answer.email} type="email" readOnly />

              <Input
                label="Occupation"
                value={answer.occupation ?? "N/A"}
                readOnly
              />

              <label className="leading-7">
                Why do you want to adopt this pet?
              </label>
              <textarea
                value={answer.reason ?? ""}
                readOnly
                className="min-h-30 w-full rounded-xl border px-4 py-3 outline-none"
              />

              <div>
                <div className="pb-2 text-lg font-bold">Pet Care Checklist</div>

                <div className="space-y-3 text-sm">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answer.confirm_safe}
                      readOnly
                      className="mt-1 accent-primary"
                    />
                    <span>I have a safe home where pets are allowed.</span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answer.confirm_allergies}
                      readOnly
                      className="mt-1 accent-primary"
                    />
                    <span>
                      No one in my household has allergies or fears of animals.
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answer.confirm_food}
                      readOnly
                      className="mt-1 accent-primary"
                    />
                    <span>I can provide daily feeding and fresh water.</span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answer.confirm_attention}
                      readOnly
                      className="mt-1 accent-primary"
                    />
                    <span>I can give enough time, care, and attention.</span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={answer.confirm_vet}
                      readOnly
                      className="mt-1 accent-primary"
                    />
                    <span>I can provide veterinary care when needed.</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="border border-primary"
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
