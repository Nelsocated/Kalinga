import { getPetAdoptionStatus } from "@/src/lib/services/adoptionService";
import { handle, ok } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = handle(async (_req: Request, { params }: RouteContext) => {
  const { id: petId } = await params;

  return ok(await getPetAdoptionStatus(petId));
});
