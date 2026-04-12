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

const FileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  "File is required",
);

const ShelterSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  full_name: z.string().min(4),
  shelter_name: z.string().trim().min(2, "Shelter name is required"),
  complete_address: z.string().trim().min(10, "Complete address is required"),
  registration_certificate: FileSchema,
  owner_valid_id: FileSchema,
  lease_contract: FileSchema,
  shelter_photo: FileSchema,
});

const ShelterApplicationSchema = z.object({
  shelter_name: z.string().trim().min(2, "Shelter name is required"),
  complete_address: z.string().trim().min(10, "Complete address is required"),
  registration_certificate: FileSchema,
  owner_valid_id: FileSchema,
  lease_contract: FileSchema,
  shelter_photo: FileSchema,
});

const SHELTER_APPLICATION_BUCKET = "shelter_photos";

type ShelterApplicationDocumentKey =
  | "registration_certificate"
  | "owner_valid_id"
  | "lease_contract"
  | "shelter_photo";

type ShelterApplicationUploadMap = Record<
  ShelterApplicationDocumentKey,
  string
>;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; details?: unknown };

export interface IAuthService {
  signup(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>>;
  signupShelter(input: unknown): Promise<
    ServiceResult<{
      user: unknown;
      session: unknown;
      application_status: "pending";
    }>
  >;
  submitShelterApplication(input: unknown): Promise<
    ServiceResult<{
      user: unknown;
      session: unknown;
      application_status: "pending";
    }>
  >;
  login(
    input: unknown,
  ): Promise<ServiceResult<{ user: unknown; session: unknown }>>;
  me(): Promise<ServiceResult<{ user: unknown }>>;
  logout(): Promise<ServiceResult<null>>;
  deleteAccount(): Promise<ServiceResult<null>>;
  changePassword(input: unknown): Promise<ServiceResult<null>>;
}

class AuthService implements IAuthService {
  private getFileExtension(file: File) {
    const extension = file.name.split(".").pop()?.trim().toLowerCase();

    return extension || "bin";
  }

