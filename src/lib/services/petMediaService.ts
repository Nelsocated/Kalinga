import "server-only";
import { randomUUID } from "crypto";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import type {
  Pet_Media,
  VideoWithPet,
  VideoWithShelterPet,
  VideoRow,
  CreateVideoInput,
  UploadPetPhotoInput,
} from "@/src/lib/types/petMedia";

const VIDEO_BUCKET = "pet-videos";
const PHOTO_BUCKET = "pet_photos";
const MAX_VIDEO_MB = 100;

const VIDEO_WITH_PET_SELECT = `
  id,
  pet_id,
  type,
  url,
  caption,
  created_at,
  pets:pet_id (
    id,
    name,
    photo_url
  )
`;

function firstPet(pets: VideoRow["pets"]) {
  return Array.isArray(pets) ? (pets[0] ?? null) : pets;
}

function toVideoWithPet(row: VideoRow): VideoWithPet {
  return {
    id: row.id,
    pet_id: row.pet_id,
    type: row.type,
    url: row.url,
    caption: row.caption,
    created_at: row.created_at,
    pet: firstPet(row.pets),
  };
}

export async function getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select("*")
    .eq("pet_id", petId)
    .eq("type", "photo")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function getVideosByPetIds(
  petIds: string[],
): Promise<VideoWithPet[]> {
  const uniqueIds = [...new Set(petIds)].filter(Boolean);
  if (uniqueIds.length === 0) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select(VIDEO_WITH_PET_SELECT)
    .eq("type", "video")
    .in("pet_id", uniqueIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // The embedded pets join is typed loosely; VideoRow is its real shape
  return ((data ?? []) as VideoRow[]).map(toVideoWithPet);
}

export async function getVideosByIds(
  mediaIds: string[],
): Promise<VideoWithPet[]> {
  const uniqueIds = [...new Set(mediaIds)].filter(Boolean);
  if (uniqueIds.length === 0) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select(VIDEO_WITH_PET_SELECT)
    .eq("type", "video")
    .in("id", uniqueIds)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // The embedded pets join is typed loosely; VideoRow is its real shape
  return ((data ?? []) as VideoRow[]).map(toVideoWithPet);
}

export async function getPetVideosByShelterId(
  shelterId: string,
): Promise<VideoWithShelterPet[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("pet_media")
    .select(
      `
      id,
      pet_id,
      type,
      url,
      caption,
      created_at,
      pets!inner (
        id,
        name,
        photo_url,
        shelter_id
      )
    `,
    )
    .eq("type", "video")
    .eq("pets.shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as VideoRow[]).map((row) => ({
    id: row.id,
    pet_id: row.pet_id,
    type: row.type,
    url: row.url,
    caption: row.caption,
    created_at: row.created_at,
    pets: firstPet(row.pets),
  }));
}

export async function createVideo(input: CreateVideoInput): Promise<Pet_Media> {
  const { petId, caption, file } = input;

  if (!file.type.startsWith("video/")) {
    throw new ApiError(400, "Only video files are allowed");
  }

  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new ApiError(400, `Video must be ${MAX_VIDEO_MB}MB or less`);
  }

  const supabase = await createServerSupabase();

  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const filePath = `pets/${petId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from(VIDEO_BUCKET)
    .getPublicUrl(filePath);

  const { data, error: insertError } = await supabase
    .from("pet_media")
    .insert({
      pet_id: petId,
      type: "video",
      url: publicUrlData.publicUrl,
      caption: caption?.trim() || null,
    })
    .select("id, pet_id, type, url, caption, created_at")
    .single();

  if (insertError) {
    await supabase.storage.from(VIDEO_BUCKET).remove([filePath]);
    throw new Error(insertError.message);
  }

  return data;
}

export async function uploadPetPhoto(
  input: UploadPetPhotoInput,
): Promise<{ url: string }> {
  const { file, petId } = input;

  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Only image files are allowed");
  }

  const supabase = await createServerSupabase();

  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${petId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(filePath);
  const url = data.publicUrl;

  const { error: dbError } = await supabase.from("pet_media").insert({
    pet_id: petId,
    type: "photo",
    url,
  });

  if (dbError) {
    await supabase.storage.from(PHOTO_BUCKET).remove([filePath]);
    throw new Error(dbError.message);
  }

  return { url };
}
