import { NextResponse } from "next/server";
import { getPetStatus } from "@/src/lib/services/adoption/adoptionClient";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, context: { params: Params }) {
  try {
    const { id } = await context.params;

    if (!id?.trim()) {
      return NextResponse.json({ error: "Missing pet id" }, { status: 400 });
    }

    const status = await getPetStatus(id);

    return NextResponse.json(
      {
        ok: true,
        data: {
          status,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/pets/[id]/status] error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch pet status",
      },
      { status: 500 },
    );
  }
}
