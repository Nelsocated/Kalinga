import { getSenderIdentity } from "@/src/lib/services/messages/threads";
import { getSentMessages } from "@/src/lib/services/messages/sent";
import { requireAuth } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const { side, id } = await getSenderIdentity(await requireAuth());

  return ok(await getSentMessages(side, id));
});
