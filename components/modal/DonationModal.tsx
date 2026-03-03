"use client";

import { useEffect, useState } from "react";
import Donate from "@/public/buttons/Donate.svg";
import Image from "next/image";

type Donation = {
  id: string;
  type: "goods" | "monetary";
  item_name?: string | null;
  method?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  qr_url?: string | null;
};

type Props = {
  shelterId: string;
  buttonClassName?: string;
};

export default function DonationModal({ shelterId, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState<"goods" | "monetary">("goods");

  useEffect(() => {
    if (!isOpen) return;

    const fetchDonations = async () => {
      const res = await fetch(`/api/donations?shelter_id=${shelterId}`);
      const json = await res.json();
      setData(json.data ?? []);
    };

    fetchDonations();
  }, [isOpen, shelterId]);

  const goods = data.filter((d) => d.type === "goods");
  const monetary = data.filter((d) => d.type === "monetary");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={[
          "text-white font-semibold flex flex-col items-center",
          buttonClassName,
        ].join(" ")}
      >
        <Image src={Donate} alt="donate-icon" width={45} height={45} />
        Donate
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Card */}
          <div className="relative z-10 w-[500px] max-w-[90%] rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-[#f3be0f] py-4 text-center text-xl font-bold rounded-t-3xl">
              Donations
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("goods")}
                className={`flex-1 py-2 font-semibold ${
                  activeTab === "goods"
                    ? "border-b-2 border-[#f3be0f]"
                    : "opacity-60"
                }`}
              >
                Goods
              </button>

              <button
                onClick={() => setActiveTab("monetary")}
                className={`flex-1 py-2 font-semibold ${
                  activeTab === "monetary"
                    ? "border-b-2 border-[#f3be0f]"
                    : "opacity-60"
                }`}
              >
                Monetary
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto p-5 space-y-4">
              {activeTab === "goods" &&
                goods.map((item) => (
                  <div key={item.id} className="rounded-xl border p-3">
                    {item.item_name}
                  </div>
                ))}

              {activeTab === "monetary" &&
                monetary.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-3 space-y-1"
                  >
                    <div className="font-semibold">
                      {item.method?.toUpperCase()}
                    </div>

                    {item.account_name && (
                      <div>Account Name: {item.account_name}</div>
                    )}

                    {item.account_number && (
                      <div>Account No: {item.account_number}</div>
                    )}

                    {item.qr_url && (
                      <img
                        src={item.qr_url}
                        alt="QR"
                        className="mt-2 w-40 rounded-lg"
                      />
                    )}
                  </div>
                ))}

              {!goods.length && activeTab === "goods" && (
                <div className="text-sm opacity-60">No goods listed.</div>
              )}

              {!monetary.length && activeTab === "monetary" && (
                <div className="text-sm opacity-60">
                  No payment methods available.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-black px-6 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
