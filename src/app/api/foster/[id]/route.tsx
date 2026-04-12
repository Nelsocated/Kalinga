import { NextRequest, NextResponse } from "next/server";
import {
  deleteFoster,
  getFosterStoryById,
  updateFoster,
} from "@/src/lib/services/fosterService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await getFosterStoryById(id);

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const result = await updateFoster({
      id,
      title: body.title,
      description: body.description,
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
        message: "Foster story updated successfully",
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await deleteFoster(id);

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
      message: "Foster story deleted successfully",
      data: result.data,
    },
    { status: result.status },
  );
}
