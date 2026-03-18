export interface Likes {
  id: string;
  user_id: string;
  target_type: "pet" | "shelter" | "video";
  target_id: string;
  created_at: string;
}
