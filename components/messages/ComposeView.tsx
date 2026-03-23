"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/lib/constants/assests";

type Shelter = {
  id: string;
  logo_url: string | null;
  name: string;
  location: string | null;
};

type Props = {
  isModal?: boolean;
  isOpen?: boolean;
  shelters: Shelter[];
  mode: "new" | "reply";
  lockedShelter?: Shelter | null;
  lockedSubject?: string;
  lockedThreadId?: string;
  onClose?: () => void;
  onCreated?: (threadId: string) => void;
  userId: string;
};

export default function ComposeView({
  isModal = false,
  isOpen = true,
  shelters,
  mode,
  lockedShelter,
  lockedSubject = "",
  lockedThreadId,
  onClose,
  onCreated,
  userId,
}: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [shelterId, setShelterId] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedShelter = shelters.find((s) => s.id === shelterId);

  useEffect(() => {
    if (mode === "reply") {
      setSubject(lockedSubject);
      setShelterId(lockedShelter?.id || "");
    } else {
      setSubject("");
      setShelterId("");
    }

    setBody("");
    setError("");
  }, [mode, lockedSubject, lockedShelter]);

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

    if (mode === "new" && !shelterId) {
      setError("Please select a shelter.");
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
        const res = await fetch("/api/messages/user/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: lockedThreadId,
            body,
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
        const res = await fetch("/api/messages/user/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            shelterId,
            subject,
            body,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        onCreated?.(data.data.thread.id);
      }

      setBody("");
      setSubject("");
      setShelterId("");
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
          {mode === "reply" ? "Reply" : "New Message"}
        </h2>
      </div>

      {mode !== "reply" ? (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-sm font-semibold text-black">
              To:
            </span>

            <div ref={dropdownRef} className="relative min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-sm text-black"
              >
                {selectedShelter ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="overflow-hidden rounded-full">
                      <Image
                        src={selectedShelter.logo_url || DEFAULT_AVATAR_URL}
                        alt={selectedShelter.name || "unknown shelter"}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-cover"
                      />
                    </div>

                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-semibold text-black">
                        {selectedShelter.name}
                      </p>
                      {selectedShelter.location ? (
                        <p className="truncate text-xs text-neutral-500">
                          {selectedShelter.location}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">
                    Select a shelter
                  </span>
                )}

                <span className="ml-3 shrink-0 text-xs text-neutral-500">
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {open ? (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                  {shelters.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-neutral-500">
                      No shelters available
                    </div>
                  ) : (
                    shelters.map((shelter) => {
                      const isSelected = shelterId === shelter.id;

                      return (
                        <button
                          key={shelter.id}
                          type="button"
                          onClick={() => {
                            setShelterId(shelter.id);
                            setOpen(false);
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-neutral-100 ${
                            isSelected ? "bg-background" : "bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="overflow-hidden rounded-full">
                              <Image
                                src={shelter.logo_url || DEFAULT_AVATAR_URL}
                                alt={shelter.name}
                                width={28}
                                height={28}
                                className="h-7 w-7 object-cover"
                              />
                            </div>

                            <div className="min-w-0 leading-tight">
                              <p className="truncate text-sm font-semibold text-black">
                                {shelter.name}
                              </p>
                              {shelter.location ? (
                                <p className="truncate text-xs text-neutral-500">
                                  {shelter.location}
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

          {error && !shelterId ? (
            <p className="mt-2 pl-10 text-xs text-red-500">
              Please select a shelter.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-sm font-semibold text-black">
              To:
            </span>

            <div className="flex min-w-0 items-center gap-2">
              <div className="overflow-hidden rounded-full">
                <Image
                  src={lockedShelter?.logo_url || DEFAULT_AVATAR_URL}
                  alt={lockedShelter?.name || "unknown shelter"}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-cover"
                />
              </div>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold text-black">
                  {lockedShelter?.name}
                </p>
                {lockedShelter?.location ? (
                  <p className="truncate text-xs text-neutral-500">
                    {lockedShelter.location}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">Subject:</span>
          <input
            value={subject}
            readOnly={mode === "reply"}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="flex-1 bg-transparent text-lg font-semibold text-black outline-none placeholder:text-neutral-400"
          />
        </div>

        {error && !subject.trim() ? (
          <p className="mt-2 text-xs text-red-500">Subject is required.</p>
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
          <p className="mt-2 text-xs text-red-500">Message body is required.</p>
        ) : null}

        <div className="mt-6 flex justify-center gap-2">
          {isModal ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-[15px] border px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-neutral-100"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="rounded-[15px] border bg-background px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-[#FFE27A] disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      {content}
    </div>
  );
}
