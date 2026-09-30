import { getAdoptionAnswerForViewer } from "@/src/lib/services/adoptionService";
import { requireAuth } from "@/src/lib/utils/auth";
import { handle, ok } from "@/src/lib/api";

type RouteContext = {
  // The adoption request id
  params: Promise<{
    id: string;
  }>;
};

export const GET = handle(async (_req: Request, { params }: RouteContext) => {
  const { id } = await params;
  const caller = await requireAuth();

  return ok(await getAdoptionAnswerForViewer(id, caller.id));
});
