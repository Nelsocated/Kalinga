import { uploadDonationQr } from "@/src/lib/services/donationService";
import { requireShelter } from "@/src/lib/utils/auth";
import { ApiError, handle, ok } from "@/src/lib/api";

export const POST = handle(async (req: Request) => {
  const user = await requireShelter();
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) throw new ApiError(400, "No file provided");

  return ok({ publicUrl: await uploadDonationQr(user.id, file) });
});
