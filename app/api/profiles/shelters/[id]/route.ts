import { NextResponse } from "next/server";
import { getShelterProfile } from "@/lib/db/profiles";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ✅ unwrap
    const data = await getShelterProfile(id);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch shelter profile" },
      { status: err?.status ?? 500 },
    );
  }
}
