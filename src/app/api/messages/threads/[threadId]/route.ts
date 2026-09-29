import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getThreadForCaller,
  getThreadMessages,
  replyToThread,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

const ReplySchema = z.object({
  body: z.string().trim().min(1, "body is required"),
});

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { threadId } = await params;
    const caller = await requireAuth();

    const { thread } = await getThreadForCaller(threadId, caller);
    const messages = await getThreadMessages(threadId);

    return NextResponse.json({ data: { thread, messages } }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { threadId } = await params;
    const caller = await requireAuth();
    const { body } = ReplySchema.parse(await req.json());

    const message = await replyToThread(threadId, caller, body);

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
