import { createClientSupabase } from "@/lib/supabase/client";

export type Role = "user" | "shelter" | "admin";

export type AuthUser = {
  id: string;
  role: Role;
};

export class ClientAuth {
  private static supabase = createClientSupabase();

  static async getAuthUser(): Promise<AuthUser | null> {
    const {
      data: { user },
      error: authError,
    } = await this.supabase.auth.getUser();

    if (authError || !user) return null;

    const { data, error } = await this.supabase
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

  static getProfileRouteByRole(user: AuthUser): string {
    switch (user.role) {
      case "shelter":
        return "/shelter/profiles/shelter";
      case "admin":
        return "/admin/dashboard";
      case "user":
      default:
        return `/site/profiles/user/${user.id}`;
    }
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  return ClientAuth.getAuthUser();
}

export function getProfileRouteByRole(user: AuthUser) {
  return ClientAuth.getProfileRouteByRole(user);
}
