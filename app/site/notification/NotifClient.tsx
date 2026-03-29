"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import WebTemplate from "@/components/template/WebTemplate";
import NotifCard from "@/components/cards/NotifCard";
import StatusCard from "@/components/cards/StatusCard";
import StatusModal from "@/components/modal/StatusModal";
import BackButton from "@/components/ui/BackButton";
import { createClientSupabase } from "@/lib/supabase/client";

import type { NotificationItem } from "./page";

import Species from "@/public/icons/species(ver2).svg";
import Date from "@/public/icons/Date(ver2).svg";
import Home from "@/public/icons/Home(ver2).svg";

type Props = {
  notifications: NotificationItem[];
};

export default function NotifClient({ notifications }: Props) {
  const router = useRouter();
  const supabase = createClientSupabase();

  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [showStatusCard, setShowStatusCard] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const statusCardRef = useRef<HTMLDivElement | null>(null);

  const hasNotifications = notifications.length > 0;

  const sortedNotifications = useMemo(() => {
    return [...notifications];
  }, [notifications]);

  const headerStyle =
    "text-title font-semibold flex items-center rounded-[15px] pl-7 border bg-white px-2 ml-6 border-l-0";

  function handleNotifClick(item: NotificationItem) {
    if (selected?.id === item.id && showStatusCard) {
      setOpenModal(true);
      return;
    }

    setSelected(item);
    setOpenModal(false);
    setShowStatusCard(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleCloseStatusCard() {
    setShowStatusCard(false);
    setOpenModal(false);
  }

  useEffect(() => {
    if (
      !showStatusCard ||
      !statusCardRef.current ||
      !scrollContainerRef.current
    ) {
      return;
    }

    const container = scrollContainerRef.current;
    const card = statusCardRef.current;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const currentScrollTop = container.scrollTop;
    const offset = 20;

    const targetScrollTop =
      currentScrollTop + (cardRect.top - containerRect.top) - offset;

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

    container.scrollTo({
      top: finalScrollTop,
      behavior: "smooth",
    });
  }, [selected, showStatusCard]);

  // keep selected card in sync after refresh
  useEffect(() => {
    if (!selected) return;

    const updatedSelected = notifications.find(
      (item) => item.id === selected.id,
    );

    if (!updatedSelected) {
      setSelected(null);
      setShowStatusCard(false);
      setOpenModal(false);
      return;
    }

    setSelected(updatedSelected);
  }, [notifications, selected]);

  // realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("adoption-requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "adoption_requests",
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return (
    <WebTemplate
      header={
        <div className="flex items-center px-5">
          <h1 className="text-header font-bold text-black">Notifications</h1>
          <BackButton />
        </div>
      }
      main={
        <>
          <div
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto scroll-stable py-5 "
          >
            <div className="grid grid-cols-3 place-items-center gap-15 mb-5">
              <div className="relative flex items-center">
                <span className="absolute">
                  <Image src={Home} alt="home-icon" width={50} height={50} />
                </span>
                <span className={headerStyle}>Shelter</span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute">
                  <Image
                    src={Species}
                    alt="species-icon"
                    width={50}
                    height={50}
                  />
                </span>
                <span className={headerStyle}>Applications</span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute rounded-full bg-primary">
                  <Image src={Date} alt="date-icon" width={50} height={50} />
                </span>
                <span className={headerStyle}>Date</span>
              </div>
            </div>

            {!hasNotifications ? (
              <div className="rounded-[15px] border border-dashed bg-white p-10 text-center">
                No notifications yet.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotifications.map((item) => (
                  <NotifCard
                    key={item.id}
                    item={item}
                    isActive={selected?.id === item.id && showStatusCard}
                    onSelect={() => handleNotifClick(item)}
                    onOpenDetails={() => handleNotifClick(item)}
                  />
                ))}

                {selected && (
                  <div
                    ref={statusCardRef}
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      showStatusCard
                        ? "translate-y-0 opacity-100 max-h-250 pt-5"
                        : "pointer-events-none translate-y-10 opacity-0 max-h-0"
                    }`}
                  >
                    <StatusCard
                      item={selected}
                      onClose={handleCloseStatusCard}
                      onOpenDetails={() => setOpenModal(true)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <StatusModal
            open={openModal}
            item={selected}
            onClose={handleCloseModal}
          />
        </>
      }
    />
  );
}
