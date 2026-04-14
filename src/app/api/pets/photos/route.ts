import { uploadPetPhoto } from "@/src/lib/services/petMediaService";
import { getPetPhotosByPetId } from "@/src/lib/services/petMediaService";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const petId = formData.get("petId") as string;

    if (!file || !petId) {
      return Response.json({ error: "Missing file or petId" }, { status: 400 });
    }

    const result = await uploadPetPhoto({ file, petId });

    if (!result.ok) {
      return Response.json(
        { error: result.error, details: result.details },
        { status: result.status },
      );
    }

    return Response.json({
      success: true,
      url: result.data?.url,
    });
  } catch (err) {
    console.error("GET /api/pets error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId");

    if (!petId) {
      return Response.json({ error: "Missing petId" }, { status: 400 });
    }

    const photos = await getPetPhotosByPetId(petId);

    return Response.json({
      photos: photos.map((p) => ({
        id: p.id,
        url: p.url,
      })),
    });
  } catch (err) {
    console.error("GET /api/pets error:", err);
    return Response.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
