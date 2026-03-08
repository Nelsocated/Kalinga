import { NextRequest, NextResponse } from "next/server";
import { searchPets } from "@/lib/db/search_pets";

const parseMulti = (searchParams: URLSearchParams, key: string): string[] | null => {
  const values = searchParams
    .getAll(key) // supports ?species=dog&species=cat
    .flatMap((v) => v.split(",")) // supports ?species=dog,cat
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  return values.length ? Array.from(new Set(values)) : null;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const data = await searchPets({
      species: parseMulti(searchParams, "species"),
      sex: parseMulti(searchParams, "sex"),
      age: parseMulti(searchParams, "age"),
      size: parseMulti(searchParams, "size"),
    });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Search failed" },
      { status: 500 },
    );
  }
}
