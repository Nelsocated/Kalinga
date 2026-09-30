"use client";

import type { NotificationItem } from "@/src/app/site/notification/page";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import StatusSteps from "../cards/StatusCard";

type Props = {
  open: boolean;
  item: NotificationItem | null;
  onClose: () => void;
};

/** An application update in full, with where it sits in the process. */
export default function StatusModal({ open, item, onClose }: Props) {
  return (
    <Modal
      open={open && !!item}
      onClose={onClose}
      title={item?.title ?? "Application update"}
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {item ? (
        <div className="flex flex-col gap-6">
          <p className="whitespace-pre-line text-ink-soft">{item.fullMessage}</p>
          <StatusSteps status={item.status} />
        </div>
      ) : null}
    </Modal>
  );
}
