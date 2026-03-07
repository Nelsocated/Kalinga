import { NextResponse } from "next/server";
import { getUserProfileById } from "@/lib/db/profiles";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await getUserProfileById(id);

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch user profile" },
      { status: err?.status ?? 500 },
    );
  }
}
