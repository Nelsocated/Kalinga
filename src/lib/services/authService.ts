import "server-only";
import { z } from "zod";
import type { User, Session } from "@supabase/supabase-js";
import { createServerSupabase } from "@/src/lib/supabase/server";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createAuthServerClient } from "@/src/lib/supabase/authServer";
import { ApiError } from "@/src/lib/api";

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

const ShelterApplicationSchema = z.object({
  shelter_name: z.string().trim().min(2, "Shelter name is required"),
  complete_address: z.string().trim().min(10, "Complete address is required"),
  registration_certificate: FileSchema,
  owner_valid_id: FileSchema,
  lease_contract: FileSchema,
  shelter_photo: FileSchema,
});

const ShelterSignupSchema = SignupSchema.extend(
  ShelterApplicationSchema.shape,
);

type ShelterApplication = z.infer<typeof ShelterApplicationSchema>;

// Private bucket: owner ID, lease and registration certificate. The admin
// review page reads them through short-lived signed URLs.
export const SHELTER_DOCUMENT_BUCKET = "shelter_documents";
// Public bucket: the shelter photo is shown on the profile.
const SHELTER_PHOTO_BUCKET = "shelter_photos";

type AuthResult = { user: User | null; session: Session | null };
type ShelterApplicationResult = AuthResult & { application_status: "pending" };

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.trim().toLowerCase() || "bin";
}

/** Uploads one application file and returns what gets stored in the row. */
async function uploadShelterApplicationFile(
  userId: string,
  file: File,
  label: string,
  visibility: "private" | "public",
): Promise<string> {
  const supabaseAdmin = createAdminClient();
  const bucket =
    visibility === "private" ? SHELTER_DOCUMENT_BUCKET : SHELTER_PHOTO_BUCKET;
  const path = `applications/${userId}/${Date.now()}-${label}.${getFileExtension(file)}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, await file.arrayBuffer(), {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (error) throw new Error(error.message);

  // Private documents are stored as a storage path, never a URL
  if (visibility === "private") return path;

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  if (!data.publicUrl) throw new Error("Failed to create photo URL");

  return data.publicUrl;
}

async function createUserProfile(input: {
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
    { onConflict: "id" },
  );

  if (error) throw new Error(error.message);
}

async function saveShelterApplication(
  owner: { userId: string; email: string; username: string; full_name: string },
  application: ShelterApplication,
) {
  const { userId } = owner;
  const supabaseAdmin = createAdminClient();

  const certPath = await uploadShelterApplicationFile(
    userId,
    application.registration_certificate,
    "registration_certificate",
    "private",
  );
  const idPath = await uploadShelterApplicationFile(
    userId,
    application.owner_valid_id,
    "owner_valid_id",
    "private",
  );
  const leasePath = await uploadShelterApplicationFile(
    userId,
    application.lease_contract,
    "lease_contract",
    "private",
  );
  const photoUrl = await uploadShelterApplicationFile(
    userId,
    application.shelter_photo,
    "shelter_photo",
    "public",
  );

  const { error: shelterError } = await supabaseAdmin.from("shelter").upsert(
    {
      owner_id: userId,
      shelter_name: application.shelter_name,
      location: application.complete_address,
      contact_email: owner.email,
      cert_url: certPath,
      id_url: idPath,
      lease_url: leasePath,
      photo_url: photoUrl,
    },
    { onConflict: "owner_id" },
  );

  if (shelterError) throw new Error(shelterError.message);

  const { error: metadataError } =
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        username: owner.username,
        full_name: owner.full_name,
        shelter_application_status: "pending",
        shelter_application: {
          shelter_name: application.shelter_name,
          complete_address: application.complete_address,
          shelter_photo_url: photoUrl,
          submitted_at: new Date().toISOString(),
        },
      },
    });

  if (metadataError) throw new Error(metadataError.message);
}

export async function signup(input: unknown): Promise<AuthResult> {
  const parsed = SignupSchema.parse(input);
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: {
        username: parsed.username,
        full_name: parsed.full_name,
      },
    },
  });

  if (error) throw new ApiError(400, error.message);

  return { user: data.user, session: data.session };
}

export async function signupShelter(
  input: unknown,
): Promise<ShelterApplicationResult> {
  const parsed = ShelterSignupSchema.parse(input);
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: {
        username: parsed.username,
        full_name: parsed.full_name,
        shelter_application_status: "pending",
      },
    },
  });

  if (error) throw new ApiError(400, error.message);

  const createdUser = data.user;

  if (!createdUser) throw new ApiError(400, "Failed to create shelter account");

  try {
    const owner = {
      userId: createdUser.id,
      email: parsed.email,
      username: parsed.username,
      full_name: parsed.full_name,
    };

    await createUserProfile({ id: createdUser.id, ...owner });
    await saveShelterApplication(owner, parsed);
  } catch (signupError) {
    // Roll back the half-created account so the email can be reused
    await createAdminClient().auth.admin.deleteUser(createdUser.id, false);

    throw new ApiError(
      400,
      signupError instanceof Error
        ? signupError.message
        : "Failed to submit shelter application",
    );
  }

  return {
    user: data.user,
    session: data.session,
    application_status: "pending",
  };
}

/** A signed-in user applies to turn their account into a shelter. */
export async function submitShelterApplication(
  user: User,
  input: unknown,
): Promise<ShelterApplicationResult> {
  const parsed = ShelterApplicationSchema.parse(input);
  const supabase = await createServerSupabase();

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("username, full_name, contact_email")
    .eq("id", user.id)
    .maybeSingle();

  if (userError) throw new Error(userError.message);
  if (!userRow) throw new ApiError(400, "User profile not found");

  try {
    await saveShelterApplication(
      {
        userId: user.id,
        email: userRow.contact_email || user.email || "",
        username: userRow.username || user.user_metadata.username || "",
        full_name: userRow.full_name || user.user_metadata.full_name || "",
      },
      parsed,
    );
  } catch (applicationError) {
    throw new ApiError(
      400,
      applicationError instanceof Error
        ? applicationError.message
        : "Failed to submit shelter application",
    );
  }

  return { user, session: null, application_status: "pending" };
}

export async function login(input: unknown): Promise<AuthResult> {
  const parsed = LoginSchema.parse(input);
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });

  if (error) throw new ApiError(401, error.message);

  return { user: data.user, session: data.session };
}

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  return data.user ?? null;
}

export async function logout(): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) throw new ApiError(400, error.message);
}

export async function deleteAccount(userId: string): Promise<void> {
  const { error } = await createAdminClient().auth.admin.deleteUser(
    userId,
    false,
  );

  if (error) throw new ApiError(400, error.message);
}

export async function changePassword(
  user: User,
  input: unknown,
): Promise<void> {
  const parsed = ChangePasswordSchema.parse(input);

  const currentEmail = user.email?.toLowerCase().trim();
  const submittedEmail = parsed.email.toLowerCase().trim();

  if (!currentEmail || currentEmail !== submittedEmail) {
    throw new ApiError(
      403,
      "Email confirmation does not match the signed-in account",
    );
  }

  // Verify the current password on a throwaway client so the caller's
  // session cookies are left alone
  const { error: verifyError } =
    await createAuthServerClient().auth.signInWithPassword({
      email: submittedEmail,
      password: parsed.currentPassword,
    });

  if (verifyError) throw new ApiError(401, "Current password is incorrect");

  const { error: updateError } =
    await createAdminClient().auth.admin.updateUserById(user.id, {
      password: parsed.newPassword,
    });

  if (updateError) throw new ApiError(400, updateError.message);
}
