import { NextRequest, NextResponse } from "next/server";
import { getLongestPets } from "@/lib/services/longest";
import { getFosterStories } from "@/lib/services/foster";

function toPositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const longestLimit = toPositiveInt(searchParams.get("longestLimit"), 10);
  const fosterLimit = toPositiveInt(searchParams.get("fosterLimit"), 20);

  const [longestResult, fosterResult] = await Promise.allSettled([
    getLongestPets(longestLimit),
    getFosterStories(fosterLimit),
  ]);

  const longest =
    longestResult.status === "fulfilled" ? longestResult.value : [];
  const foster = fosterResult.status === "fulfilled" ? fosterResult.value : [];

  const errors: Record<string, string> = {};
  if (longestResult.status === "rejected") {
    errors.longest =
      longestResult.reason instanceof Error
        ? longestResult.reason.message
        : "Failed to load longest pets";
  }
  if (fosterResult.status === "rejected") {
    errors.foster =
      fosterResult.reason instanceof Error
        ? fosterResult.reason.message
        : "Failed to load foster stories";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return NextResponse.json(
    { longest, foster, ...(hasErrors ? { errors } : {}) },
    { status: hasErrors ? 207 : 200 },
  );
}
