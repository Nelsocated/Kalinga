import type { Tables } from "@/src/lib/supabase/database.types";

type MessageThreadType = "general" | "adoption";

export type MessageThread = Tables<"message_threads">;

export type Message = Tables<"messages">;

export type PersonCard = {
  id: string;
  name: string;
  image: string | null;
  subtitle?: string | null;
};

export type ShelterMailboxFilter =
  | "inbox"
  | "contacting_applicant"
  | "decision"
  | "final_outcome";

export type CreateMessageThreadInput = {
  userId: string;
  shelterId: string;
  subject: string;
  body: string;
  threadType?: MessageThreadType;
  adoptionRequestId?: string | null;
  senderSide: "user" | "shelter";
};

export type ThreadWithMeta = MessageThread & {
  pet_id?: string | null;
  adoption_status: string | null;
  adoption_request_id?: string | null;
  last_message_preview: string | null;
  /** The newest message came from the other side and the viewer hasn't opened it. */
  unread?: boolean;
  other_party?: PersonCard | null; // optional — filled in by page, not service
};

export type ThreadResponse = {
  thread: ThreadWithMeta;
  messages: Message[];
};

export type ComposeRecipient = {
  id: string;
  name: string;
  image: string | null;
  subtitle: string | null;
  type: "user" | "shelter";
};
