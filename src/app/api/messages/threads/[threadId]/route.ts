import {
  getThreadForCaller,
  getThreadMessages,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

export const GET = handle(async (_req: Request, { params }: RouteContext) => {
  const { threadId } = await params;
  const caller = await requireAuth();

  const { thread } = await getThreadForCaller(threadId, caller);
  const messages = await getThreadMessages(threadId);

  return ok({ thread, messages });
});
