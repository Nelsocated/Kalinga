import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import type {
  Fosters,
  CreateFosterInput,
  ServiceResult,
  FosterItem,
  UpdateFosterInput,
  FosterRow,
} from "@/src/lib/types/foster";

const FOSTER_SELECT = `
  id,
  pet_id,
  title,
  description,
  created_at
`;

class FosterService {
  private static normalizeFoster(row: FosterRow): Fosters {
    return {
      id: String(row.id),
      pet_id: String(row.pet_id),
      title: row.title ?? "",
      description: row.description ?? "",
      created_at: row.created_at ?? undefined,
    };
  }

  async getAllFoster(limit = 20): Promise<Fosters[]> {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("foster")
      .select(FOSTER_SELECT)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data ?? []).map(FosterService.normalizeFoster);
  }

  async getFosterStoryById(id: string): Promise<ServiceResult<FosterItem>> {
    try {
      const supabase = await createServerSupabase();

      const { data, error } = await supabase
        .from("foster")
        .select(FOSTER_SELECT)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return {
          ok: false,
          data: null,
          error: "Failed to fetch foster story",
          details: error.message,
          status: 400,
        };
      }

      if (!data) {
        return {
          ok: false,
          data: null,
          error: "Foster story not found",
          details: null,
          status: 404,
        };
      }

      return {
        ok: true,
        data,
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: "Unexpected error fetching foster story",
        details: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  async getFosterStories(): Promise<ServiceResult<FosterItem[]>> {
    try {
      const supabase = await createServerSupabase();

      const { data, error } = await supabase
        .from("foster")
        .select(FOSTER_SELECT)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          ok: false,
          data: null,
          error: "Failed to fetch foster stories",
          details: error.message,
          status: 400,
        };
      }

      return {
        ok: true,
        data: data ?? [],
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: "Unexpected error fetching foster stories",
        details: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  async createFoster(
    input: CreateFosterInput & {
      adoptionStatus?: "available" | "not_available" | "";
    },
  ): Promise<ServiceResult<FosterItem>> {
    try {
      const supabase = await createServerSupabase();

      if (!input.petId?.trim()) {
        return {
          ok: false,
          data: null,
          error: "Pet is required",
          details: null,
          status: 400,
        };
      }

      if (!input.title?.trim()) {
        return {
          ok: false,
          data: null,
          error: "Title is required",
          details: null,
          status: 400,
        };
      }

      if (!input.description?.trim()) {
        return {
          ok: false,
          data: null,
          error: "Story is required",
          details: null,
          status: 400,
        };
      }

      const { data, error } = await supabase
        .from("foster")
        .insert({
          pet_id: input.petId,
          title: input.title.trim(),
          description: input.description.trim(),
        })
        .select(FOSTER_SELECT)
        .single();

      if (error) {
        return {
          ok: false,
          data: null,
          error: "Failed to create foster story",
          details: error.message,
          status: 400,
        };
      }

      if (input.adoptionStatus) {
        const nextStatus =
          input.adoptionStatus === "available" ? "available" : "pending";

        const { error: updateError } = await supabase
          .from("pets")
          .update({ status: nextStatus })
          .eq("id", input.petId);

        if (updateError) {
          console.error(
            "[createFoster] Failed to update pet status:",
            updateError,
          );
        }
      }

      return {
        ok: true,
        data,
        error: null,
        status: 201,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: "Unexpected error creating foster story",
        details: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  async updateFoster(
    input: UpdateFosterInput,
  ): Promise<ServiceResult<FosterItem>> {
    try {
      const supabase = await createServerSupabase();

      const payload: { title?: string; description?: string } = {};

      if (input.title !== undefined) payload.title = input.title.trim();
      if (input.description !== undefined) {
        payload.description = input.description.trim();
      }

      const { data, error } = await supabase
        .from("foster")
        .update(payload)
        .eq("id", input.id)
        .select(FOSTER_SELECT)
        .maybeSingle();

      if (error) {
        return {
          ok: false,
          data: null,
          error: "Failed to update foster story",
          details: error.message,
          status: 400,
        };
      }

      if (!data) {
        return {
          ok: false,
          data: null,
          error: "Foster story not found",
          details: null,
          status: 404,
        };
      }

      return {
        ok: true,
        data,
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: "Unexpected error updating foster story",
        details: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  async deleteFoster(id: string): Promise<ServiceResult<{ id: string }>> {
    try {
      const supabase = await createServerSupabase();

      const { error } = await supabase.from("foster").delete().eq("id", id);

      if (error) {
        return {
          ok: false,
          data: null,
          error: "Failed to delete foster story",
          details: error.message,
          status: 400,
        };
      }

      return {
        ok: true,
        data: { id },
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: "Unexpected error deleting foster story",
        details: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }
}

export const fosterService = new FosterService();

export async function getAll(limit = 20): Promise<Fosters[]> {
  return fosterService.getAllFoster(limit);
}

export async function getFosterStoryById(
  id: string,
): Promise<ServiceResult<FosterItem>> {
  return fosterService.getFosterStoryById(id);
}

export async function getFosterStories(): Promise<ServiceResult<FosterItem[]>> {
  return fosterService.getFosterStories();
}

export async function createFoster(
  input: CreateFosterInput & {
    adoptionStatus?: "available" | "not_available" | "";
  },
): Promise<ServiceResult<FosterItem>> {
  return fosterService.createFoster(input);
}

export async function updateFoster(
  input: UpdateFosterInput,
): Promise<ServiceResult<FosterItem>> {
  return fosterService.updateFoster(input);
}

export async function deleteFoster(
  id: string,
): Promise<ServiceResult<{ id: string }>> {
  return fosterService.deleteFoster(id);
}
