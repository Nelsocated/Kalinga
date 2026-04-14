"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  title: string;
  documentUrl: string | null;
  onClose: () => void;
};

function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(url);
}

export default function DocumentModal({
  isOpen,
  title,
  documentUrl,
  onClose,
}: Props) {
  if (!isOpen) return null;

  const showImage = documentUrl ? isImage(documentUrl) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[15px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold text-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[15px] border px-3 py-1.5 text-sm font-medium hover:scale-105 "
          >
            Close
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-neutral-100">
          {documentUrl ? (
            <DocumentViewer
              key={documentUrl}
              title={title}
              documentUrl={documentUrl}
              showImage={showImage}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-sm text-neutral-500">
              No document available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentViewer({
  title,
  documentUrl,
  showImage,
}: {
  title: string;
  documentUrl: string;
  showImage: boolean;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-sm font-medium text-neutral-500">
            Loading document...
          </div>
        </div>
      )}

      {showImage ? (
        <Image
          src={documentUrl}
          alt={title}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          width={1000}
          height={1000}
          className={`h-full w-full object-contain ${
            loading ? "invisible" : "visible"
          }`}
        />
      ) : (
        <iframe
          src={documentUrl}
          title={title}
          onLoad={() => setLoading(false)}
          className={`h-full w-full ${loading ? "invisible" : "visible"}`}
        />
      )}
    </>
  );
}
