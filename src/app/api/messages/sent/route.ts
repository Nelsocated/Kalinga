import { NextResponse } from "next/server";
import {
  getSenderIdentity,
  getSentMessages,
} from "@/src/lib/services/messageService";
import { requireAuth } from "@/src/lib/utils/auth";
import { errorResponse } from "@/src/lib/api";

export async function GET() {
  try {
    const caller = await requireAuth();
    const { side, id } = await getSenderIdentity(caller);

    const messages = await getSentMessages(side, id);

    return NextResponse.json({ data: messages });
  } catch (error) {
    return errorResponse(error);
  }
}
