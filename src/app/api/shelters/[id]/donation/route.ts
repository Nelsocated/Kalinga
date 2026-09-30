import { getShelterDonations } from "@/src/lib/services/donationService";
import { handle, ok } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = handle(async (_req: Request, { params }: RouteContext) => {
  const { id: shelterId } = await params;

  return ok(await getShelterDonations(shelterId));
});
