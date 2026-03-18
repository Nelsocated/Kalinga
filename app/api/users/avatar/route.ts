import { NextResponse } from "next/server";
import { uploadMyAvatar } from "@/lib/services/user/usersService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 },
      );
    }

    const photoUrl = await uploadMyAvatar(file);

    return NextResponse.json(
      { data: { photo_url: photoUrl } },
      { status: 201 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
