import { NextResponse } from "next/server";
import { getPetProfile } from "@/lib/db/profiles";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const data = await getPetProfile(id);
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch pet profile" },
      { status: err?.status ?? 500 },
    );
  }
}
