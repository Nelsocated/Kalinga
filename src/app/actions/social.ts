"use server";

import { z } from "zod";
import { runAction } from "@/src/lib/action";
import { ApiError } from "@/src/lib/api";
import { getUserId, requireAuth } from "@/src/lib/utils/auth";
import { setLikedByUser } from "@/src/lib/services/likeService";
import { createAdoptionRequest } from "@/src/lib/services/adoptionService";
import {
  createMessageThread,
  getSenderIdentity,
  replyToThread,
} from "@/src/lib/services/messageService";

const LikeTargetSchema = z.object({
  targetType: z.enum(["pet", "shelter", "video"], {
    message: "Invalid targetType or targetId",
  }),
  targetId: z.string().min(1, "Invalid targetType or targetId"),
});

const AdoptionRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Valid email is required."),
  phone: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().min(5).optional().or(z.literal("")),
  occupation: z.string().trim().optional().or(z.literal("")),
  reason: z.string().trim().optional().or(z.literal("")),
  confirm_safe: z.boolean().optional().default(false),
  confirm_allergies: z.boolean().optional().default(false),
  confirm_food: z.boolean().optional().default(false),
  confirm_attention: z.boolean().optional().default(false),
  confirm_vet: z.boolean().optional().default(false),
});

// The sender's own id comes from the session; only the recipient is read
// from the input (shelterId when a user writes, userId when a shelter writes).
const ComposeSchema = z.object({
  userId: z.string().optional(),
  shelterId: z.string().optional(),
  subject: z.string().trim().min(1, "subject is required"),
  body: z.string().trim().min(1, "body is required"),
  threadType: z.enum(["general", "adoption"]).optional(),
  adoptionRequestId: z.string().nullish(),
});

const ReplySchema = z.object({
  body: z.string().trim().min(1, "body is required"),
});

async function requireUserId(message: string) {
  const userId = await getUserId();
  if (!userId) throw new ApiError(401, message);
  return userId;
}

export async function setLikeAction(
  target: z.input<typeof LikeTargetSchema>,
  liked: boolean,
) {
  return runAction(async () => {
    const parsed = LikeTargetSchema.parse(target);
    const userId = await requireUserId(
      `You must be logged in to ${liked ? "like" : "unlike"}.`,
    );
    await setLikedByUser({ userId, ...parsed }, liked);
    return { liked };
  });
}

export async function createAdoptionRequestAction(
  petId: string,
  input: z.input<typeof AdoptionRequestSchema>,
) {
  return runAction(async () => {
    const userId = await requireUserId(
      "You must be logged in to submit an adoption request.",
    );
    const parsed = AdoptionRequestSchema.parse(input);
    const row = await createAdoptionRequest({
      ...parsed,
      pet_id: petId,
      user_id: userId,
      phone: parsed.phone || null,
      address: parsed.address || null,
      occupation: parsed.occupation || null,
      reason: parsed.reason || null,
    });
    return { id: row.id };
  });
}

export async function composeMessageAction(input: z.input<typeof ComposeSchema>) {
  return runAction(async () => {
    const sender = await getSenderIdentity(await requireAuth());
    const parsed = ComposeSchema.parse(input);
    const userId = sender.side === "user" ? sender.id : parsed.userId;
    const shelterId = sender.side === "shelter" ? sender.id : parsed.shelterId;
    if (!userId || !shelterId) throw new ApiError(400, "Recipient is required");

    const { thread } = await createMessageThread({
      senderSide: sender.side,
      userId,
      shelterId,
      subject: parsed.subject,
      body: parsed.body,
      threadType: parsed.threadType ?? "general",
      adoptionRequestId: parsed.adoptionRequestId ?? null,
    });
    return { threadId: thread.id };
  });
}

export async function replyToThreadAction(threadId: string, body: string) {
  return runAction(async () => {
    const message = await replyToThread(
      threadId,
      await requireAuth(),
      ReplySchema.parse({ body }).body,
    );
    return { id: message.id };
  });
}
