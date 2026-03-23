import { NextResponse } from "next/server";
import { getUserSentMessages } from "@/lib/services/messageService";
import { getUserId } from "@/lib/utils/getUserId";
import { fetchShelterById } from "@/lib/services/shelterService";

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await getUserSentMessages(userId);

    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const shelter = msg.shelter_id
          ? await fetchShelterById(msg.shelter_id)
          : null;

        return {
          id: msg.id,
          subject: msg.subject,
          body: msg.body,
          created_at: msg.created_at,
          receiver: {
            id: msg.shelter_id,
            name: shelter?.shelter_name || "Shelter",
            image: shelter?.logo_url || null,
          },
        };
      }),
    );

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("[GET sent messages]", error);

    return NextResponse.json(
      { error: "Failed to fetch sent messages" },
      { status: 500 },
    );
  }
}
