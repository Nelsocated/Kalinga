"use client";

import { useState } from "react";
import Image from "next/image";
import ChangePasswordView from "@/src/components/views/ChangePasswordView";
import DeleteAccountView from "@/src/components/views/DeleteAccountView";
import WebTemplate from "@/src/components/template/WebTemplate";

import CheckUser from "@/public/icons/CheckUser.svg";
import Setting from "@/public/icons/Setting.svg";

export default function SettingsPage() {
  return <WebTemplate header={<div>Settings</div>} main={SettingsTabsView()} />;
}

type TabKey = "change-password" | "delete-account";

function SettingsTabsView() {
  const [activeTab, setActiveTab] = useState<TabKey>("change-password");

  const buttonStyle = `text-lg font-semibold hover:bg-primary flex items-center rounded-[15px] pl-6 ml-7 border px-2 py-1 border-l-0`;

  return (
    <div className="overflow-y-auto scroll-stable">
      <div className="mb-5 flex gap-3 border-b py-5 justify-center relative">
        <button
          type="button"
          onClick={() => setActiveTab("change-password")}
          className={`flex items-center `}
        >
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center absolute">
            <Image src={Setting} alt="setting-icon" width={25} height={25} />
          </div>
          <span
            className={`${buttonStyle} ${activeTab === "change-password" ? "bg-primary" : "bg-white"}`}
          >
            Account Settings
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("delete-account")}
          className={`flex items-center `}
        >
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center absolute">
            <Image
              src={CheckUser}
              alt="checkuser-icon"
              width={25}
              height={25}
            />
          </div>
          <span
            className={`${buttonStyle} ${activeTab === "delete-account" ? "bg-primary" : "bg-white"}`}
          >
            Account Deletion
          </span>
        </button>
      </div>

      {activeTab === "change-password" ? (
        <ChangePasswordView />
      ) : (
        <DeleteAccountView />
      )}
    </div>
  );
}
