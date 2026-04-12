"use client";

import Button from "@/components/ui/Button";
import PetCard from "@/components/cards/PetCard";
import { useRouter } from "next/navigation";
import type { ShelterNotifItem } from "../notification/NotifShelter";
import React, { useState } from "react";
import AnswerModal from "@/components/modal/AnswerModal";
import ComposeView from "@/components/views/ComposeView";

type Props = {
  item: ShelterNotifItem;
  status: string;
};

function statusText(name: string, status: string) {
  function switchCase(status: string): React.ReactNode {
    switch (status) {
      case "under review":
        return "wants to adopt";
      case "contacting applicant":
        return "wants to adopt";
      case "not approved":
        return "- Application Declined";
      case "approved":
        return "- Approved Adopter";
      case "withdrawn":
        return "- Withdrew Adoption";
      case "adopted":
        return "Adopted";
      default:
        return "wants to adopt";
    }
  }

  return (
    <div className="line-clamp-1 h-15 rounded-[15px] bg-primary px-8 py-1 text-sm font-semibold text-black">
      {name} {switchCase(status)}
    </div>
  );
}

export default function NotifShelterCard({ item, status }: Props) {
  const [openAnswer, setOpenAnswer] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="relative flex flex-col">
        <div className="z-0 flex items-center justify-between">
          {statusText(item.applicantName, status)}
          <button
            type="button"
            onClick={() => {
              if (!item.applicantId) return;
              router.push(`/site/profiles/user/${item.applicantId}`);
            }}
            className="flex h-15 items-start rounded-[15px] bg-primary px-4 py-1 text-sm font-semibold text-black hover:underline"
          >
            View User Profile
          </button>
        </div>

        <article className="absolute z-10 mt-6 w-107.5 rounded-[15px] border-3 bg-innerbg p-2">
          <div className="grid grid-cols-[155px_1fr] items-center gap-3">
            <PetCard
              petName={item.petName}
              sex={item.sex}
              imageUrl={item.petPhotoUrl}
              resize={true}
            />

            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                className="flex w-full justify-center rounded-[15px] border bg-white px-3 text-description font-medium text-black"
                onClick={() => setOpenAnswer(true)}
              >
                Review Application Form
              </Button>

              <Button
                type="button"
                className="flex w-full justify-center rounded-[15px] border bg-white px-3 text-description font-medium text-black"
                onClick={() => setOpenMessage(true)}
              >
                Message User
              </Button>

              <Button
                type="button"
                className="flex w-full justify-center rounded-[15px] border bg-white px-3 text-description font-medium text-black"
              >
                Update Adoption Status
              </Button>
            </div>
          </div>
        </article>
      </div>

      <AnswerModal
        isOpen={openAnswer}
        onClose={() => setOpenAnswer(false)}
        answerId={item.id}
      />

      {openMessage && (
        <ComposeView
          isModal
          isOpen={openMessage}
          onClose={() => setOpenMessage(false)}
          mode="new"
          userId={item.applicantId}
          senderSide="shelter"
          senderShelterId={item.shelterId}
          recipients={[
            {
              id: item.applicantId,
              name: item.applicantName,
              image: item.applicantPhotoUrl ?? null,
              subtitle: "Applicant",
              type: "shelter",
            },
          ]}
          lockedRecipient={{
            id: item.applicantId,
            name: item.applicantName,
            image: item.applicantPhotoUrl ?? null,
            subtitle: "Applicant",
            type: "user",
          }}
          lockedSubject={`${item.petName} - Adoption Process`}
        />
      )}
    </>
  );
}
