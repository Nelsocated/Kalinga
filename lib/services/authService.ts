import "server-only";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";

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

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; details?: unknown };

export async function signup(
  input: unknown,
): Promise<ServiceResult<{ user: unknown; session: unknown }>> {
  const parsed = SignupSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Invalid body",
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

export async function login(
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

export async function me(): Promise<ServiceResult<{ user: unknown }>> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { ok: false, status: 401, error: error.message };
  }

  return { ok: true, data: { user: data.user } };
}

export async function logout(): Promise<ServiceResult<null>> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, status: 400, error: error.message };
  }

  return { ok: true, data: null };
}
