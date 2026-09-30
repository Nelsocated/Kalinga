"use client";

import { useState } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import Modal from "../ui/Modal";
import { LinkButton } from "../ui/Button";

type Props = {
  isOpen: boolean;
  title: string;
  documentUrl: string | null;
  onClose: () => void;
};

/** Signed URLs carry a query string, so test the path only. */
export function isImageUrl(url: string) {
  try {
    return /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(new URL(url).pathname);
  } catch {
    return /\.(jpe?g|png|webp|gif|bmp|svg)(\?|$)/i.test(url);
  }
}

/** A private shelter document: image or PDF, with a link to open it in a new tab. */
export default function DocumentModal({ isOpen, title, documentUrl, onClose }: Props) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title}
      className="sm:max-w-4xl"
      bodyClassName="flex min-h-0 flex-1 flex-col"
      footer={
        documentUrl ? (
          <>
            <p className="mr-auto text-xs text-muted">Links to private documents expire after 10 minutes.</p>
            <LinkButton href={documentUrl} target="_blank" rel="noopener noreferrer" variant="secondary" icon={<ArrowSquareOut aria-hidden="true" />}>
              Open in new tab
            </LinkButton>
          </>
        ) : undefined
      }
    >
      <div className="relative h-[70dvh] overflow-hidden rounded-md bg-ground">
        {documentUrl ? (
          <DocumentViewer key={documentUrl} title={title} documentUrl={documentUrl} />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-muted">No document uploaded.</p>
        )}
      </div>
    </Modal>
  );
}

function DocumentViewer({ title, documentUrl }: { title: string; documentUrl: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <p role="status" className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Loading document…
        </p>
      ) : null}
      {isImageUrl(documentUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, skip the optimizer
        <img
          src={documentUrl}
          alt={title}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`h-full w-full object-contain ${loading ? "invisible" : ""}`}
        />
      ) : (
        <iframe
          src={documentUrl}
          title={title}
          onLoad={() => setLoading(false)}
          className={`h-full w-full ${loading ? "invisible" : ""}`}
        />
      )}
    </>
  );
}
