"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/src/lib/constants/assests";
import Button from "../ui/Button";

type RecipientOption = {
  id: string;
  name: string;
  image: string | null;
  subtitle?: string | null;
  type: "user" | "shelter";
};

type Props = {
  isModal?: boolean;
  isOpen?: boolean;
  recipients: RecipientOption[];
  mode: "new" | "reply";
  adoptionRequestId?: string;
  lockedRecipient?: RecipientOption | null;
  lockedSubject?: string;
  lockedThreadId?: string;
  headerTitle?: string;
  onClose?: () => void;
  onCreated?: (threadId: string) => void;
  userId: string;
  senderSide: "user" | "shelter";
  senderShelterId?: string;
};

export default function ComposeView({
  isModal = false,
  isOpen = true,
  recipients,
  mode,
  lockedRecipient,
  lockedSubject = "",
  lockedThreadId,
  headerTitle,
  onClose,
  onCreated,
  userId,
  senderSide,
  senderShelterId,
  adoptionRequestId,
}: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedRecipient =
    recipients.find((r) => r.id === recipientId) ?? null;

  const currentToRecipient =
    mode === "reply" ? lockedRecipient : (lockedRecipient ?? selectedRecipient);

  useEffect(() => {
    if (mode === "reply") {
      setSubject(lockedSubject);
      setRecipientId(lockedRecipient?.id || "");
    } else {
      setSubject(lockedSubject || "");
      setRecipientId(lockedRecipient?.id || "");
    }

    setBody("");
    setError("");
    setOpen(false);
  }, [mode, lockedSubject, lockedRecipient]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function send() {
    setError("");

    const currentRecipient =
      lockedRecipient ??
      (mode === "reply" ? lockedRecipient : selectedRecipient);

    if (!currentRecipient) {
      setError("Please select a recipient.");
      return;
    }

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!body.trim()) {
      setError("Message body is required.");
      return;
    }

    setSending(true);

    try {
      if (mode === "reply") {
        const res = await fetch("/api/messages/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: lockedThreadId,
            body,
            senderSide,
            senderShelterId: senderSide === "shelter" ? senderShelterId : null,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Failed to reply");
        }

        if (lockedThreadId) {
          onCreated?.(lockedThreadId);
        }
      } else {
        let payload:
          | {
              senderSide: "user";
              userId: string;
              shelterId: string;
              subject: string;
              body: string;
            }
          | {
              senderSide: "shelter";
              userId: string;
              shelterId: string;
              subject: string;
              body: string;
            };

        if (senderSide === "user" && currentRecipient.type === "shelter") {
          payload = {
            senderSide: "user",
            userId,
            shelterId: currentRecipient.id,
            subject: subject.trim(),
            body: body.trim(),
          };
        } else if (
          senderSide === "shelter" &&
          currentRecipient.type === "user"
        ) {
          if (!senderShelterId) {
            throw new Error("Missing sender shelter id.");
          }

          const isAdoptionThread =
            senderSide === "shelter" && Boolean(adoptionRequestId);

          payload = {
            senderSide: "shelter",
            userId: currentRecipient.id,
            shelterId: senderShelterId,
            subject: subject.trim(),
            body: body.trim(),
            ...(isAdoptionThread && {
              threadType: "adoption",
              adoptionRequestId,
            }),
          };
        } else {
          throw new Error("Invalid recipient for this sender side.");
        }

        const res = await fetch("/api/messages/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Failed to send message");
        }

        onCreated?.(data?.data?.thread?.id);
      }

      setBody("");
      setSubject(mode === "reply" ? lockedSubject : "");
      setRecipientId(mode === "reply" ? lockedRecipient?.id || "" : "");
      setOpen(false);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setSending(false);
    }
  }

  const content = (
    <div className="flex max-h-175 w-full max-w-xl flex-col overflow-hidden rounded-[15px] border bg-white">
      <div className="bg-primary px-4 py-3">
        <h2 className="text-xl font-extrabold text-black">
          {headerTitle
            ? headerTitle
            : mode === "reply"
              ? "Reply"
              : "New Message"}
        </h2>
      </div>

      {mode === "reply" || lockedRecipient ? (
        <div className="border-b px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-description font-semibold text-black">
              To:
            </span>

            <div className="flex min-w-0 items-center gap-2">
              <div className="overflow-hidden rounded-full">
                <Image
                  src={currentToRecipient?.image || DEFAULT_AVATAR_URL}
                  alt={currentToRecipient?.name || "unknown recipient"}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-cover"
                />
              </div>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-description font-semibold text-black">
                  {currentToRecipient?.name ?? "Unknown"}
                </p>
                {currentToRecipient?.subtitle ? (
                  <p className="truncate text-small text-neutral-500">
                    {currentToRecipient.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-description font-semibold text-black">
              To:
            </span>

            <div ref={dropdownRef} className="relative min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-description text-black"
              >
                {selectedRecipient ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="overflow-hidden rounded-full">
                      <Image
                        src={selectedRecipient.image || DEFAULT_AVATAR_URL}
                        alt={selectedRecipient.name || "unknown recipient"}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-cover"
                      />
                    </div>

                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-description font-semibold text-black">
                        {selectedRecipient.name}
                      </p>
                      {selectedRecipient.subtitle ? (
                        <p className="truncate text-small text-neutral-500">
                          {selectedRecipient.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <span className="text-description text-neutral-400">
                    Select a recipient
                  </span>
                )}

                <span className="ml-3 shrink-0 text-small text-neutral-500">
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {open ? (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto scroll-stable rounded-md border bg-white shadow-lg">
                  {recipients.length === 0 ? (
                    <div className="px-3 py-1 text-description text-neutral-500">
                      No recipients available
                    </div>
                  ) : (
                    recipients.map((recipient) => {
                      const isSelected = recipientId === recipient.id;

                      return (
                        <button
                          key={recipient.id}
                          type="button"
                          onClick={() => {
                            setRecipientId(recipient.id);
                            setOpen(false);
                          }}
                          className={`block w-full px-3 py-1 text-left text-description transition hover:bg-neutral-100 ${
                            isSelected ? "bg-background" : "bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="overflow-hidden rounded-full">
                              <Image
                                src={recipient.image || DEFAULT_AVATAR_URL}
                                alt={recipient.name}
                                width={28}
                                height={28}
                                className="h-7 w-7 object-cover"
                              />
                            </div>

                            <div className="min-w-0 leading-tight">
                              <p className="truncate text-description font-semibold text-black">
                                {recipient.name}
                              </p>
                              {recipient.subtitle ? (
                                <p className="truncate text-small text-neutral-500">
                                  {recipient.subtitle}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {error && !currentToRecipient ? (
            <p className="mt-2 pl-10 text-small text-red-500">
              Please select a recipient.
            </p>
          ) : null}
        </div>
      )}

      <div className="border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-description font-semibold text-black">
            Subject:
          </span>
          <input
            value={subject}
            readOnly={mode === "reply"}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="flex-1 bg-transparent text-description font-semibold text-black outline-none placeholder:text-neutral-400"
          />
        </div>

        {error && !subject.trim() ? (
          <p className="mt-2 text-small text-red-500">Subject is required.</p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start typing your message..."
          className="min-h-65 flex-1 resize-none bg-transparent text-black outline-none placeholder:text-neutral-400"
        />

        {error && !body.trim() ? (
          <p className="mt-2 text-small text-red-500">
            Message body is required.
          </p>
        ) : null}

        <div className="mt-6 flex justify-center gap-2">
          {isModal ? (
            <Button
              type="button"
              onClick={onClose}
              className="hover:scale-105  rounded-[15px] border px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-neutral-100"
            >
              Cancel
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={send}
            disabled={sending}
            className="hover:scale-105  rounded-[15px] border bg-background px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-[#FFE27A] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (!isModal) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {content}
    </div>
  );
}
