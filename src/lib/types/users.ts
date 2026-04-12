export interface Users {
  id: string;
  full_name: string;
  username: string;
  role: "user" | "shelter" | "admin";
  photo_url: string;
  bio: string;
  contact_email: string;
  contact_phone: string;
  updated_at: string;
  created_at: string;
}

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
