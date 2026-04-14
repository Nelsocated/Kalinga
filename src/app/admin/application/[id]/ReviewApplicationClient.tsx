"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ShelterApplicationItem,
  ShelterApplicationStatus,
} from "@/src/lib/services/adminService";
import DocumentModal from "../../../../components/modal/DocumentModal";
import WebTemplate from "@/src/components/template/WebTemplate";
import Button from "@/src/components/ui/Button";

type Props = {
  initialData: ShelterApplicationItem;
};

type UploadFieldKey =
  | "registration_certificate"
  | "owner_valid_id"
  | "lease_contract"
  | "shelter_photo";

type ShelterDocumentItem = {
  key: UploadFieldKey;
  label: string;
  url: string | null;
};

type ExtendedShelterApplicationItem = ShelterApplicationItem & {
  username?: string | null;
  documentUrls?: Partial<Record<UploadFieldKey, string | null>>;
};

function getStatusClass(status: ShelterApplicationStatus) {
  switch (status) {
    case "approved":
      return "border-approved bg-approved text-white";
    case "rejected":
      return "border-reject bg-reject text-white";
    case "under_review":
      return "border-under_review bg-under_review text-white";
    default:
      return "border-neutral-300 bg-neutral-100 text-neutral-700";
  }
}

export default function ReviewApplicationClient({ initialData }: Props) {
  const router = useRouter();

  const [application, setApplication] =
    useState<ExtendedShelterApplicationItem>(
      initialData as ExtendedShelterApplicationItem,
    );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isApproved = application.applicationStatus === "approved";
  const isRejected = application.applicationStatus === "rejected";

  const [openDocument, setOpenDocument] = useState<{
    title: string;
    url: string | null;
  } | null>(null);

  const statusClass = useMemo(
    () => getStatusClass(application.applicationStatus),
    [application.applicationStatus],
  );

  const documents: ShelterDocumentItem[] = useMemo(
    () => [
      {
        key: "registration_certificate",
        label: "Registration Certificate",
        url: application.cert_url ?? null,
      },
      {
        key: "owner_valid_id",
        label: "Valid ID of the Owner",
        url: application.id_url ?? null,
      },
      {
        key: "lease_contract",
        label: "Notarized Contract of lease of occupied Space/Building",
        url: application.lease_url ?? null,
      },
      {
        key: "shelter_photo",
        label: "Photos of the Shelter",
        url: application.photo_url ?? null,
      },
    ],
    [
      application.cert_url,
      application.id_url,
      application.lease_url,
      application.photo_url,
    ],
  );

  async function handleUpdate(status: ShelterApplicationStatus) {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        data?: ShelterApplicationItem | null;
        error?: string | null;
      } | null;

      if (!res.ok || !json?.ok || !json?.data) {
        throw new Error(json?.error ?? `Request failed (${res.status})`);
      }

      setApplication((prev) => ({
        ...prev,
        ...json.data,
      }));

      setSuccessMsg(
        status === "approved"
          ? "Application approved successfully."
          : status === "rejected"
            ? "Application rejected successfully."
            : "Application updated successfully.",
      );

      router.refresh();
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to update application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <WebTemplate
        header={<div>Shelter Verification</div>}
        main={
          <>
            <section className="space-y-3 py-2">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-black">
                  Account Details
                </h2>

                <span
                  className={`rounded-[15px] border px-3 py-1 text-description font-semibold capitalize ${statusClass}`}
                >
                  {application.applicationStatus.replace("_", " ")}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" value={application.contactEmail} />
                <Field label="Password" value="••••••••••" />
                <Field label="Shelter Name" value={application.shelterName} />
                <Field label="Username" value={application.username ?? "—"} />
                <Field label="Location" value={application.location} />
                <Field label="Phone" value={application.contactPhone} />
              </div>

              <h2 className="text-lg font-bold text-black">Documents</h2>

              <div className="space-y-4">
                {documents.map((doc) => {
                  const isAvailable = !!doc.url;

                  return (
                    <div key={doc.key}>
                      <p className="mb-2 text-descriptipm font-semibold text-black">
                        {doc.label}
                      </p>

                      <Button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() =>
                          setOpenDocument({
                            title: doc.label,
                            url: doc.url,
                          })
                        }
                        className="w-full text-center"
                      >
                        {isAvailable
                          ? "View Documents"
                          : "No Document Uploaded"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="space-y-3 py-3">
              <button
                type="button"
                disabled={submitting || isApproved}
                onClick={() => handleUpdate("approved")}
                className={`w-full border border-approved rounded-[15px] text-sm font-bold py-2 hover:scale-105
                 ${isApproved ? "opacity-50 cursor-not-allowed" : "hover:bg-approved text-black"}`}
              >
                {isApproved
                  ? "Already Approved"
                  : submitting
                    ? "Processing..."
                    : "Approve Application"}
              </button>

              <button
                type="button"
                disabled={submitting || isRejected}
                onClick={() => handleUpdate("rejected")}
                className={`w-full border border-reject rounded-[15px] text-sm font-bold py-2 hover:scale-105
                ${isRejected ? "opacity-50 cursor-not-allowed" : "hover:bg-reject text-black"}`}
              >
                {isRejected
                  ? "Already Rejected"
                  : submitting
                    ? "Processing..."
                    : "Reject Application"}
              </button>
            </div>

            {errorMsg ? (
              <div className="rounded-[15px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMsg}
              </div>
            ) : null}

            {successMsg ? (
              <div className="rounded-[15px] border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMsg}
              </div>
            ) : null}
          </>
        }
      />

      <DocumentModal
        isOpen={!!openDocument}
        title={openDocument?.title ?? ""}
        documentUrl={openDocument?.url ?? null}
        onClose={() => setOpenDocument(null)}
      />
    </>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">
        {label}
      </label>

      <div className="flex h-10 items-center rounded-[10px] border px-4 text-sm text-neutral-500">
        {value && value.trim() ? value : label}
      </div>
    </div>
  );
}
