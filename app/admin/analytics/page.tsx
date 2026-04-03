// app/admin/analytics/page.tsx
"use client";

import { useRouter } from "next/navigation";

const MOCK_STATS = [
  { icon: "🏠", count: "1234567", label: "Shelters" },
  { icon: "🤍", count: "1234567", label: "Users" },
  { icon: "🐾", count: "1234567", label: "Adoption Completed" },
];

const MOCK_VIDEOS = [
  { id: "1", title: "Video Title - Pet Name", date: "Date Posted", views: "12,345", likes: "12,345" },
  { id: "2", title: "Video Title - Pet Name", date: "Date Posted", views: "12,345", likes: "12,345" },
  { id: "3", title: "Video Title - Pet Name", date: "Date Posted", views: "12,345", likes: "12,345" },
  { id: "4", title: "Video Title - Pet Name", date: "Date Posted", views: "12,345", likes: "12,345" },
];

export default function AnalyticsDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-svh bg-background px-10 pt-10 pb-10">
      <div className="mx-auto max-w-4xl">
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-primary">

          {/* Yellow Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-primary">
            <h1 className="text-3xl font-black text-black">Dashboard</h1>
            <button
              onClick={() => router.back()}
              className="text-black text-2xl font-bold hover:opacity-70 transition-opacity"
            >
              ‹
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 bg-white">
            {MOCK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-primary rounded-2xl px-4 py-4 flex items-center gap-3"
              >
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-black font-black text-xl leading-none">{stat.count}</p>
                  <p className="text-black text-xs mt-1 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Videos Section */}
          <div className="px-6 py-5 bg-background">
            <h2 className="text-2xl font-black text-black mb-4">Videos</h2>

            <div className="border border-primary rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 border-b border-primary/30">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-black">All</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-black w-20 text-center">Views</span>
                <span className="font-semibold text-sm text-black w-20 text-center">Likes</span>
              </div>

              {/* Video Rows */}
              {MOCK_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 border-b border-primary/30 last:border-0 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-black">{video.title}</p>
                      <p className="text-xs text-gray-400">{video.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-black w-20 text-center">{video.views}</span>
                  <span className="text-sm font-medium text-black w-20 text-center">{video.likes}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}