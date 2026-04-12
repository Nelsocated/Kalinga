import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  Pet_Media,
  VideoWithPet,
  VideoWithShelterPet,
  VideoRow,
  ServiceResult,
  CreateVideoInput,
} from "@/src/lib/types/petMedia";
import { randomUUID } from "crypto";

class PetMediaService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
    const supabase = await this.getSupabase();

    const { data, error } = await supabase
      .from("pet_media")
      .select("*")
      .eq("pet_id", petId)
      .eq("type", "photo")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []) as Pet_Media[];
  }

  async getVideosByPetIds(petIds: string[]): Promise<VideoWithPet[]> {
    const supabase = await this.getSupabase();

    const uniqueIds = [...new Set(petIds)].filter(Boolean);

    if (uniqueIds.length === 0) {
      return [];
    }

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
        pets:pet_id (
          id,
          name,
          photo_url
        )
      `,
      )
      .eq("type", "video")
      .in("pet_id", uniqueIds)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as VideoRow[];

    return rows.map((row) => ({
      id: row.id,
      pet_id: row.pet_id,
      type: row.type,
      url: row.url,
      caption: row.caption,
      created_at: row.created_at,
      pet: Array.isArray(row.pets) ? (row.pets[0] ?? null) : row.pets,
    }));
  }

  async getPetVideosByShelterId(
    shelterId: string,
  ): Promise<VideoWithShelterPet[]> {
    const supabase = await this.getSupabase();

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
      .eq("pets.shelter_id", shelterId) // now this actually filters
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data ?? []) as VideoRow[];

    return rows.map((row) => ({
      id: row.id,
      pet_id: row.pet_id,
      type: row.type,
      url: row.url,
      caption: row.caption,
      created_at: row.created_at,
      pets: Array.isArray(row.pets) ? (row.pets[0] ?? null) : row.pets,
    }));
  }

  async createVideo(input: CreateVideoInput): Promise<ServiceResult<VideoRow>> {
    try {
      const { petId, title, file } = input;

      if (!petId.trim()) {
        return {
          ok: false,
          status: 400,
          error: "Pet ID is required",
        };
      }

      if (!file) {
        return {
          ok: false,
          status: 400,
          error: "Video file is required",
        };
      }

      if (!file.type.startsWith("video/")) {
        return {
          ok: false,
          status: 400,
          error: "Only video files are allowed",
        };
      }

      const maxSizeMb = 100;
      const maxBytes = maxSizeMb * 1024 * 1024;

      if (file.size > maxBytes) {
        return {
          ok: false,
          status: 400,
          error: `Video must be ${maxSizeMb}MB or less`,
        };
      }

      const supabase = await createServerSupabase();

      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = `pets/${petId}/${fileName}`;

      console.log("[createVideo] petId:", petId);
      console.log("[createVideo] title:", title);
      console.log("[createVideo] filePath:", filePath);
      console.log("[createVideo] file type:", file.type);
      console.log("[createVideo] file size:", file.size);

      const { error: uploadError } = await supabase.storage
        .from("pet-videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("[createVideo] uploadError:", uploadError);

        return {
          ok: false,
          status: 500,
          error: "Failed to upload video",
          details: uploadError.message,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from("pet-videos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      console.log("[createVideo] publicUrl:", publicUrl);

      const { data, error: insertError } = await supabase
        .from("pet_media")
        .insert({
          pet_id: petId,
          type: "video",
          url: publicUrl,
          caption: title?.trim() || null,
        })
        .select("id, pet_id, type, url, caption, created_at")
        .single();

      if (insertError) {
        console.error("[createVideo] insertError:", insertError);

        await supabase.storage.from("pet-videos").remove([filePath]);

        return {
          ok: false,
          status: 500,
          error: "Failed to save video metadata",
          details: insertError.message,
        };
      }

      return {
        ok: true,
        status: 201,
        message: "Video uploaded successfully",
        data: data as VideoRow,
      };
    } catch (error) {
      console.error("[VideoService.createVideo]", error);

      return {
        ok: false,
        status: 500,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const petMediaService = new PetMediaService();

export async function getPetPhotosByPetId(petId: string): Promise<Pet_Media[]> {
  return petMediaService.getPetPhotosByPetId(petId);
}

export async function getVideosByPetIds(
  petIds: string[],
): Promise<VideoWithPet[]> {
  return petMediaService.getVideosByPetIds(petIds);
}

export async function getPetVideosByShelterId(
  shelterId: string,
): Promise<VideoWithShelterPet[]> {
  return petMediaService.getPetVideosByShelterId(shelterId);
}

export async function createVideo(
  input: CreateVideoInput,
): Promise<ServiceResult<VideoRow>> {
  return petMediaService.createVideo(input);
}
