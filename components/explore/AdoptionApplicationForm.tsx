"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdoptionModal from "@/components/explore/AdoptionModal";

type AdoptionApplicationFormProps = {
  petId: string;
  petName: string;
  shelterName: string;
  mode?: "page" | "modal";
  onClose?: () => void;
};

export default function AdoptionApplicationForm({
  petId,
  petName,
  shelterName,
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
    <div className={isModal ? "rounded-2xl border border-[#e8bf42] bg-[#fff8dc] p-5 md:p-8" : "min-h-[85vh] rounded-2xl border-2 border-[#f3be0f] bg-[#fff8dc] p-5 md:p-10"}>
      <div className="mx-auto w-full max-w-6xl">
        {isModal ? (
          <button
            type="button"
            onClick={onClose}
            className="mb-6 inline-flex items-center rounded-lg border border-[#e8bf42] bg-white px-4 py-2.5 text-base font-semibold text-black"
            aria-label="Close adoption application"
          >
            Close
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push(`/site/pet/${petId}`)}
            className="mb-6 inline-flex items-center rounded-lg border border-[#f3be0f] bg-white px-4 py-2.5 text-base font-semibold text-black"
            aria-label="Back to pet profile"
          >
            ← Back to Pet
          </button>
        )}

        <form
          onSubmit={onSubmit}
          className="overflow-hidden rounded-xl bg-white shadow-md"
        >
          <div className="bg-yellow-500 py-5 text-center text-2xl font-bold text-white md:text-3xl">
            Adoption Application
          </div>

          <div className="space-y-6 p-6 md:p-10">
            <p className="text-base text-black/70 md:text-lg">
              Applying to adopt <span className="font-semibold">{petName}</span> from <span className="font-semibold">{shelterName}</span>.
            </p>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-black">Applicant Information</h2>

              <div className="space-y-2">
                <label className="block text-base font-medium">Full Name</label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-4 py-3 text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium">Home Address</label>
                <input
                  name="address"
                  placeholder="Street, barangay, city"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-4 py-3 text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-base font-medium">Phone Number or Email</label>
                <input
                  name="contact"
                  placeholder="09xx xxx xxxx or your@email.com"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-yellow-400 px-4 py-3 text-base"
                />
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-black">Adoption Intent</h2>
              <label className="block text-base font-medium">Why do you want to adopt this animal?</label>
              <textarea
                name="reason"
                placeholder="Tell us about your motivation, daily routine, and readiness to care for this pet."
                value={form.reason}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-md border border-yellow-400 px-4 py-3 text-base"
              />
            </section>

            <section className="space-y-3 pt-2">
              <h2 className="text-lg font-semibold text-black">Pet Care Checklist</h2>
              <p className="text-sm text-black/70">Check all items that you can commit to.</p>

              <label className="flex items-center gap-3 text-base">
                <input type="checkbox" name="safeHome" checked={form.safeHome} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I have a safe home where pets are allowed
              </label>

              <label className="flex items-center gap-3 text-base">
                <input type="checkbox" name="noAllergies" checked={form.noAllergies} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                No one in my household has allergies or fears of animals
              </label>

              <label className="flex items-center gap-3 text-base">
                <input type="checkbox" name="feeding" checked={form.feeding} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide daily feeding and fresh water
              </label>

              <label className="flex items-center gap-3 text-base">
                <input type="checkbox" name="exercise" checked={form.exercise} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide exercise and attention
              </label>

              <label className="flex items-center gap-3 text-base">
                <input type="checkbox" name="vetCare" checked={form.vetCare} onChange={handleChange} className="h-4 w-4 accent-[#f3be0f]" />
                I can provide veterinary care if needed
              </label>
            </section>

            <button
              type="submit"
              className="mt-6 rounded bg-[#f3be0f] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
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
