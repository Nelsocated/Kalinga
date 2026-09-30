"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { runAction } from "@/src/lib/action";
import { requireOwnedShelterId } from "@/src/lib/utils/auth";
import { assertShelterOwnsPet, createPet } from "@/src/lib/services/petService";
import { createFoster } from "@/src/lib/services/fosterService";

const CreatePetSchema = z.object({
  name: z.string().trim().min(1, "Pet name is required."),
  description: z.string().trim().nullish(),
  breed: z.string().trim().nullish(),
  species: z.enum(["dog", "cat"]),
  sex: z.enum(["male", "female"]),
  age: z.enum(["kitten/puppy", "young_adult", "adult", "senior"]),
  size: z.enum(["small", "medium", "large"]),
  status: z.enum(["available", "pending", "adopted"]).optional(),
  vaccinated: z.boolean().optional(),
  spayed_neutered: z.boolean().optional(),
  photo_url: z.string().nullish(),
  // The add-pet form sends the year the pet arrived as text, e.g. "2021"
  year_inShelter: z.coerce
    .number()
    .int()
    .min(1980, "Year in shelter must be a year, e.g. 2021.")
    .max(new Date().getFullYear(), "Year in shelter can't be in the future."),
});

const CreateFosterSchema = z.object({
  petId: z.string().trim().min(1, "Pet is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Story is required"),
  // The form's "not available" option marks the pet as pending
  adoptionStatus: z
    .enum(["available", "not_available", ""])
    .optional()
    .transform((value) =>
      value === "available"
        ? "available"
        : value === "not_available"
          ? "pending"
          : undefined,
    ),
});

export async function createPetAction(input: z.input<typeof CreatePetSchema>) {
  return runAction(async () => {
    const shelterId = await requireOwnedShelterId();
    const created = await createPet({ ...CreatePetSchema.parse(input), shelter_id: shelterId });
    revalidatePath("/shelter/profiles/shelter");
    return created;
  });
}

export async function createFosterAction(input: z.input<typeof CreateFosterSchema>) {
  return runAction(async () => {
    const shelterId = await requireOwnedShelterId();
    const parsed = CreateFosterSchema.parse(input);
    await assertShelterOwnsPet(shelterId, parsed.petId);
    const created = await createFoster(parsed);
    revalidatePath("/site/explore");
    return created;
  });
}
