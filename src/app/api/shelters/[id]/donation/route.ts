import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getShelterDonations,
  createShelterDonation,
} from "@/src/lib/services/donationService";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { ApiError, errorResponse } from "@/src/lib/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const CreateDonationSchema = z.object({
  type: z.enum(["goods", "monetary"]),
  instruction_note: z.string().trim().nullish(),
  item_name: z.array(z.string().trim()).nullish(),
  method: z.string().trim().nullish(),
  account_name: z.string().trim().nullish(),
  account_number: z.string().trim().nullish(),
  qr_url: z.string().trim().nullish(),
  is_active: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: shelterId } = await params;

    const data = await getShelterDonations(shelterId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id: shelterId } = await params;
    const ownShelterId = await requireOwnedShelterId();

    if (ownShelterId !== shelterId) {
      throw new ApiError(403, "You can only add donations to your own shelter");
    }

    const input = CreateDonationSchema.parse(await req.json());
    const data = await createShelterDonation(shelterId, input);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