  private async uploadShelterApplicationFile(
    userId: string,
    file: File,
    label: ShelterApplicationDocumentKey,
  ) {
    const supabaseAdmin = createAdminClient();
    const extension = this.getFileExtension(file);
    const path = `applications/${userId}/${Date.now()}-${label}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error } = await supabaseAdmin.storage
      .from(SHELTER_APPLICATION_BUCKET)
      .upload(path, arrayBuffer, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabaseAdmin.storage
      .from(SHELTER_APPLICATION_BUCKET)
      .getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("Failed to create document URL");
    }

    return data.publicUrl;
  }

  private async createUserProfile(input: {
    id: string;
    email: string;
    username: string;
    full_name: string;
  }) {
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin.from("users").upsert(
      {
        id: input.id,
        username: input.username,
        full_name: input.full_name,
        contact_email: input.email,
        role: "user",
      },
      {
        onConflict: "id",
      },
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  private async saveShelterApplication(input: {
    userId: string;
    email: string;
    username: string;
    full_name: string;
    shelter_name: string;
    complete_address: string;
    registration_certificate: File;
    owner_valid_id: File;
    lease_contract: File;
    shelter_photo: File;
  }) {
    const supabaseAdmin = createAdminClient();
    const uploadedFiles = {} as ShelterApplicationUploadMap;
    const uploadEntries: Array<[ShelterApplicationDocumentKey, File]> = [
      ["registration_certificate", input.registration_certificate],
      ["owner_valid_id", input.owner_valid_id],
      ["lease_contract", input.lease_contract],
      ["shelter_photo", input.shelter_photo],
    ];

    for (const [key, file] of uploadEntries) {
      uploadedFiles[key] = await this.uploadShelterApplicationFile(
        input.userId,
        file,
        key,
      );
    }

    const { error: shelterError } = await supabaseAdmin.from("shelter").upsert(
      {
        owner_id: input.userId,
        shelter_name: input.shelter_name,
        location: input.complete_address,
        contact_email: input.email,
        cert_url: uploadedFiles.registration_certificate,
        id_url: uploadedFiles.owner_valid_id,
        lease_url: uploadedFiles.lease_contract,
        photo_url: uploadedFiles.shelter_photo,
      },
      {
        onConflict: "owner_id",
      },
    );

    if (shelterError) {
      throw new Error(shelterError.message);
    }

    const { error: metadataError } =
      await supabaseAdmin.auth.admin.updateUserById(input.userId, {
        user_metadata: {
          username: input.username,
          full_name: input.full_name,
          requested_role: "shelter",
          shelter_application_status: "pending",
          shelter_application: {
            shelter_name: input.shelter_name,
            complete_address: input.complete_address,
            registration_certificate_url:
              uploadedFiles.registration_certificate,
            owner_valid_id_url: uploadedFiles.owner_valid_id,
            lease_contract_url: uploadedFiles.lease_contract,
            shelter_photo_url: uploadedFiles.shelter_photo,
            submitted_at: new Date().toISOString(),
          },
        },
      });

    if (metadataError) {
      throw new Error(metadataError.message);
    }
  }

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

  async signupShelter(input: unknown): Promise<
    ServiceResult<{
      user: unknown;
      session: unknown;
      application_status: "pending";
    }>
  > {
    const parsed = ShelterSignupSchema.safeParse(input);

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
          requested_role: "shelter",
          shelter_application_status: "pending",
        },
      },
    });

    if (error) {
      return { ok: false, status: 400, error: error.message };
    }

    const createdUser = data.user;

    if (!createdUser) {
      return {
        ok: false,
        status: 400,
        error: "Failed to create shelter account",
      };
    }

    const supabaseAdmin = createAdminClient();

    try {
      await this.createUserProfile({
        id: createdUser.id,
        email: parsed.data.email,
        username: parsed.data.username,
        full_name: parsed.data.full_name,
      });

      await this.saveShelterApplication({
        userId: createdUser.id,
        email: parsed.data.email,
        username: parsed.data.username,
        full_name: parsed.data.full_name,
        shelter_name: parsed.data.shelter_name,
        complete_address: parsed.data.complete_address,
        registration_certificate: parsed.data.registration_certificate,
        owner_valid_id: parsed.data.owner_valid_id,
        lease_contract: parsed.data.lease_contract,
        shelter_photo: parsed.data.shelter_photo,
      });

      return {
        ok: true,
        data: {
          user: data.user,
          session: data.session,
          application_status: "pending",
        },
      };
    } catch (signupError) {
      await supabaseAdmin.auth.admin.deleteUser(createdUser.id, false);

      return {
        ok: false,
        status: 400,
        error:
          signupError instanceof Error
            ? signupError.message
            : "Failed to submit shelter application",
      };
    }
  }

  async submitShelterApplication(input: unknown): Promise<
    ServiceResult<{
      user: unknown;
      session: unknown;
      application_status: "pending";
    }>
  > {
    const parsed = ShelterApplicationSchema.safeParse(input);

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        ok: false,
        status: 401,
        error: authError?.message || "Unauthorized",
      };
    }

    const supabaseAdmin = createAdminClient();
    const { data: userRow, error: userError } = await supabaseAdmin
      .from("users")
      .select("username, full_name, contact_email")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userRow) {
      return {
        ok: false,
        status: 400,
        error: userError?.message || "User profile not found",
      };
    }

    try {
      await this.saveShelterApplication({
        userId: user.id,
        email: userRow.contact_email || user.email || "",
        username: userRow.username || user.user_metadata.username || "",
        full_name: userRow.full_name || user.user_metadata.full_name || "",
        shelter_name: parsed.data.shelter_name,
        complete_address: parsed.data.complete_address,
        registration_certificate: parsed.data.registration_certificate,
        owner_valid_id: parsed.data.owner_valid_id,
        lease_contract: parsed.data.lease_contract,
        shelter_photo: parsed.data.shelter_photo,
      });

      return {
        ok: true,
        data: {
          user,
          session: null,
          application_status: "pending",
        },
      };
    } catch (applicationError) {
      return {
        ok: false,
        status: 400,
        error:
          applicationError instanceof Error
            ? applicationError.message
            : "Failed to submit shelter application",
      };
    }
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

export async function signupShelter(input: unknown): Promise<
  ServiceResult<{
    user: unknown;
    session: unknown;
    application_status: "pending";
  }>
> {
  return authService.signupShelter(input);
}

export async function submitShelterApplication(input: unknown): Promise<
  ServiceResult<{
    user: unknown;
    application_status: "pending";
  }>
> {
  return authService.submitShelterApplication(input);
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
