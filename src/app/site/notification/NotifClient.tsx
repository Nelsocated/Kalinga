"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "@phosphor-icons/react";

import WebTemplate from "@/src/components/template/WebTemplate";
import NotifCard from "@/src/components/cards/NotifCard";
import StatusModal from "@/src/components/modal/StatusModal";
import EmptyState from "@/src/components/ui/EmptyState";
import { LinkButton } from "@/src/components/ui/Button";
import { createClientSupabase } from "@/src/lib/supabase/client";

import type { NotificationItem } from "./page";

type Props = {
  notifications: NotificationItem[];
};

export default function NotifClient({ notifications }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClientSupabase(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = notifications.find((item) => item.id === selectedId) ?? null;

  // Refresh when a shelter updates an application
  useEffect(() => {
    const channel = supabase
      .channel("adoption-requests-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "adoption_requests" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return (
    <WebTemplate
      header="Notifications"
      main={
        notifications.length === 0 ? (
          <EmptyState
            icon={<Bell aria-hidden="true" />}
            title="No updates yet"
            description="Apply to adopt a pet to see updates here."
            action={
              <LinkButton href="/site/explore" variant="primary">
                Find a pet
              </LinkButton>
            }
          />
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {notifications.map((item) => (
                <li key={item.id}>
                  <NotifCard item={item} onSelect={() => setSelectedId(item.id)} />
                </li>
              ))}
            </ul>
            <StatusModal open={!!selected} item={selected} onClose={() => setSelectedId(null)} />
          </>
        )
      }
    />
  );
}
