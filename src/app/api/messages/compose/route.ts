import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createMessageThread,
  getSenderIdentity,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

// The sender's own id comes from the session; only the recipient is read
// from the body (shelterId when a user writes, userId when a shelter writes).
const ComposeSchema = z.object({
  userId: z.string().optional(),
  shelterId: z.string().optional(),
  subject: z.string().trim().min(1, "subject is required"),
  body: z.string().trim().min(1, "body is required"),
  threadType: z.enum(["general", "adoption"]).optional(),
  adoptionRequestId: z.string().nullish(),
});

export async function POST(req: Request) {
  try {
    const caller = await requireAuth();
    const sender = await getSenderIdentity(caller);
    const input = ComposeSchema.parse(await req.json());

    const userId = sender.side === "user" ? sender.id : input.userId;
    const shelterId = sender.side === "shelter" ? sender.id : input.shelterId;

    if (!userId || !shelterId) throw new ApiError(400, "Recipient is required");

    const data = await createMessageThread({
      senderSide: sender.side,
      userId,
      shelterId,
      subject: input.subject,
      body: input.body,
      threadType: input.threadType ?? "general",
      adoptionRequestId: input.adoptionRequestId ?? null,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
