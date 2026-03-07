"use client";

import { ReactNode, useState } from "react";

type AdoptionModalProps = {
  trigger?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  referenceId?: string | null;
  title?: string;
  message?: string;
  closeLabel?: string;
};

export default function AdoptionModal({
  trigger,
  isOpen: controlledIsOpen,
  onClose,
  referenceId,
  title = "Application Submitted!",
  message = "We're excited that you're considering giving a pet a loving home. The shelter will be in touch soon!",
  closeLabel = "Close",
}: AdoptionModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    setInternalIsOpen(false);
  };

  const handleOpen = () => setInternalIsOpen(true);

  return (
    <>
      {trigger ? <div onClick={handleOpen}>{trigger}</div> : null}

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
          <button
            type="button"
            aria-label="Close application submitted modal"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="relative flex w-full" style={{ width: "390px", height: "214px", maxWidth: "100%" }}>
            <div
              className="absolute bg-[#f3be0f]"
              style={{ left: "10px", top: "0px", width: "370px", height: "72px", borderRadius: "10px" }}
              aria-hidden="true"
            />

            <div
              className="absolute flex flex-col border bg-white"
              style={{
                left: "10px",
                top: "49px",
                width: "370px",
                height: "158px",
                borderRadius: "7px",
                borderColor: "#d9d9d9",
                borderWidth: "0.97px",
                gap: "18px",
              }}
            >
              <div
                className="relative flex flex-col items-start"
                style={{ marginLeft: "18px", marginTop: "16px", width: "334px", height: "74px", gap: "6px" }}
              >
                <p id="dialog-description" className="text-[#1e1e1e]" style={{ margin: 0, fontSize: "13.5px", lineHeight: "18px" }}>
                  Thank you for submitting your adoption application!
                </p>
                <p className="text-[#757575]" style={{ margin: 0, fontSize: "13.5px", lineHeight: "18px" }}>
                  {message}
                  {referenceId ? ` Reference ID: ${referenceId}` : ""}
                </p>
              </div>

              <div className="relative flex items-center bg-white" style={{ marginLeft: "18px", width: "334px", height: "34px", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="relative flex-1 cursor-pointer overflow-hidden bg-[#f3be0f] text-neutral-100 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "7px", padding: "8px", fontSize: "13px", lineHeight: "13px", fontWeight: 500 }}
                >
                  {closeLabel}
                </button>
              </div>
            </div>

            <h2
              id="dialog-title"
              className="absolute font-bold text-white"
              style={{ top: "8px", left: "34px", letterSpacing: "1px", fontSize: "24px", lineHeight: "normal" }}
            >
              {title}
            </h2>
          </div>
        </div>
      ) : null}
    </>
  );
}
