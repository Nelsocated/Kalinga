// app/api/signup/route.ts
import { NextResponse } from "next/server";

let users: any[] = [];

export async function POST(req: Request) {
  const data = await req.json();

  users.push(data);

  return NextResponse.json({
    message: "Account created successfully!",
    users,
  });
}
