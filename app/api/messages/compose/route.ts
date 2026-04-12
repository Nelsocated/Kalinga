import { NextResponse } from "next/server";
import { safeCreateMessageThread } from "@/lib/services/messageService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

type CreateThreadBody = {
  senderSide: "user" | "shelter";
  userId: string; // applicant's user ID
  shelterId: string;
  subject: string;
  body: string;
  threadType?: "general" | "adoption";
  adoptionRequestId?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateThreadBody;

    if (
      !body.userId ||
      !body.shelterId ||
      !body.subject?.trim() ||
      !body.body?.trim() ||
      !body.senderSide
    ) {
      return NextResponse.json(
        {
          error:
            "userId, shelterId, senderSide, subject, and body are required",
        },
        { status: 400 },
      );
    }

    const result = await safeCreateMessageThread({
      userId: body.userId,
      shelterId: body.shelterId,
      subject: body.subject.trim(),
      body: body.body.trim(),
      threadType: body.threadType ?? "general",
      adoptionRequestId: body.adoptionRequestId ?? null,
      senderSide: body.senderSide, // ← pass through instead of hardcoding
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("[POST /api/messages/compose]", error);

    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    if (
      message.includes("only create a user thread for yourself") ||
      message.includes("do not own this shelter") ||
      message.includes("Unauthorized")
    ) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
