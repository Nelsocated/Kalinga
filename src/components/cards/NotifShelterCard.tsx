"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatCircle, ClipboardText } from "@phosphor-icons/react";
import type { ShelterNotifItem } from "../../app/shelter/notification/NotifShelter";
import AnswerModal from "../modal/AnswerModal";
import ComposeView from "../views/ComposeView";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import SexIcon from "../ui/SexIcon";
import StatusChip from "../ui/StatusChip";

type Props = {
  item: ShelterNotifItem;
};

/** One incoming adoption application with review and message actions. */
export default function NotifShelterCard({ item }: Props) {
  const [openAnswer, setOpenAnswer] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  return (
    <>
      <article className="flex flex-col gap-4 rounded-lg border border-line bg-card p-4">
        <div className="flex items-start gap-3">
          <Avatar src={item.petPhotoUrl} name={item.petName} size={56} className="rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="truncate">{item.petName}</span>
              <SexIcon sex={item.sex} size={16} />
            </p>
            <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
              <Avatar src={item.applicantPhotoUrl} name={item.applicantName} size={20} />
              {item.applicantId ? (
                <Link href={`/site/profiles/user/${item.applicantId}`} className="truncate underline-offset-4 hover:underline">
                  {item.applicantName}
                </Link>
              ) : (
                <span className="truncate">{item.applicantName}</span>
              )}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StatusChip status={item.status} />
              {item.date ? <span className="text-xs text-muted">{item.date}</span> : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpenAnswer(true)} icon={<ClipboardText aria-hidden="true" />}>
            Review application
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpenMessage(true)} icon={<ChatCircle aria-hidden="true" />}>
            Message
          </Button>
        </div>
      </article>

      <AnswerModal isOpen={openAnswer} onClose={() => setOpenAnswer(false)} answerId={item.id} />

      {openMessage ? (
        <ComposeView
          isOpen={openMessage}
          onClose={() => setOpenMessage(false)}
          onCreated={() => setOpenMessage(false)}
          mode="new"
          senderSide="shelter"
          recipients={[]}
          lockedRecipient={{
            id: item.applicantId,
            name: item.applicantName,
            image: item.applicantPhotoUrl ?? null,
            subtitle: "Applicant",
            type: "user",
          }}
          lockedSubject={`${item.petName}: your adoption application`}
          adoptionRequestId={item.id}
        />
      ) : null}
    </>
  );
}
