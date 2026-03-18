export interface Pet_Media {
  id: string;
  pet_id: string;
  type: "photo" | "video";
  url: string;
  caption?: string;
  created_at: string;
}
