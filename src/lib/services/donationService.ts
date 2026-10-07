import "server-only";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { ApiError } from "@/src/lib/api";
import type { DonationSettings, Donations } from "../types/donation";

const QR_BUCKET = "shelter_photos";
const MAX_QR_BYTES = 5 * 1024 * 1024;

export async function getShelterDonations(
  shelterId: string,
): Promise<Donations[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("donation")
    .select("*")
    .eq("shelter_id", shelterId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return (data ?? []) as Donations[];
}

export async function hasActiveDonations(shelterId: string): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { count, error } = await supabase
    .from("donation")
    .select("id", { count: "exact", head: true })
    .eq("shelter_id", shelterId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return (count ?? 0) > 0;
}

async function getAllShelterDonations(shelterId: string): Promise<Donations[]> {
  const { data, error } = await createAdminClient()
    .from("donation")
    .select("*")
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as Donations[];
}

/** Everything a shelter has set up, active or not, shaped for the edit form. */
export async function getMyDonationSettings(
  shelterId: string,
): Promise<DonationSettings> {
  const rows = await getAllShelterDonations(shelterId);
  const goodsRows = rows.filter((row) => row.type === "goods");

  return {
    // A shelter that hasn't set anything up starts switched on
    enabled: rows.length === 0 || rows.some((row) => row.is_active),
    monetary: rows
      .filter((row) => row.type === "monetary")
      .map((row) => ({
        id: row.id,
        method: row.method ?? "",
        account_name: row.account_name ?? "",
        account_number: row.account_number ?? "",
        qr_url: row.qr_url ?? "",
      })),
    goods: {
      id: goodsRows[0]?.id,
      items: goodsRows.flatMap((row) => row.item_name ?? []).filter(Boolean),
      note: goodsRows.find((row) => row.instruction_note?.trim())?.instruction_note ?? "",
    },
  };
}

/**
 * Replaces a shelter's donation setup with the form's version.
 * The shelter id comes from the session, never from the input; ids in the input are only
 * honoured when they already belong to this shelter. Writes run before deletes so a failed
 * save never loses what was there.
 */
export async function saveMyDonationSettings(
  shelterId: string,
  settings: DonationSettings,
): Promise<DonationSettings> {
  const admin = createAdminClient();
  const existing = await getAllShelterDonations(shelterId);
  const ownedIds = new Set(existing.map((row) => row.id));
  const owned = (id?: string) => (id && ownedIds.has(id) ? id : undefined);
  const is_active = settings.enabled;

  const rows: (Omit<Donations, "id" | "created_at"> & { id?: string })[] =
    settings.monetary.map((m) => ({
      id: owned(m.id),
      shelter_id: shelterId,
      type: "monetary" as const,
      method: m.method,
      account_name: m.account_name || null,
      account_number: m.account_number || null,
      qr_url: m.qr_url || null,
      item_name: null,
      instruction_note: null,
      is_active,
    }));

  if (settings.goods.items.length || settings.goods.note) {
    rows.push({
      id: owned(settings.goods.id) ?? existing.find((row) => row.type === "goods")?.id,
      shelter_id: shelterId,
      type: "goods",
      item_name: settings.goods.items,
      instruction_note: settings.goods.note || null,
      method: null,
      account_name: null,
      account_number: null,
      qr_url: null,
      is_active,
    });
  }

  const updates = rows.filter((row) => row.id);
  const inserts = rows.filter((row) => !row.id).map((row) => {
    const insert = { ...row };
    delete insert.id;
    return insert;
  });

  const results = await Promise.all([
    ...updates.map(({ id, ...row }) =>
      admin.from("donation").update(row).eq("id", id!).eq("shelter_id", shelterId),
    ),
    ...(inserts.length ? [admin.from("donation").insert(inserts)] : []),
  ]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(failed.error.message);

  const keep = new Set(updates.map((row) => row.id));
  const removed = existing.filter((row) => !keep.has(row.id)).map((row) => row.id);
  if (removed.length) {
    const { error } = await admin
      .from("donation")
      .delete()
      .eq("shelter_id", shelterId)
      .in("id", removed);
    if (error) throw new Error(error.message);
  }

  return getMyDonationSettings(shelterId);
}

export async function uploadDonationQr(ownerId: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ApiError(400, "Please upload an image of the QR code.");
  }
  if (file.size > MAX_QR_BYTES) {
    throw new ApiError(400, "That image is over 5 MB. Try a smaller screenshot of the QR code.");
  }

  const supabase = await createServerSupabase();
  const filePath = `shelters/${ownerId}-qr-${Date.now()}`;

  const { error } = await supabase.storage
    .from(QR_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(error.message);

  return supabase.storage.from(QR_BUCKET).getPublicUrl(filePath).data.publicUrl;
}
