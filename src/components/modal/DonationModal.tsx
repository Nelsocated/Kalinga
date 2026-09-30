"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { HandCoins, QrCode } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { fetchJson } from "@/src/lib/fetchJson";

type Donation = {
  id: string;
  type: "goods" | "monetary";
  item_name?: string[] | null;
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

/** How to donate goods or money to a shelter. */
export default function DonationModal({ shelterId, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Donation[] | null>(null);
  const [openQrId, setOpenQrId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function open() {
    setIsOpen(true);
    setOpenQrId(null);
    setErrorMsg(null);
    setData(null);
    try {
      const json = await fetchJson<{ data: Donation[] }>(`/api/shelters/${shelterId}/donation`, { cache: "no-store" });
      setData(json.data ?? []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Couldn't load donation details.");
      setData([]);
    }
  }

  const goods = useMemo(
    () => (data ?? []).filter((d) => d.type === "goods").flatMap((d) => d.item_name ?? []),
    [data],
  );
  const monetary = useMemo(() => (data ?? []).filter((d) => d.type === "monetary"), [data]);
  const goodsInstruction =
    (data ?? []).find((d) => d.type === "goods" && d.instruction_note?.trim())?.instruction_note ?? null;

  return (
    <>
      <Button
        variant="secondary"
        onClick={open}
        icon={<HandCoins aria-hidden="true" />}
        className={buttonClassName}
      >
        Donate
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Donate">
        {data === null ? (
          <p role="status" className="text-sm text-muted">
            Loading donation details…
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {errorMsg ? (
              <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                {errorMsg}
              </p>
            ) : null}

            <section className="flex flex-col gap-2">
              <h3 className="font-semibold text-ink">Goods</h3>
              <p className="text-sm text-ink-soft">
                {goodsInstruction ?? "This shelter hasn't added drop-off instructions yet."}
              </p>
              {goods.length ? (
                <ul className="flex flex-wrap gap-2">
                  {goods.map((item, i) => (
                    <li key={i} className="rounded-full bg-sunshine-soft px-3 py-1 text-xs font-medium text-ink">
                      {item || "Unnamed item"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="flex flex-col gap-3 border-t border-line pt-5">
              <h3 className="font-semibold text-ink">Money</h3>
              {monetary.length ? (
                monetary.map((item) => {
                  const qrOpen = openQrId === item.id;
                  return (
                    <div key={item.id} className="flex flex-col gap-2 rounded-md border border-line bg-ground p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-ink">{item.method || "Payment method"}</p>
                        {item.qr_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenQrId(qrOpen ? null : item.id)}
                            aria-expanded={qrOpen}
                            icon={<QrCode aria-hidden="true" />}
                          >
                            {qrOpen ? "Hide QR" : "Show QR"}
                          </Button>
                        ) : null}
                      </div>
                      {item.account_name ? (
                        <p className="text-sm text-ink-soft">
                          Account name <span className="font-medium text-ink">{item.account_name}</span>
                        </p>
                      ) : null}
                      {item.account_number ? (
                        <p className="text-sm text-ink-soft">
                          Account number <span className="font-medium tabular-nums text-ink">{item.account_number}</span>
                        </p>
                      ) : null}
                      {qrOpen && item.qr_url ? (
                        <Image
                          src={item.qr_url}
                          alt={`QR code for ${item.method || "this payment method"}`}
                          width={240}
                          height={240}
                          className="mx-auto mt-2 rounded-md border border-line"
                        />
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted">No payment methods listed yet.</p>
              )}
            </section>
          </div>
        )}
      </Modal>
    </>
  );
}
