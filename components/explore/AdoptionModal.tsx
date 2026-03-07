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

          <div className="relative flex w-full" style={{ width: "459px", height: "241px", maxWidth: "100%" }}>
            <div
              className="absolute bg-[#f3be0f]"
              style={{ left: "11px", top: "-1px", width: "445px", height: "85px", borderRadius: "11.24px" }}
              aria-hidden="true"
            />

            <div
              className="absolute flex flex-col border bg-white"
              style={{
                left: "11px",
                top: "57px",
                width: "445px",
                height: "183px",
                borderRadius: "7.78px",
                borderColor: "#d9d9d9",
                borderWidth: "0.97px",
                gap: "24px",
              }}
            >
              <div
                className="relative flex flex-col items-start"
                style={{ marginLeft: "23.3px", marginTop: "23.3px", width: "398.78px", height: "73.78px", gap: "7.78px" }}
              >
                <p id="dialog-description" className="text-[#1e1e1e]" style={{ margin: 0, fontSize: "15.6px", lineHeight: "21.8px" }}>
                  Thank you for submitting your adoption application!
                </p>
                <p className="text-[#757575]" style={{ margin: 0, fontSize: "15.6px", lineHeight: "21.8px" }}>
                  {message}
                  {referenceId ? ` Reference ID: ${referenceId}` : ""}
                </p>
              </div>

              <div className="relative flex items-center bg-white" style={{ marginLeft: "23.3px", width: "398.78px", height: "39.07px", gap: "15.56px" }}>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="relative flex-1 cursor-pointer overflow-hidden bg-[#f3be0f] text-neutral-100 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "7.78px", padding: "11.67px", fontSize: "15.6px", lineHeight: "15.6px", fontWeight: 400 }}
                >
                  {closeLabel}
                </button>
              </div>
            </div>

            <h2
              id="dialog-title"
              className="absolute font-bold text-white"
              style={{ top: "9px", left: "42px", letterSpacing: "1.97px", fontSize: "32px", lineHeight: "normal" }}
            >
              {title}
            </h2>
          </div>
        </div>
      ) : null}
    </>
  );
}
