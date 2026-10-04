"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { replyToThreadAction } from "@/src/app/actions/social";
import { unwrap } from "@/src/lib/actionResult";
import { cn } from "@/src/lib/cn";

const MAX_HEIGHT_PX = 160;

type Props = {
  threadId: string;
  recipientName: string;
  /** Called after a successful send so the thread and inbox can refresh. */
  onSent: () => void;
  className?: string;
};

/**
 * The reply box at the bottom of a thread: grows with the text up to a few lines.
 * Ctrl/Cmd+Enter sends; a failed send keeps the text and offers a retry.
 */
export default function ThreadComposer({ threadId, recipientName, onSent, className }: Props) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Grow with the text, then scroll inside once it reaches the cap
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [body]);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;

    setSending(true);
    setError("");
    try {
      unwrap(await replyToThreadAction(threadId, text));
      setBody("");
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message didn't send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
      className={cn("flex flex-col gap-2 border-t border-line bg-card px-3 py-3 sm:px-4", className)}
    >
      {error ? (
        <p role="alert" className="flex flex-wrap items-center gap-x-2 text-sm text-reject-text">
          {error}
          <button
            type="submit"
            className="cursor-pointer font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </p>
      ) : null}

      <div className="flex items-end gap-2">
        <label htmlFor={`reply-${threadId}`} className="sr-only">
          Message {recipientName}
        </label>
        <textarea
          ref={inputRef}
          id={`reply-${threadId}`}
          rows={1}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={`Message ${recipientName}`}
          className="min-h-12 flex-1 resize-none rounded-xl border border-line bg-ground px-4 py-3 text-base leading-snug text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted hover:border-ink-soft/40 focus:border-ink focus:ring-2 focus:ring-ink/15"
        />
        <button
          type="submit"
          disabled={!body.trim() || sending}
          aria-label={sending ? "Sending" : "Send"}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-sunshine text-ink transition-[background-color,transform] duration-200 ease-out-expo hover:bg-sunshine-deep active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PaperPlaneRight size={22} weight="fill" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
