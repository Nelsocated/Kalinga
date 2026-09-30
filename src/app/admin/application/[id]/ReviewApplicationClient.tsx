"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, XCircle } from "@phosphor-icons/react";
import type { ShelterApplicationItem, ShelterApplicationStatus } from "@/src/lib/services/adminService";
import DocumentModal, { isImageUrl } from "@/src/components/modal/DocumentModal";
import WebTemplate from "@/src/components/template/WebTemplate";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import StatusChip from "@/src/components/ui/StatusChip";
import Textarea from "@/src/components/ui/Textarea";
import { unwrap } from "@/src/lib/actionResult";
import { reviewApplicationAction } from "@/src/app/actions/admin";

type Props = {
  initialData: ShelterApplicationItem;
};

type ExtendedShelterApplicationItem = ShelterApplicationItem & {
  username?: string | null;
};

type Decision = Extract<ShelterApplicationStatus, "approved" | "rejected">;

/** Review one shelter application: details, private documents, approve or reject. */
export default function ReviewApplicationClient({ initialData }: Props) {
  const router = useRouter();
  const [application, setApplication] = useState<ExtendedShelterApplicationItem>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Decision | null>(null);
  const [note, setNote] = useState(initialData.applicationReviewNote ?? "");
  const [openDocument, setOpenDocument] = useState<{ title: string; url: string | null } | null>(null);

  const status = application.applicationStatus;

  const documents = [
    { label: "Registration certificate", url: application.cert_url },
    { label: "Owner's valid ID", url: application.id_url },
    { label: "Contract of lease", url: application.lease_url },
    { label: "Shelter photo", url: application.photo_url },
  ];

  const details: [string, string | null | undefined][] = [
    ["Shelter name", application.shelterName],
    ["Username", application.username],
    ["Email", application.contactEmail],
    ["Phone", application.contactPhone],
    ["Address", application.location],
  ];

  async function decide(decision: Decision) {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const updated = unwrap(await reviewApplicationAction(application.id, decision, note.trim() || null));
      setApplication((prev) => ({ ...prev, ...updated }));
      setSuccessMsg(decision === "approved" ? "Application approved. The shelter can now post." : "Application rejected.");
      setConfirm(null);
      router.refresh();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Couldn't update the application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <WebTemplate
        header={
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="min-w-0 truncate text-headline text-ink">{application.shelterName}</h1>
            <StatusChip status={status} />
          </div>
        }
        main={
          <div className="flex max-w-3xl flex-col gap-8">
            <section aria-labelledby="details-heading" className="flex flex-col gap-3">
              <h2 id="details-heading" className="text-lg font-semibold text-ink">
                Details
              </h2>
              <dl className="grid gap-x-8 gap-y-3 rounded-lg border border-line bg-card p-4 sm:grid-cols-[auto_1fr]">
                {details.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-sm text-muted">{label}</dt>
                    <dd className="text-sm font-medium break-words text-ink">{value?.trim() || "Not given"}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="docs-heading" className="flex flex-col gap-3">
              <h2 id="docs-heading" className="text-lg font-semibold text-ink">
                Documents
              </h2>
              <ul className="grid grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <li key={doc.label}>
                    <button
                      type="button"
                      disabled={!doc.url}
                      onClick={() => setOpenDocument({ title: doc.label, url: doc.url })}
                      className="group flex w-full flex-col overflow-hidden rounded-lg border border-line bg-card text-left transition-[box-shadow,transform] duration-200 ease-out-expo enabled:hover:-translate-y-0.5 enabled:hover:shadow-lift disabled:opacity-60"
                    >
                      <span className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-ground">
                        {doc.url && isImageUrl(doc.url) ? (
                          // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL
                          <img src={doc.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <FileText size={36} className="text-ink-soft" aria-hidden="true" />
                        )}
                      </span>
                      <span className="flex flex-col gap-0.5 p-3">
                        <span className="text-sm font-semibold text-ink">{doc.label}</span>
                        <span className="text-xs text-muted">{doc.url ? "Open" : "Not uploaded"}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="decision-heading" className="flex flex-col gap-3">
              <h2 id="decision-heading" className="text-lg font-semibold text-ink">
                Decision
              </h2>
              {errorMsg ? (
                <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                  {errorMsg}
                </p>
              ) : null}
              {successMsg ? (
                <p role="status" className="rounded-md bg-approved/14 px-3 py-2 text-sm text-approved-text">
                  {successMsg}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  icon={<CheckCircle aria-hidden="true" />}
                  disabled={status === "approved"}
                  onClick={() => setConfirm("approved")}
                >
                  {status === "approved" ? "Approved" : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  icon={<XCircle aria-hidden="true" />}
                  disabled={status === "rejected"}
                  onClick={() => setConfirm("rejected")}
                >
                  {status === "rejected" ? "Rejected" : "Reject"}
                </Button>
              </div>
            </section>
          </div>
        }
      />

      <Modal
        open={!!confirm}
        onClose={() => !submitting && setConfirm(null)}
        title={confirm === "approved" ? `Approve ${application.shelterName}?` : `Reject ${application.shelterName}?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant={confirm === "approved" ? "primary" : "destructive"}
              loading={submitting}
              onClick={() => confirm && decide(confirm)}
            >
              {confirm === "approved" ? "Approve" : "Reject"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            {confirm === "approved"
              ? "The shelter's account becomes a shelter account and it can start posting pets."
              : "The shelter stays a regular account. You can approve it later."}
          </p>
          <Textarea label="Note for the record (optional)" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </Modal>

      <DocumentModal
        isOpen={!!openDocument}
        title={openDocument?.title ?? ""}
        documentUrl={openDocument?.url ?? null}
        onClose={() => setOpenDocument(null)}
      />
    </>
  );
}
