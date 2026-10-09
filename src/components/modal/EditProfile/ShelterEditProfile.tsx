"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import EditProfileModalBase from "./EditProfileModal";
import DonationsEditor, { fromDraft, toDraft, type DonationDraft } from "./DonationsEditor";
import { fetchJson, uploadFile } from "@/src/lib/fetchJson";
import { unwrap } from "@/src/lib/actionResult";
import {
  getMyDonationSettingsAction,
  saveMyDonationSettingsAction,
  updateMyShelterAction,
} from "@/src/app/actions/profile";
import type { ShelterProfile } from "@/src/lib/types/shelters";

const FIELDS = [
  { key: "shelter_name", label: "Shelter name" },
  { key: "about", label: "About" },
  { key: "location", label: "Location" },
  { key: "contact_email", label: "Email", type: "email" },
  { key: "contact_phone", label: "Phone" },
];

const EMPTY_DONATIONS: DonationDraft = { enabled: true, monetary: [], goods: { items: [], note: "" } };

export default function ShelterEditProfileModal() {
  const router = useRouter();
  const [donations, setDonations] = useState<DonationDraft>(EMPTY_DONATIONS);
  const [unnamed, setUnnamed] = useState<string[]>([]);
  const [uploadingQr, setUploadingQr] = useState(false);

  // Stable so the modal doesn't reload while the donation fields change
  const loadProfile = useCallback(async () => {
    const [{ data: shelter }, donationSettings] = await Promise.all([
      fetchJson<{ data: ShelterProfile }>("/api/shelters/me", { cache: "no-store" }),
      getMyDonationSettingsAction().then(unwrap),
    ]);
    setDonations(toDraft(donationSettings));
    setUnnamed([]);

    return {
      avatarUrl: shelter.logo_url ?? "",
      shelter_name: shelter.shelter_name ?? "",
      about: shelter.about ?? "",
      location: shelter.location ?? "",
      contact_email: shelter.contact_email ?? "",
      contact_phone: shelter.contact_phone ?? "",
    };
  }, []);

  return (
    <EditProfileModalBase
      title="Edit shelter profile"
      fields={FIELDS}
      loadProfile={loadProfile}
      saveProfile={async ({ values, avatarUrl }) => {
        const { settings, unnamed: missing } = fromDraft(donations);
        setUnnamed(missing);
        if (missing.length) {
          throw new Error(
            donations.enabled
              ? "Give each payment method a name, or remove it."
              : "A payment method has no name. Turn on Donate to name or remove it.",
          );
        }

        unwrap(await updateMyShelterAction({
          shelter_name: values.shelter_name?.trim(),
          about: values.about?.trim() || undefined,
          location: values.location?.trim() || undefined,
          contact_email: values.contact_email?.trim() || undefined,
          contact_phone: values.contact_phone?.trim() || undefined,
          logo_url: avatarUrl || undefined,
        }));
        setDonations(toDraft(unwrap(await saveMyDonationSettingsAction(settings))));
      }}
      uploadAvatar={(file) => uploadFile("/api/shelters/me/avatar", file)}
      onSaved={() => router.refresh()}
      busy={uploadingQr}
    >
      <DonationsEditor
        value={donations}
        onChange={(next) => {
          setDonations(next);
          if (unnamed.length) setUnnamed(unnamed.filter((key) => next.monetary.some((m) => m.key === key && !m.method.trim())));
        }}
        uploadQr={(file) => uploadFile("/api/shelters/me/donation-qr", file)}
        onBusyChange={setUploadingQr}
        unnamed={unnamed}
      />
    </EditProfileModalBase>
  );
}
