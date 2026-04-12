import { NextRequest, NextResponse } from "next/server";
import { getShelterApplications } from "@/src/lib/services/adminService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const validStatus =
      status === "pending" ||
      status === "under_review" ||
      status === "approved" ||
      status === "rejected" ||
      status === "all"
        ? status
        : "all";

    const result = await getShelterApplications(validStatus);

    return NextResponse.json(
      {
        ok: result.ok,
        data: result.data ?? [],
        error: result.error,
      },
      { status: result.status },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to load shelter applications.",
      },
      { status: 500 },
    );
  }
}
