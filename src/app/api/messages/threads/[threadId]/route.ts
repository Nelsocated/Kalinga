import { NextResponse } from "next/server";
import {
  getThreadForCaller,
  getThreadMessages,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

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
