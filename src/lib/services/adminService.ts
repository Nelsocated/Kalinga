import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";

export type ShelterApplicationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export type ShelterApplicationItem = {
  id: string;
  shelterName: string;
  logoUrl: string | null;
  location: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  applicationStatus: ShelterApplicationStatus;
  applicationSubmittedAt: string | null;
  applicationReviewedAt: string | null;
  applicationReviewNote: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  owner_id: string | null;
  lease_url: string | null;
  id_url: string | null;
  photo_url: string | null;
  cert_url: string | null;
};

type ServiceResult<T> = {
  ok: boolean;
  data: T | null;
  error: string | null;
  status: number;
};

function normalizeShelterApplication(
  row: Record<string, unknown>,
): ShelterApplicationItem {
  return {
    id: String(row.id ?? ""),
    shelterName:
      typeof row.shelter_name === "string"
        ? row.shelter_name
        : "Unnamed Shelter",
    logoUrl: typeof row.logo_url === "string" ? row.logo_url : null,
    location: typeof row.location === "string" ? row.location : null,

    contactEmail:
      typeof row.contact_email === "string" ? row.contact_email : null,
    contactPhone:
      typeof row.contact_phone === "string" ? row.contact_phone : null,
    applicationStatus:
      row.application_status === "under_review" ||
      row.application_status === "approved" ||
      row.application_status === "rejected"
        ? row.application_status
        : "pending",
    applicationSubmittedAt:
      typeof row.application_submitted_at === "string"
        ? row.application_submitted_at
        : null,
    applicationReviewedAt:
      typeof row.application_reviewed_at === "string"
        ? row.application_reviewed_at
        : null,
    applicationReviewNote:
      typeof row.application_review_note === "string"
        ? row.application_review_note
        : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
    owner_id: typeof row.owner_id === "string" ? row.owner_id : null,
    lease_url: typeof row.lease_url === "string" ? row.lease_url : null,
    id_url: typeof row.id_url === "string" ? row.id_url : null,
    photo_url: typeof row.photo_url === "string" ? row.photo_url : null,
    cert_url: typeof row.cert_url === "string" ? row.cert_url : null,
  };
}

export async function getShelterApplications(
  status?: ShelterApplicationStatus | "all",
): Promise<ServiceResult<ShelterApplicationItem[]>> {
  try {
    const supabase = await createServerSupabase();

    let query = supabase
      .from("shelter")
      .select(
        `
        id,
        owner_id,
        shelter_name,
        logo_url,
        location,
        contact_email,
        contact_phone,
        application_status,
        application_submitted_at,
        application_reviewed_at,
        application_review_note,
        created_at,
        updated_at
        `,
      )
      .order("application_submitted_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("application_status", status);
    }

    const { data, error } = await query;

    if (error) {
      return {
        ok: false,
        data: null,
        error: error.message,
        status: 500,
      };
    }

    const items = Array.isArray(data)
      ? data.map((row) =>
          normalizeShelterApplication(row as Record<string, unknown>),
        )
      : [];

    return {
      ok: true,
      data: items,
      error: null,
      status: 200,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch shelter applications.",
      status: 500,
    };
  }
}

export async function getShelterApplicationById(
  id: string,
): Promise<ServiceResult<ShelterApplicationItem>> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("shelter")
      .select(
        `
        id,
        owner_id,
        shelter_name,
        logo_url,
        location,
        contact_email,
        contact_phone,
        application_status,
        application_submitted_at,
        application_reviewed_at,
        application_review_note,
        lease_url,
        id_url,
        photo_url,
        cert_url,
        created_at,
        updated_at
        `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        data: null,
        error: error.message,
        status: 500,
      };
    }

    if (!data) {
      return {
        ok: false,
        data: null,
        error: "Shelter application not found.",
        status: 404,
      };
    }

    return {
      ok: true,
      data: normalizeShelterApplication(data as Record<string, unknown>),
      error: null,
      status: 200,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch shelter application.",
      status: 500,
    };
  }
}

export async function approveShelterApplication(input: {
  id: string;
  reviewNote?: string | null;
  reviewedBy?: string | null;
}): Promise<ServiceResult<ShelterApplicationItem>> {
  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase.rpc("approve_shelter_application", {
      p_shelter_id: input.id,
      p_review_note: input.reviewNote ?? null,
      p_reviewed_by: input.reviewedBy ?? null,
    });

    if (error) {
      return {
        ok: false,
        data: null,
        error: error.message,
        status: 500,
      };
    }

    const row = Array.isArray(data) ? data[0] : null;

    if (!row) {
      return {
        ok: false,
        data: null,
        error: "Approval failed.",
        status: 500,
      };
    }

    return {
      ok: true,
      data: normalizeShelterApplication(row as Record<string, unknown>),
      error: null,
      status: 200,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to approve shelter application.",
      status: 500,
    };
  }
}

type UpdateShelterApplicationStatusInput = {
  id: string;
  status: ShelterApplicationStatus;
  reviewNote?: string | null;
  reviewedBy?: string | null;
};

export async function updateShelterApplicationStatus(
  input: UpdateShelterApplicationStatusInput,
): Promise<ServiceResult<ShelterApplicationItem>> {
  try {
    if (input.status === "approved") {
      return await approveShelterApplication({
        id: input.id,
        reviewNote: input.reviewNote,
        reviewedBy: input.reviewedBy,
      });
    }

    const supabase = await createServerSupabase();

    const payload = {
      application_status: input.status,
      application_review_note: input.reviewNote ?? null,
      application_reviewed_at: new Date().toISOString(),
      reviewed_by: input.reviewedBy ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("shelter")
      .update(payload)
      .eq("id", input.id)
      .select(
        `
        id,
        owner_id,
        shelter_name,
        logo_url,
        location,
        contact_email,
        contact_phone,
        application_status,
        application_submitted_at,
        application_reviewed_at,
        application_review_note,
        created_at,
        updated_at
        `,
      )
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        data: null,
        error: error.message,
        status: 500,
      };
    }

    if (!data) {
      return {
        ok: false,
        data: null,
        error: "Shelter application not found or update failed.",
        status: 404,
      };
    }

    return {
      ok: true,
      data: normalizeShelterApplication(data as Record<string, unknown>),
      error: null,
      status: 200,
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update application status.",
      status: 500,
    };
  }
}
