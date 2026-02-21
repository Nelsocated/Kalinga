import { NextResponse } from "next/server";
import { getFeed } from "@/lib/services/feed";

export async function GET() {
  try {
    const data = await getFeed();
    return NextResponse.json({ items: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
