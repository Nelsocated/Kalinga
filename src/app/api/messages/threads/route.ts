import {
  getSenderIdentity,
  getShelterInboxThreads,
  getUserInboxThreads,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

export const GET = handle(async () => {
  const { side, id } = await getSenderIdentity(await requireAuth());

  return ok(
    side === "shelter"
      ? await getShelterInboxThreads(id)
      : await getUserInboxThreads(id),
  );
});
