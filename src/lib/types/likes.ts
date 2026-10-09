import type { Tables } from "@/src/lib/supabase/database.types";

export type Likes = Tables<"likes">;

export interface LikedMiniItem {
  id: string;
  kind: "pet" | "shelter" | "video";
  href?: string;

  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;

  gender?: string | null;
  petName?: string | null;
  shelterName?: string | null;
  shelterLogo?: string | null;

  petsAvailable?: number;
  petsAdopted?: number;

  petId?: string | null;
  thumbnailUrl?: string | null;
  caption?: string | null;
}

export interface LikeArgs {
  userId: string;
  targetType: "pet" | "shelter" | "video";
  targetId: string;
}

export interface LikedIdsGrouped {
  petIds: string[];
  shelterIds: string[];
  videoIds: string[];
}

export type PetLikeCount = {
  petId: string;
  count: number;
};
