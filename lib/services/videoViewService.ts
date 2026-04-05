import "server-only";

import { createServerSupabase } from "@/lib/supabase/server";
import type {
  RecordVideoViewInput,
  VideoViewStats,
} from "@/lib/types/videoView";

class VideoViewService {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;
  private readonly VIEW_COOLDOWN_MINUTES = 30;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  private getCutoffIso(minutes: number) {
    return new Date(Date.now() - minutes * 60 * 1000).toISOString();
  }

  async recordView(input: RecordVideoViewInput) {
    const supabase = await this.getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const mediaId = input.mediaId?.trim();
    const sessionId = input.sessionId?.trim() || null;

    if (!mediaId) {
      return {
        ok: false,
        status: 400,
        error: "mediaId is required",
      };
    }

    if (!user?.id && !sessionId) {
      return {
        ok: false,
        status: 400,
        error: "sessionId is required for guest viewers",
      };
    }

    const cutoffIso = this.getCutoffIso(this.VIEW_COOLDOWN_MINUTES);

    let existingQuery = supabase
      .from("video_views")
      .select("id")
      .eq("media_id", mediaId)
      .gte("viewed_at", cutoffIso)
      .limit(1);

    if (user?.id) {
      existingQuery = existingQuery.eq("user_id", user.id);
    } else if (sessionId) {
      existingQuery = existingQuery
        .is("user_id", null)
        .eq("session_id", sessionId);
    }

    const { data: existingRow, error: existingError } =
      await existingQuery.maybeSingle();

    if (existingError) {
      return {
        ok: false,
        status: 500,
        error: "Failed to check existing view",
        details: existingError.message,
      };
    }

    if (existingRow) {
      return {
        ok: true,
        status: 200,
        message: "View already counted recently",
        data: {
          inserted: false,
        },
      };
    }

    const payload = {
      media_id: mediaId,
      user_id: user?.id ?? null,
      session_id: user?.id ? null : sessionId,
    };

    const { data, error } = await supabase
      .from("video_views")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return {
        ok: false,
        status: 500,
        error: "Failed to record view",
        details: error.message,
      };
    }

    return {
      ok: true,
      status: 201,
      message: "View recorded",
      data: {
        inserted: true,
        view: data,
      },
    };
  }

  async getStatsByMediaId(mediaId: string): Promise<{
    ok: boolean;
    status: number;
    error?: string;
    details?: string;
    data?: VideoViewStats;
  }> {
    const supabase = await this.getSupabase();

    const { data: rows, error } = await supabase
      .from("video_views")
      .select("user_id, session_id")
      .eq("media_id", mediaId);

    if (error) {
      return {
        ok: false,
        status: 500,
        error: "Failed to fetch view stats",
        details: error.message,
      };
    }

    const totalViews = rows?.length ?? 0;

    const uniqueSet = new Set<string>();
    for (const row of rows ?? []) {
      if (row.user_id) {
        uniqueSet.add(`user:${row.user_id}`);
      } else if (row.session_id) {
        uniqueSet.add(`session:${row.session_id}`);
      }
    }

    return {
      ok: true,
      status: 200,
      data: {
        totalViews,
        uniqueViews: uniqueSet.size,
      },
    };
  }

  async getStatsByMediaIds(mediaIds: string[]) {
    const supabase = await this.getSupabase();

    if (!mediaIds.length) {
      return {
        ok: true,
        status: 200,
        data: [] as Array<{
          media_id: string;
          totalViews: number;
          uniqueViews: number;
        }>,
      };
    }

    const { data: rows, error } = await supabase
      .from("video_views")
      .select("media_id, user_id, session_id")
      .in("media_id", mediaIds);

    if (error) {
      return {
        ok: false,
        status: 500,
        error: "Failed to fetch view stats",
        details: error.message,
      };
    }

    const grouped = new Map<
      string,
      { totalViews: number; uniqueSet: Set<string> }
    >();

    for (const mediaId of mediaIds) {
      grouped.set(mediaId, {
        totalViews: 0,
        uniqueSet: new Set<string>(),
      });
    }

    for (const row of rows ?? []) {
      const bucket = grouped.get(row.media_id);
      if (!bucket) continue;

      bucket.totalViews += 1;

      if (row.user_id) {
        bucket.uniqueSet.add(`user:${row.user_id}`);
      } else if (row.session_id) {
        bucket.uniqueSet.add(`session:${row.session_id}`);
      }
    }

    return {
      ok: true,
      status: 200,
      data: mediaIds.map((mediaId) => {
        const bucket = grouped.get(mediaId)!;
        return {
          media_id: mediaId,
          totalViews: bucket.totalViews,
          uniqueViews: bucket.uniqueSet.size,
        };
      }),
    };
  }
}

export const videoViewService = new VideoViewService();

// Backward-compatible exports
export async function recordView(input: RecordVideoViewInput) {
  return videoViewService.recordView(input);
}

export async function getStatsByMediaId(mediaId: string) {
  return videoViewService.getStatsByMediaId(mediaId);
}

export async function getStatsByMediaIds(mediaIds: string[]) {
  return videoViewService.getStatsByMediaIds(mediaIds);
}
