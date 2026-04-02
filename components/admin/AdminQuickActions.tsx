// components/admin/AdminQuickActions.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AdminQuickActions() {
  const router = useRouter();

  return (
    <div className="fixed top-8 right-8 flex flex-col gap-3 z-50">

      {/* Chart / Analytics button */}
      <button
        onClick={() => router.push("/admin/analytics")}
        title="Analytics"
        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </button>

      {/* Document / Reports button */}
      <button
        onClick={() => router.push("/admin/reports")}
        title="Reports"
        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/80 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </button>

    </div>
  );
}