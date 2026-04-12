import { NextResponse } from "next/server";
import { getUserSentMessages } from "@/src/lib/services/messageService";
import { getUserId } from "@/src/lib/utils/getUserId";

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await getUserSentMessages(userId);

    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("[GET sent messages]", error);
    return NextResponse.json(
      { error: "Failed to fetch sent messages" },
      { status: 500 },
    );
  }
}
