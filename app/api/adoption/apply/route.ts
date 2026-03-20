import { NextResponse } from "next/server";
import { z } from "zod";

const LegacyAdoptionApplicationSchema = z.object({
  petId: z.string().min(1),
  petName: z.string().min(1),
  shelterName: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  reason: z.string().min(10),
});

const NewAdoptionApplicationSchema = z.object({
  petId: z.string().min(1),
  petName: z.string().min(1),
  shelterName: z.string().min(1),
  name: z.string().min(2),
  address: z.string().min(5),
  contact: z.string().min(3),
  reason: z.string().min(10),
  safeHome: z.boolean().optional().default(false),
  noAllergies: z.boolean().optional().default(false),
  feeding: z.boolean().optional().default(false),
  exercise: z.boolean().optional().default(false),
  vetCare: z.boolean().optional().default(false),
});

const AdoptionApplicationSchema = z.union([
  LegacyAdoptionApplicationSchema,
  NewAdoptionApplicationSchema,
]);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AdoptionApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid application form data.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const referenceId = `APP-${Date.now().toString(36).toUpperCase()}`;

  const normalizedApplication = "name" in parsed.data
    ? {
        petId: parsed.data.petId,
        petName: parsed.data.petName,
        shelterName: parsed.data.shelterName,
        applicantName: parsed.data.name,
        contact: parsed.data.contact,
        address: parsed.data.address,
        reason: parsed.data.reason,
        checklist: {
          safeHome: parsed.data.safeHome,
          noAllergies: parsed.data.noAllergies,
          feeding: parsed.data.feeding,
          exercise: parsed.data.exercise,
          vetCare: parsed.data.vetCare,
        },
      }
    : {
        petId: parsed.data.petId,
        petName: parsed.data.petName,
        shelterName: parsed.data.shelterName,
        applicantName: parsed.data.fullName,
        contact: `${parsed.data.email} / ${parsed.data.phone}`,
        address: parsed.data.address,
        reason: parsed.data.reason,
      };

  return NextResponse.json(
    {
      ok: true,
      message: "Application submitted successfully.",
      referenceId,
      application: normalizedApplication,
    },
    { status: 201 },
  );
}
