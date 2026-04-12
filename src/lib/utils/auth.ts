import { createServerSupabase } from "@/src/lib/supabase/server";
import type { Role, AuthUser } from "./clientAuth";

class Auth {
  private supabase: Awaited<ReturnType<typeof createServerSupabase>> | null =
    null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createServerSupabase();
    }
    return this.supabase;
  }

  async getAuthUser(): Promise<AuthUser | null> {
    const supabase = await this.getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data) return null;

    return {
      id: user.id,
      role: data.role as Role,
    };
  }

  async requireAuth(): Promise<AuthUser> {
    const user = await this.getAuthUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    return user;
  }

  async requireRole(allowed: Role[]): Promise<AuthUser> {
    const user = await this.requireAuth();

    if (!allowed.includes(user.role)) {
      throw new Error("Forbidden");
    }

    return user;
  }

  async requireUser(): Promise<AuthUser> {
    return this.requireRole(["user"]);
  }

  async requireShelter(): Promise<AuthUser> {
    return this.requireRole(["shelter"]);
  }

  async requireAdmin(): Promise<AuthUser> {
    return this.requireRole(["admin"]);
  }
}

const authService = new Auth();

// Backward-compatible exports - call these directly
export async function getAuthUser(): Promise<AuthUser | null> {
  return authService.getAuthUser();
}

export async function requireAuth(): Promise<AuthUser> {
  return authService.requireAuth();
}

export async function requireRole(allowed: Role[]): Promise<AuthUser> {
  return authService.requireRole(allowed);
}

export async function requireUser(): Promise<AuthUser> {
  return authService.requireUser();
}

export async function requireShelter(): Promise<AuthUser> {
  return authService.requireShelter();
}

export async function requireAdmin(): Promise<AuthUser> {
  return authService.requireAdmin();
}
