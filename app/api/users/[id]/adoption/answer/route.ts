import { NextResponse } from "next/server";
import { getAdoptionAnswerById } from "@/lib/services/adoption/adoptionService";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "Answer id is required." },
        { status: 400 },
      );
    }

    const data = await getAdoptionAnswerById(id);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
