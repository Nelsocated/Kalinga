import "server-only";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAuthServerClient } from "@/lib/supabase/authServer";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  full_name: z.string().min(4),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const ChangePasswordSchema = z
  .object({
    email: z.string().email(),
    currentPassword: z.string().min(6),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[0-9]/, "Password must include at least one number"),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; details?: unknown };

export interface IAuthService {
  signup(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>>;
  login(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>>;
  me(): Promise<ServiceResult<{ user: unknown }>>;
  logout(): Promise<ServiceResult<null>>;
  deleteAccount(): Promise<ServiceResult<null>>;
  changePassword(input: unknown): Promise<ServiceResult<null>>;
}

class AuthService implements IAuthService {
  async signup(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>> {
    const parsed = SignupSchema.safeParse(input);

    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || "Invalid input";

      return {
        ok: false,
        status: 400,
        error: firstError,
        details: parsed.error.flatten(),
      };
    }

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          username: parsed.data.username,
          full_name: parsed.data.full_name,
        },
      },
    });

    if (error) {
      return { ok: false, status: 400, error: error.message };
    }

    return { ok: true, data: { user: data.user, session: data.session } };
  }

  async login(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>> {
    const parsed = LoginSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        error: "Invalid body",
        details: parsed.error.flatten(),
      };
    }

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false, status: 401, error: error.message };
    }

    return { ok: true, data: { user: data.user, session: data.session } };
  }

  async me(): Promise<ServiceResult<{ user: unknown }>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { ok: false, status: 401, error: error.message };
    }

    return { ok: true, data: { user: data.user } };
  }

  async logout(): Promise<ServiceResult<null>> {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { ok: false, status: 400, error: error.message };
    }

    return { ok: true, data: null };
  }

  async deleteAccount(): Promise<ServiceResult<null>> {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return {
        ok: false,
        status: 401,
        error: getUserError?.message || "Unauthorized",
      };
    }

    const supabaseAdmin = createAdminClient();

    const { error: deleteAuthError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id, false);

    if (deleteAuthError) {
      return {
        ok: false,
        status: 400,
        error: deleteAuthError.message,
      };
    }

    return { ok: true, data: null };
  }

  async changePassword(input: unknown): Promise<ServiceResult<null>> {
    const parsed = ChangePasswordSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        error: "Invalid body",
        details: parsed.error.flatten(),
      };
    }

    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return {
        ok: false,
        status: 401,
        error: getUserError?.message || "Unauthorized",
      };
    }

    const currentEmail = user.email?.toLowerCase().trim();
    const submittedEmail = parsed.data.email.toLowerCase().trim();

    if (!currentEmail || currentEmail !== submittedEmail) {
      return {
        ok: false,
        status: 403,
        error: "Email confirmation does not match the signed-in account",
      };
    }

    const verifier = createAuthServerClient();

    const { error: verifyError } = await verifier.auth.signInWithPassword({
      email: submittedEmail,
      password: parsed.data.currentPassword,
    });

    if (verifyError) {
      return {
        ok: false,
        status: 401,
        error: "Current password is incorrect",
      };
    }

    const supabaseAdmin = createAdminClient();

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: parsed.data.newPassword,
      });

    if (updateError) {
      return {
        ok: false,
        status: 400,
        error: updateError.message,
      };
    }

    return { ok: true, data: null };
  }
}
export const authService: IAuthService = new AuthService();

export async function signup(
  input: unknown,
): Promise<ServiceResult<{ user: unknown; session: unknown }>> {
  return authService.signup(input);
}

export async function login(
  input: unknown,
): Promise<ServiceResult<{ user: unknown; session: unknown }>> {
  return authService.login(input);
}

export async function me(): Promise<ServiceResult<{ user: unknown }>> {
  return authService.me();
}

export async function logout(): Promise<ServiceResult<null>> {
  return authService.logout();
}

export async function deleteAccount(): Promise<ServiceResult<null>> {
  return authService.deleteAccount();
}

export async function changePassword(
  input: unknown,
): Promise<ServiceResult<null>> {
  return authService.changePassword(input);
}
