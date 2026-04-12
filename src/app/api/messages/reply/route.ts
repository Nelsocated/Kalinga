import { NextResponse } from "next/server";
import { createServerSupabase } from "@/src/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId, body } = await req.json();

    if (!threadId || !body?.trim()) {
      return NextResponse.json(
        { error: "threadId and body required" },
        { status: 400 },
      );
    }

    // insert message INTO EXISTING THREAD
    const { error } = await supabase.from("messages").insert({
      thread_id: threadId,
      sender_user_id: data.user.id,
      body,
      read_by_user: true,
      read_by_shelter: false,
    });

    if (error) throw error;

    // update thread timestamp
    await supabase
      .from("message_threads")
      .update({
        last_message_at: new Date().toISOString(),
      })
      .eq("id", threadId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reply]", err);
    return NextResponse.json({ error: "Failed to reply" }, { status: 500 });
  }
}
