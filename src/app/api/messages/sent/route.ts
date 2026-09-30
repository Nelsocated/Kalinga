import {
  getSenderIdentity,
  getSentMessages,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const { side, id } = await getSenderIdentity(await requireAuth());

  return ok(await getSentMessages(side, id));
});
