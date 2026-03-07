"use client";

import { useState } from "react";
import AdoptionApplicationForm from "@/components/explore/AdoptionApplicationForm";

type FosterAdoptButtonProps = {
  petId: string;
};

export default function FosterAdoptButton({ petId }: FosterAdoptButtonProps) {
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowAdoptionForm(true)}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#f3be0f] px-4 py-3 text-xl font-bold text-white"
      >
        Adopt
      </button>

      {showAdoptionForm ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Adoption application"
          onClick={() => setShowAdoptionForm(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <AdoptionApplicationForm
              petId={petId}
              mode="modal"
              onClose={() => setShowAdoptionForm(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
