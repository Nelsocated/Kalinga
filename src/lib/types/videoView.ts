import type { Tables } from "@/src/lib/supabase/database.types";

export type VideoView = Tables<"video_views">;

export type RecordVideoViewInput = {
  mediaId: string;
  sessionId?: string | null;
};

export type VideoViewStats = {
  totalViews: number;
  uniqueViews: number;
};
