import { NextResponse } from "next/server";
import { getAdoptionAnswerForViewer } from "@/src/lib/services/adoptionService";
import { requireAuth } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

type RouteContext = {
  // The adoption request id
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const caller = await requireAuth();

    const data = await getAdoptionAnswerForViewer(id, caller.id);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
