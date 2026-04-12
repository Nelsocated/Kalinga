export type VideoView = {
  id: string;
  media_id: string;
  user_id: string | null;
  session_id: string | null;
  viewed_at: string;
};

export type RecordVideoViewInput = {
  mediaId: string;
  sessionId?: string | null;
};

export type VideoViewStats = {
  totalViews: number;
  uniqueViews: number;
};
