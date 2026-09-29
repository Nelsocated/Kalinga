import { NextResponse } from "next/server";
import {
  getSenderIdentity,
  getShelterInboxThreads,
  getUserInboxThreads,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

export async function GET() {
  try {
    const caller = await requireAuth();
    const { side, id } = await getSenderIdentity(caller);

    const threads =
      side === "shelter"
        ? await getShelterInboxThreads(id)
        : await getUserInboxThreads(id);

    return NextResponse.json({ data: threads }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
