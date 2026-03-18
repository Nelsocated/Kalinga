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
