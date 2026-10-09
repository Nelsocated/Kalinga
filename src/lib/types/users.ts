import type { Tables } from "@/src/lib/supabase/database.types";

export type Users = Tables<"users">;

export type UserUpdatePayload = Partial<
  Pick<
    Users,
    | "full_name"
    | "username"
    | "bio"
    | "contact_email"
    | "contact_phone"
    | "photo_url"
  >
>;
