import { NextResponse } from "next/server";
import { safeCreateMessageThread } from "@/lib/services/messageService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

type CreateShelterThreadBody = {
  userId: string;
  shelterId: string;
  subject: string;
  body: string;
  threadType?: "general" | "adoption";
  adoptionRequestId?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateShelterThreadBody;

    if (
      !body.userId ||
      !body.shelterId ||
      !body.subject?.trim() ||
      !body.body?.trim()
    ) {
      return NextResponse.json(
        { error: "userId, shelterId, subject, and body are required" },
        { status: 400 },
      );
    }

    const result = await safeCreateMessageThread({
      userId: body.userId,
      shelterId: body.shelterId,
      subject: body.subject,
      body: body.body,
      threadType: body.threadType ?? "general",
      adoptionRequestId: body.adoptionRequestId ?? null,
      senderSide: "shelter",
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
