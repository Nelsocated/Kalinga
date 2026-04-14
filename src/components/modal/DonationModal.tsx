"use client";

import { useEffect, useMemo, useState } from "react";
import QR from "@/public/buttons/QR.svg";
import Donate from "@/public/buttons/Donate.svg";
import Image from "next/image";
import BackButton from "../ui/BackButton";

type Donation = {
  id: string;
  type: "goods" | "monetary";
  item_name?: string | null;
  method?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  qr_url?: string | null;
  instruction_note?: string | null;
};

type Props = {
  shelterId: string;
  buttonClassName?: string;
};

export default function DonationModal({ shelterId, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Donation[]>([]);
  const [showGoodsList, setShowGoodsList] = useState(false);
  const [openQrId, setOpenQrId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowGoodsList(false);
      setOpenQrId(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (!shelterId?.trim()) {
      setErrorMsg("Missing shelter id.");
      setData([]);
      return;
    }

    const fetchDonations = async () => {
      try {
        setErrorMsg(null);

        const res = await fetch(`/api/shelters/${shelterId}/donation`, {
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error ?? `Request failed (${res.status})`);
        }

        setData(Array.isArray(json?.data) ? json.data : []);
      } catch (err: unknown) {
        console.error("Donation fetch error:", err);

        const message =
          err instanceof Error ? err.message : "Unable to fetch donations.";

        setErrorMsg(message);
        setData([]);
      }
    };

    fetchDonations();
  }, [isOpen, shelterId]);

  const goods = useMemo(
    () =>
      data.filter((d) => d.type === "goods").flatMap((d) => d.item_name ?? []),
    [data],
  );

  const monetary = useMemo(
    () => data.filter((d) => d.type === "monetary"),
    [data],
  );

  const goodsInstruction =
    data.find((d) => d.type === "goods" && d.instruction_note?.trim())
      ?.instruction_note ?? null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={[
          "text-black font-semibold flex flex-col items-center leading-none hover:scale-105",
          buttonClassName,
        ].join(" ")}
      >
        <Image src={Donate} alt="donate-icon" width={42} height={42} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 "
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-125 max-w-[90%] rounded-[15px] border-2 bg-white shadow-2xl">
            <div className="grid grid-cols-3 items-center rounded-t-[15px] bg-primary py-4">
              <div className="pl-4">
                <BackButton onClick={() => setIsOpen(false)} />
              </div>
              <div className="text-center text-subheader font-bold text-white">
                Donations
              </div>
              <div />
            </div>

            <div className="max-h-[75vh] overflow-y-auto scroll-stable px-5 py-2 text-black space-y-2">
              {errorMsg ? (
                <div className="text-sm text-red-600">{errorMsg}</div>
              ) : null}

              {/* GOODS */}
              <div>
                <div className="text-lg font-semibold">Goods</div>

                {goodsInstruction ? (
                  <div className="text-description font-medium leading-relaxed">
                    {goodsInstruction}
                  </div>
                ) : (
                  <div className="text-description font-medium opacity-60">
                    No instruction provided.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowGoodsList((prev) => !prev)}
                  className="font-medium hover:underline text-semibold text-lg hover:scale-105 "
                >
                  {showGoodsList ? "Hide donation items" : "What to Donate?"}
                </button>

                {showGoodsList && (
                  <div className="px-4">
                    {goods.length ? (
                      <ul className="space-y-1 text-description font-medium">
                        {goods.map((item, i) => (
                          <li key={i}>- {item || "Unnamed item"}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm opacity-60">No goods listed.</div>
                    )}
                  </div>
                )}
              </div>
              <hr className="text-black/50" />

              {/* MONETARY */}
              <div>
                <div className="text-lg font-semibold">Monetary</div>

                {monetary.length ? (
                  <div>
                    {monetary.map((item) => {
                      const isQrOpen = openQrId === item.id;

                      return (
                        <div key={item.id} className="px-2 py-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-subtitle">
                              {item.method?.toUpperCase() || "PAYMENT METHOD"}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenQrId((prev) =>
                                  prev === item.id ? null : item.id,
                                )
                              }
                              disabled={!item.qr_url}
                              className="rounded-full bg-primary  p-1 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={
                                isQrOpen ? "Hide QR code" : "Show QR code"
                              }
                            >
                              <Image
                                src={QR}
                                alt="qr-icon"
                                width={23}
                                height={23}
                              />
                            </button>
                          </div>

                          {item.account_name ? (
                            <div className="text-description font-medium">
                              Account Name: {item.account_name}
                            </div>
                          ) : null}

                          {item.account_number ? (
                            <div className="text-description font-medium">
                              Account No: {item.account_number}
                            </div>
                          ) : null}

                          <div className="flex items-center justify-center  ">
                            {isQrOpen && item.qr_url ? (
                              <Image
                                src={item.qr_url}
                                alt="QR"
                                width={500}
                                height={500}
                                className="w-50 rounded-[15px] border mt-5"
                              />
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm opacity-60">
                    No payment methods available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
