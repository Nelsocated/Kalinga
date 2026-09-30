import {
  getSessionUser,
  signupShelter,
  submitShelterApplication,
} from "@/src/lib/services/authService";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
  const formData = await req.formData().catch(() => null);

  if (!formData) throw new ApiError(400, "Invalid form data");

  const applicationPayload = {
    shelter_name: formData.get("shelter_name"),
    complete_address: formData.get("complete_address"),
    registration_certificate: formData.get("registration_certificate"),
    owner_valid_id: formData.get("owner_valid_id"),
    lease_contract: formData.get("lease_contract"),
    shelter_photo: formData.get("shelter_photo"),
  };

  const user = await getSessionUser();

  const result = user
    ? await submitShelterApplication(user, applicationPayload)
    : await signupShelter({
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
        full_name: formData.get("full_name"),
        ...applicationPayload,
      });

  return ok(result, 201);
});
