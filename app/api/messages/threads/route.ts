import { NextResponse } from "next/server";
import {
  getUserInboxThreads,
  getShelterInboxThreads,
} from "@/lib/services/messageService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const shelterId = searchParams.get("shelterId");

    if (shelterId) {
      const threads = await getShelterInboxThreads(shelterId);
      return NextResponse.json({ data: threads }, { status: 200 });
    }

    if (userId) {
      const threads = await getUserInboxThreads(userId);
      return NextResponse.json({ data: threads }, { status: 200 });
    }

    return NextResponse.json(
      { error: "userId or shelterId is required" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
