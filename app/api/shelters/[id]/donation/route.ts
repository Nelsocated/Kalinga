import { NextResponse } from "next/server";
import {
  getShelterDonations,
  createShelterDonation,
} from "@/lib/services/donationService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id: shelterId } = await params;

    if (!shelterId) {
      return NextResponse.json(
        { error: "Missing shelter id" },
        { status: 400 },
      );
    }

    const data = await getShelterDonations(shelterId);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch donations",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id: shelterId } = await params;

    if (!shelterId) {
      return NextResponse.json(
        { error: "Missing shelter id" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const payload = {
      ...body,
      shelter_id: shelterId,
    };

    const data = await createShelterDonation(payload);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create donation",
      },
      { status: 500 },
    );
  }
}
