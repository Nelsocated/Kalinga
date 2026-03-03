import { NextResponse } from "next/server";
import { getShelterDonations, createShelterDonation } from "@/lib/services/donation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shelterId = searchParams.get("shelter_id");

    if (!shelterId) {
      return NextResponse.json(
        { error: "Missing shelter_id" },
        { status: 400 },
      );
    }

    const data = await getShelterDonations(shelterId);

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch donations" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createShelterDonation(body);

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to create donation" },
      { status: 500 },
    );
  }
}
