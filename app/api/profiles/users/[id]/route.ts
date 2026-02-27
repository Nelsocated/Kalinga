import { NextResponse } from "next/server";
import { getUserProfileShelterOnly } from "@/lib/db/profiles";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ✅ unwrap
    const data = await getUserProfileShelterOnly(id);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch user profile" },
      { status: err?.status ?? 500 },
    );
  }
}
