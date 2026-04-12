"use client";

import Image from "next/image";
import type { ThreadWithMeta } from "@/src/lib/types/messages";
import { ListSkeleton } from "@/src/app/shelter/messages/loading";
import type { PetStatusFull } from "@/src/lib/types/adoptionRequests";

type Props = {
  threads: ThreadWithMeta[];
  selectedThreadId: string | null;
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  withStatus?: boolean;
};

export default function ThreadList({
  threads,
  selectedThreadId,
  loading,
  onSelectThread,
  withStatus = false,
}: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="w-full border-b-2 px-5 text-center text-title font-semibold text-black">
        Messages Received
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-stable">
        {loading ? (
          <ListSkeleton header={false} />
        ) : threads.length === 0 ? (
          <div className="p-4 text-description text-neutral-500">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-2 px-1 py-3">
            {threads.map((thread) => {
              const isActive = selectedThreadId === thread.id;
              const otherPartyName = thread.other_party?.name || "Shelter";
              const otherPartyImage = thread.other_party?.image || null;
              const status = withStatus
                ? (thread.adoption_status as PetStatusFull | null)
                : null;

              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => onSelectThread(thread.id)}
                  className={`relative w-full rounded-[15px] border py-2 pl-5 pr-4 text-left transition ${
                    isActive
                      ? "border bg-background"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  {withStatus && (
                    <div
                      className={`absolute left-0 top-0 h-full w-2 rounded-l-[15px] ${getStatusColor(
                        status,
                      )}`}
                    />
                  )}

                  <div className="flex items-start gap-2">
                    <Avatar name={otherPartyName} image={otherPartyImage} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-description font-bold text-black">
                            {otherPartyName}
                          </p>
                          <p className="truncate text-small text-neutral-500">
                            {thread.subject}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-small text-neutral-500">
                            {formatShortDate(thread.last_message_at)}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-small text-neutral-600">
                        {thread.last_message_preview || "No preview available"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={30}
        height={30}
        className="h-10 w-10 rounded-full border object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-neutral-100 text-small font-semibold text-neutral-600">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function getStatusColor(status: PetStatusFull | null) {
  switch (status) {
    case "pending":
      return "submitted";
    case "under_review":
      return "bg-under_review";
    case "contacting_applicant":
      return "bg-contacting";
    case "approved":
      return "bg-approved";
    case "not_approved":
      return "bg-reject";
    case "adopted":
      return "bg-adopted";
    case "withdrawn":
      return "bg-withdrawn";
    default:
      return "bg-transparent";
  }
}

export function formatShortDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
