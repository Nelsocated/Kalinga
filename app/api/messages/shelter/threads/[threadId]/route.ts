import { NextResponse } from "next/server";
import {
  getThreadById,
  getThreadMessages,
  safeReplyToThread,
} from "@/lib/services/messageService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

type ReplyBody = {
  body: string;
  senderShelterId?: string;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { threadId } = await params;

    const thread = await getThreadById(threadId);

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const messages = await getThreadMessages(threadId);

    return NextResponse.json(
      {
        data: {
          thread,
          messages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { threadId } = await params;
    const body = (await req.json()) as ReplyBody;

    if (!body.body?.trim()) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    const message = await safeReplyToThread({
      threadId,
      body: body.body,
      senderSide: "shelter",
      senderShelterId: body.senderShelterId,
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
