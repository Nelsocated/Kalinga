"use client";

import { useEffect, useState, type FormEvent } from "react";
import Input from "../ui/input";
import Button from "../ui/Button";
import Back_Button from "../ui/Back";

type Props = {
  petId: string;
};

type AdoptionStatus = "available" | "pending" | "adopted";
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

async function fetchPetAdoptionStatus(petId: string) {
  const res = await fetch(
    `/api/adoption/status?pet_id=${encodeURIComponent(petId)}`,
    { cache: "no-store" },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to fetch pet adoption status.");
  }

  return json as { id: string; adoption_status: AdoptionStatus };
}

async function postAdoptionRequest(payload: { pet_id: string } & FormState) {
  const res = await fetch("/api/adoption/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to create adoption request.");
  }

  return json;
}

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

export default function AdoptModal({ petId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<AdoptionStatus | null>(null);
  const [view, setView] = useState<ModalView>("form");
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);

  function closeModal() {
    setIsOpen(false);
    setErrorMsg(null);
    setLoading(false);
    setCheckingStatus(false);
    setStatus(null);
    setView("form");
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function openModal() {
    setIsOpen(true);
    setErrorMsg(null);
    setCheckingStatus(true);

    try {
      const data = await fetchPetAdoptionStatus(petId);
      setStatus(data.adoption_status);

      if (data.adoption_status === "adopted") {
        setView("adopted");
      } else {
        setView("form");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
      setView("form");
    } finally {
      setCheckingStatus(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const allChecked =
      form.confirm_safe &&
      form.confirm_allergies &&
      form.confirm_food &&
      form.confirm_attention &&
      form.confirm_vet;

    if (!allChecked) {
      setErrorMsg("Please complete all pet care checklist items first.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      await postAdoptionRequest({
        pet_id: petId,
        ...form,
      });

      setView("submitted");
      setForm(initialForm);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-primary rounded-2xl px-10 py-2 text-xl text-white font-bold"
      >
        Adopt!
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative z-10 w-125 max-w-[90%] rounded-2xl bg-white shadow-2xl">
            {checkingStatus ? (
              <>
                <div className="rounded-t-2xl bg-primary py-4 text-center text-xl font-bold text-white">
                  Adopt Pet
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5">
                  <div className="text-center text-base font-medium">
                    Checking Pet Status...
                  </div>
                </div>
              </>
            ) : view === "adopted" ? (
              <>
                <div className="rounded-t-2xl bg-primary py-4 text-center text-xl font-bold text-white">
                  Pet Already Adopted!
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4 text-center">
                  <div className="font-semibold">
                    Sorry, this pet has already found a home.
                  </div>
                  <div>
                    Check our page for more pets available for adoption.
                  </div>

                  <div className="pt-2">
                    <Button type="button" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            ) : view === "submitted" ? (
              <>
                <div className="rounded-t-2xl bg-primary py-4 text-center text-xl font-bold text-white">
                  Application Submitted!
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4 text-center">
                  <div className="font-semibold">
                    Thank you for submitting your adoption application!
                  </div>
                  <div className="text-justify">
                    We&apos;re excited that you&apos;re considering giving a pet
                    a loving home. The shelter will be in touch soon!
                  </div>

                  <div className="pt-2">
                    <Button type="button" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-t-2xl bg-primary py-4 grid grid-cols-3 items-center">
                  <div className="pl-4">
                    <Back_Button onClick={closeModal} />
                  </div>
                  <div className="text-center text-xl font-bold text-white">
                    Adopt Pet
                  </div>
                  <></>
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5 space-y-5">
                  {status === "pending" ? (
                    <div className="text-sm leading-relaxed">
                      This pet currently has a pending adoption application, but
                      you may still submit your interest.
                    </div>
                  ) : null}

                  {errorMsg ? (
                    <div className="text-sm text-red-600">{errorMsg}</div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-2">
                    <Input
                      label="Name"
                      value={form.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      placeholder="Name"
                      required
                    />

                    <Input
                      label="Address"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Address"
                      required
                    />

                    <Input
                      label="Phone Number"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="Phone"
                      required
                    />

                    <Input
                      label="Email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="Email"
                      type="email"
                    />

                    <Input
                      label="Occupation"
                      value={form.occupation}
                      onChange={(e) =>
                        updateField("occupation", e.target.value)
                      }
                      placeholder="Occupation"
                    />

                    <label className="leading-7">
                      Why do you want to adopt this pet?
                    </label>
                    <textarea
                      value={form.reason}
                      onChange={(e) => updateField("reason", e.target.value)}
                      placeholder="Why do you want to adopt this pet?"
                      required
                      className="min-h-[30] w-full rounded-xl border border-primary focus:focus:ring-2 focus:ring-primary px-4 py-3 outline-none"
                    />

                    <div>
                      <div className="text-lg font-bold pb-2">
                        Pet Care Checklist
                      </div>

                      <div className="space-y-3 text-sm">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.confirm_safe}
                            onChange={(e) =>
                              updateField("confirm_safe", e.target.checked)
                            }
                            className="mt-1 accent-primary"
                          />
                          <span>
                            I have a safe home where pets are allowed.
                          </span>
                        </label>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.confirm_allergies}
                            onChange={(e) =>
                              updateField("confirm_allergies", e.target.checked)
                            }
                            className="mt-1 accent-primary"
                          />
                          <span>
                            No one in my household has allergies or fears of
                            animals.
                          </span>
                        </label>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.confirm_food}
                            onChange={(e) =>
                              updateField("confirm_food", e.target.checked)
                            }
                            className="mt-1 accent-primary"
                          />
                          <span>
                            I can provide daily feeding & fresh water.
                          </span>
                        </label>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.confirm_attention}
                            onChange={(e) =>
                              updateField("confirm_attention", e.target.checked)
                            }
                            className="mt-1 accent-primary"
                          />
                          <span>
                            I can give enough time, care, and attention.
                          </span>
                        </label>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={form.confirm_vet}
                            onChange={(e) =>
                              updateField("confirm_vet", e.target.checked)
                            }
                            className="mt-1 accent-primary"
                          />
                          <span>
                            I can provide veterinary care when needed.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
