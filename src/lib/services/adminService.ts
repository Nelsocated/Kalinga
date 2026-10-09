import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { ApiError } from "@/src/lib/api";
import { CACHE_TAGS, invalidate } from "@/src/lib/cache";
import { SHELTER_DOCUMENT_BUCKET } from "./authService";

export type ShelterApplicationStatus = "under_review" | "approved" | "rejected";

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

const SIGNED_URL_SECONDS = 10 * 60;

const APPLICATION_LIST_SELECT = `
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
`;

const APPLICATION_DETAIL_SELECT = `
  ${APPLICATION_LIST_SELECT},
  lease_url,
  id_url,
  photo_url,
  cert_url
`;

function normalizeShelterApplication(
  row: Record<string, unknown>,
): ShelterApplicationItem {
  const text = (value: unknown) => (typeof value === "string" ? value : null);

  return {
    id: String(row.id ?? ""),
    shelterName: text(row.shelter_name) ?? "Unnamed Shelter",
    logoUrl: text(row.logo_url),
    location: text(row.location),
    contactEmail: text(row.contact_email),
    contactPhone: text(row.contact_phone),
    applicationStatus:
      row.application_status === "under_review" ||
      row.application_status === "approved" ||
      row.application_status === "rejected"
        ? row.application_status
        : "under_review",
    applicationSubmittedAt: text(row.application_submitted_at),
    applicationReviewedAt: text(row.application_reviewed_at),
    applicationReviewNote: text(row.application_review_note),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
    owner_id: text(row.owner_id),
    lease_url: text(row.lease_url),
    id_url: text(row.id_url),
    photo_url: text(row.photo_url),
    cert_url: text(row.cert_url),
  };
}

/**
 * New applications store private storage paths; older rows still hold full
 * public URLs, which are shown as-is until they are moved.
 */
async function signDocument(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  const { data, error } = await createAdminClient()
    .storage.from(SHELTER_DOCUMENT_BUCKET)
    .createSignedUrl(value, SIGNED_URL_SECONDS);

  if (error) {
    console.error("[signDocument]", value, error.message);
    return null;
  }

  return data.signedUrl;
}

/** Callers must have checked requireAdmin() first. */
async function withSignedDocuments(
  item: ShelterApplicationItem,
): Promise<ShelterApplicationItem> {
  const [cert_url, id_url, lease_url] = await Promise.all([
    signDocument(item.cert_url),
    signDocument(item.id_url),
    signDocument(item.lease_url),
  ]);

  return { ...item, cert_url, id_url, lease_url };
}

export async function getShelterApplications(
  status: ShelterApplicationStatus | "all" = "all",
): Promise<ShelterApplicationItem[]> {
  const supabase = await createServerSupabase();

  let query = supabase
    .from("shelter")
    .select(APPLICATION_LIST_SELECT)
    .order("application_submitted_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("application_status", status);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    normalizeShelterApplication(row as Record<string, unknown>),
  );
}

export async function getShelterApplicationById(
  id: string,
): Promise<ShelterApplicationItem> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("shelter")
    .select(APPLICATION_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Shelter application not found.");

  return withSignedDocuments(
    normalizeShelterApplication(data as Record<string, unknown>),
  );
}

export async function updateShelterApplicationStatus(input: {
  id: string;
  status: ShelterApplicationStatus;
  reviewNote: string | null;
  reviewedBy: string;
}): Promise<ShelterApplicationItem> {
  const supabase = await createServerSupabase();

  if (input.status === "approved") {
    const { data, error } = await supabase.rpc("approve_shelter_application", {
      p_shelter_id: input.id,
      p_review_note: input.reviewNote ?? undefined,
      p_reviewed_by: input.reviewedBy,
    });

    if (error) throw new Error(error.message);

    const row = Array.isArray(data) ? data[0] : null;

    if (!row) throw new Error("Approval failed.");

    invalidate(CACHE_TAGS.shelters);

    return withSignedDocuments(
      normalizeShelterApplication(row as Record<string, unknown>),
    );
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("shelter")
    .update({
      application_status: input.status,
      application_review_note: input.reviewNote,
      application_reviewed_at: now,
      reviewed_by: input.reviewedBy,
      updated_at: now,
    })
    .eq("id", input.id)
    .select(APPLICATION_DETAIL_SELECT)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ApiError(404, "Shelter application not found.");

  invalidate(CACHE_TAGS.shelters);
  return withSignedDocuments(
    normalizeShelterApplication(data as Record<string, unknown>),
  );
}
