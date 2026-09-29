import { NextRequest, NextResponse } from "next/server";
import { getShelterApplications } from "@/src/lib/services/adminService";
import { requireAdmin } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const status = req.nextUrl.searchParams.get("status");

    const validStatus =
      status === "under_review" ||
      status === "approved" ||
      status === "rejected" ||
      status === "all"
        ? status
        : "all";

    const data = await getShelterApplications(validStatus);

    return NextResponse.json({ ok: true, data, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
