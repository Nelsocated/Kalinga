type MessageThreadType = "general" | "adoption";

export type MessageThread = {
  id: string;
  user_id: string;
  shelter_id: string;
  adoption_request_id: string | null;
  thread_type: MessageThreadType;
  subject: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_user_id: string | null;
  sender_shelter_id: string | null;
  body: string;
  created_at: string;
  read_by_user: boolean;
  read_by_shelter: boolean;
};

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
