"use client";

import { useId, useState } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Modal from "../ui/Modal";
import { unwrap } from "@/src/lib/actionResult";
import { composeMessageAction } from "@/src/app/actions/social";

type RecipientOption = {
  id: string;
  name: string;
  image: string | null;
  subtitle?: string | null;
  type: "user" | "shelter";
};

type Props = {
  /** Kept for existing callers; compose always opens as a dialog. */
  isModal?: boolean;
  isOpen?: boolean;
  recipients: RecipientOption[];
  /** Kept for existing callers; replies happen in the thread's own reply box. */
  mode?: "new";
  adoptionRequestId?: string;
  lockedRecipient?: RecipientOption | null;
  lockedSubject?: string;
  headerTitle?: string;
  onClose?: () => void;
  onCreated?: (threadId: string) => void;
  /** Unused: the server takes the sender from the session. */
  userId?: string;
  senderSide: "user" | "shelter";
  senderShelterId?: string;
};

/** A new message (a new conversation), in a dialog. */
export default function ComposeView({
  isOpen = true,
  recipients,
  lockedRecipient,
  lockedSubject = "",
  headerTitle,
  onClose,
  onCreated,
  senderSide,
  adoptionRequestId,
}: Props) {
  const formId = useId();
  const [subject, setSubject] = useState(lockedSubject);
  const [body, setBody] = useState("");
  const [recipientId, setRecipientId] = useState(lockedRecipient?.id ?? "");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const recipient = lockedRecipient ?? recipients.find((r) => r.id === recipientId) ?? null;

  function close() {
    setError("");
    onClose?.();
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!recipient) return setError("Choose who to send this to.");
    if (!subject.trim()) return setError("Add a subject.");
    if (!body.trim()) return setError("Write a message first.");

    setSending(true);
    try {
      const { threadId } = unwrap(
        await composeMessageAction({
          ...(senderSide === "user" ? { shelterId: recipient.id } : { userId: recipient.id }),
          subject: subject.trim(),
          body: body.trim(),
          ...(senderSide === "shelter" && adoptionRequestId
            ? { threadType: "adoption" as const, adoptionRequestId }
            : {}),
        }),
      );
      onCreated?.(threadId);

      setBody("");
      setSubject(lockedSubject);
      setRecipientId(lockedRecipient?.id ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your message. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={headerTitle ?? "New message"}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={sending}>
            Send
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={send} className="flex flex-col gap-4">
        {lockedRecipient ? (
          <div className="flex items-center gap-3 rounded-md border border-line bg-ground px-3 py-2.5">
            <span className="text-sm text-muted">To</span>
            <Avatar src={lockedRecipient.image} name={lockedRecipient.name} size={28} />
            <span className="min-w-0 truncate text-sm font-semibold text-ink">{lockedRecipient.name}</span>
          </div>
        ) : recipients.length === 0 ? (
          <p className="rounded-md bg-sunshine-wash px-3 py-2.5 text-sm text-ink">
            {senderSide === "user"
              ? "Like a shelter first, then you can message it here."
              : "There's no one to message yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">To</span>
            <Select
              aria-label="Recipient"
              value={recipientId}
              onChange={setRecipientId}
              options={[
                ...(recipientId ? [] : [{ value: "", label: "Choose a recipient" }]),
                ...recipients.map((r) => ({
                  value: r.id,
                  label: r.name,
                  icon: <Avatar src={r.image} name={r.name} size={24} />,
                })),
              ]}
            />
          </div>
        )}

        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={7} required />

        {error ? (
          <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
