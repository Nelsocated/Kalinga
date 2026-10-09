import "server-only";

import { createServerSupabase } from "@/src/lib/supabase/server";
import { ApiError } from "@/src/lib/api";
import { getUserId } from "@/src/lib/utils/auth";
import type {
  RecordVideoViewInput,
  VideoView,
  VideoViewStats,
} from "@/src/lib/types/videoView";

const VIEW_COOLDOWN_MINUTES = 30;

type ViewRow = { user_id: string | null; session_id: string | null };

function viewerKey(row: ViewRow) {
  if (row.user_id) return `user:${row.user_id}`;
  if (row.session_id) return `session:${row.session_id}`;
  return null;
}

/** Records a view unless the same viewer saw this video in the cooldown. */
export async function recordView(
  input: RecordVideoViewInput,
): Promise<{ inserted: boolean; view?: VideoView }> {
  const supabase = await createServerSupabase();
  const userId = await getUserId();

  const mediaId = input.mediaId?.trim();
  const sessionId = input.sessionId?.trim() || null;

  if (!mediaId) throw new ApiError(400, "mediaId is required");

  if (!userId && !sessionId) {
    throw new ApiError(400, "sessionId is required for guest viewers");
  }

  const cutoffIso = new Date(
    Date.now() - VIEW_COOLDOWN_MINUTES * 60 * 1000,
  ).toISOString();

  let existingQuery = supabase
    .from("video_views")
    .select("id")
    .eq("media_id", mediaId)
    .gte("viewed_at", cutoffIso)
    .limit(1);

  existingQuery = userId
    ? existingQuery.eq("user_id", userId)
    : existingQuery.is("user_id", null).eq("session_id", sessionId!);

  const { data: existingRow, error: existingError } =
    await existingQuery.maybeSingle();

  if (existingError) throw new Error(existingError.message);
  if (existingRow) return { inserted: false };

  const { data, error } = await supabase
    .from("video_views")
    .insert({
      media_id: mediaId,
      user_id: userId,
      session_id: userId ? null : sessionId,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { inserted: true, view: data as VideoView };
}

export async function getStatsByMediaId(
  mediaId: string,
): Promise<VideoViewStats> {
  const [stats] = await getStatsByMediaIds([mediaId]);

  return { totalViews: stats.totalViews, uniqueViews: stats.uniqueViews };
}

export async function getStatsByMediaIds(
  mediaIds: string[],
): Promise<Array<VideoViewStats & { media_id: string }>> {
  if (!mediaIds.length) return [];

  const supabase = await createServerSupabase();

  const { data: rows, error } = await supabase
    .from("video_views")
    .select("media_id, user_id, session_id")
    .in("media_id", mediaIds);

  if (error) throw new Error(error.message);

  const grouped = new Map(
    mediaIds.map((id) => [
      id,
      { totalViews: 0, uniqueSet: new Set<string>() },
    ]),
  );

  for (const row of rows ?? []) {
    const bucket = grouped.get(row.media_id);
    if (!bucket) continue;

    bucket.totalViews += 1;

    const key = viewerKey(row);
    if (key) bucket.uniqueSet.add(key);
  }

  return mediaIds.map((mediaId) => {
    const bucket = grouped.get(mediaId)!;

    return {
      media_id: mediaId,
      totalViews: bucket.totalViews,
      uniqueViews: bucket.uniqueSet.size,
    };
  });
}
