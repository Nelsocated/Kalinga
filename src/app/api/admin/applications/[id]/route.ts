import { NextRequest, NextResponse } from "next/server";
import {
  getShelterApplicationById,
  updateShelterApplicationStatus,
} from "@/src/lib/services/adminService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const result = await getShelterApplicationById(id);

    return NextResponse.json(
      {
        ok: result.ok,
        data: result.data,
        error: result.error,
      },
      { status: result.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch shelter application.",
      },
      { status: 500 },
    );
  }
}

type PatchBody = {
  status?: "under_review" | "approved" | "rejected";
  reviewNote?: string | null;
  reviewedBy?: string | null;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await req.json()) as PatchBody;

    if (
      body.status !== "under_review" &&
      body.status !== "approved" &&
      body.status !== "rejected"
    ) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          error: "Valid status is required.",
        },
        { status: 400 },
      );
    }

    const result = await updateShelterApplicationStatus({
      id,
      status: body.status,
      reviewNote: body.reviewNote ?? null,
      reviewedBy: body.reviewedBy ?? null,
    });

    return NextResponse.json(
      {
        ok: result.ok,
        data: result.data,
        error: result.error,
      },
      { status: result.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update shelter application.",
      },
      { status: 500 },
    );
  }
}
