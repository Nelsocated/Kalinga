"use client";

import { PaperPlaneTilt, Tray } from "@phosphor-icons/react";
import TabBar from "./TabBar";

export type MessagesView = "inbox" | "sent";

export default function MessagesTabs({
  mode,
  setMode,
}: {
  mode: MessagesView;
  setMode: (mode: MessagesView) => void;
}) {
  return (
    <TabBar
      label="Message folders"
      idPrefix="messages"
      active={mode}
      onChange={setMode}
      tabs={[
        { key: "inbox", label: "Inbox", icon: Tray },
        { key: "sent", label: "Sent", icon: PaperPlaneTilt },
      ]}
    />
  );
}
