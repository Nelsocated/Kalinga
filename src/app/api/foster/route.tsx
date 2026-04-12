import { NextRequest, NextResponse } from "next/server";
import {
  createFoster,
  getFosterStories,
} from "@/src/lib/services/fosterService";

export async function GET() {
  const result = await getFosterStories();

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        details: result.details ?? null,
      },
      { status: result.status },
    );
  }

  return NextResponse.json(
    {
      data: result.data,
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await createFoster({
      petId: body.petId,
      title: body.title,
      description: body.description,
      adoptionStatus: body.adoptionStatus,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details ?? null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: "Foster story created successfully",
        data: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
