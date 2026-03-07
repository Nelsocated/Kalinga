"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdoptionModal from "@/components/explore/AdoptionModal";

type AdoptionApplicationFormProps = {
  petId: string;
  mode?: "page" | "modal";
  onClose?: () => void;
};

export default function AdoptionApplicationForm({
  petId,
  mode = "page",
  onClose,
}: AdoptionApplicationFormProps) {
  const router = useRouter();

  const isModal = mode === "modal";

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    reason: "",
    safeHome: false,
    noAllergies: false,
    feeding: false,
    exercise: false,
    vetCare: false,
  });

  const [showAlert, setShowAlert] = useState(false);

  function handleCloseAlert() {
    setShowAlert(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    setShowAlert(true);
  }

  return (
    <div className={isModal ? "rounded-2xl border border-[#e8bf42] bg-[#fff8dc] p-4 md:p-5" : "min-h-[85vh] rounded-2xl border-2 border-[#f3be0f] bg-[#fff8dc] p-4 md:p-6"}>
      <div className={isModal ? "mx-auto w-full max-w-2xl" : "mx-auto w-full max-w-4xl"}>
        {isModal ? (
          <button
            type="button"
            onClick={onClose}
            className="mb-4 inline-flex items-center rounded-lg border border-[#e8bf42] bg-white px-3 py-2 text-sm font-semibold text-black"
            aria-label="Close adoption application"
          >
            Close
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push(`/site/pet/${petId}`)}
            className="mb-4 inline-flex items-center rounded-lg border border-[#f3be0f] bg-white px-3 py-2 text-sm font-semibold text-black"
            aria-label="Back to pet profile"
          >
            ← Back to Pet
          </button>
        )}

        <form
          onSubmit={onSubmit}
          className="overflow-hidden rounded-xl bg-white shadow-md"
        >
          <div className="bg-yellow-500 py-3 text-center text-xl font-bold text-white md:text-2xl">
            Adoption Application
          </div>

          <div className="space-y-5 p-4 md:p-6">

            <section className="space-y-4">
              <h2 className="text-base font-semibold text-black md:text-lg">Applicant Information</h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium md:text-base">Full Name</label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-3 py-2 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium md:text-base">Home Address</label>
                <input
                  name="address"
                  placeholder="Street, barangay, city"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-3 py-2 text-sm md:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium md:text-base">Phone Number or Email</label>
                <input
                  name="contact"
                  placeholder="09xx xxx xxxx or your@email.com"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-3 py-2 text-sm md:text-base"
                />
              </div>
            </section>

            <section className="space-y-2">
              <label className="block text-sm font-medium md:text-base">Why do you want to adopt this animal?</label>
              <textarea
                name="reason"
                placeholder="Tell us about your motivation, daily routine, and readiness to care for this pet."
                value={form.reason}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border border-yellow-400 px-3 py-2 text-sm md:text-base"
              />
            </section>

            <section className="space-y-3 pt-2">
              <h2 className="text-base font-semibold text-black md:text-lg">Pet Care Checklist</h2>

              <label className="flex items-center gap-3 text-sm md:text-base">
                <input type="checkbox" name="safeHome" checked={form.safeHome} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I have a safe home where pets are allowed
              </label>

              <label className="flex items-center gap-3 text-sm md:text-base">
                <input type="checkbox" name="noAllergies" checked={form.noAllergies} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                No one in my household has allergies or fears of animals
              </label>

              <label className="flex items-center gap-3 text-sm md:text-base">
                <input type="checkbox" name="feeding" checked={form.feeding} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide daily feeding and fresh water
              </label>

              <label className="flex items-center gap-3 text-sm md:text-base">
                <input type="checkbox" name="exercise" checked={form.exercise} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide exercise and attention
              </label>

              <label className="flex items-center gap-3 text-sm md:text-base">
                <input type="checkbox" name="vetCare" checked={form.vetCare} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide veterinary care if needed
              </label>
            </section>

            <button
              type="submit"
              className="mt-4 rounded bg-[#f3be0f] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90 md:text-sm"
            >
              Submit
            </button>
          </div>
        </form>

        <AdoptionModal
          isOpen={showAlert}
          onClose={handleCloseAlert}
          closeLabel="Close"
        />
      </div>
    </div>
  );
}
