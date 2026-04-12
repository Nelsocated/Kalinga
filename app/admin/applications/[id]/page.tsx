// app/admin/applications/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";

const MOCK_APPLICATION = {
  id: "1",
  shelterName: "Shelter Name",
  submittedAt: "4 hrs ago",
  email: "shelter@email.com",
  username: "shelteruser",
  location: "Iloilo City",
};

export default function ReviewApplicationPage() {
  const router = useRouter();

  const handleApprove = () => {
    console.log("Approved:", MOCK_APPLICATION.id);
    router.back();
  };

  const handleReject = () => {
    console.log("Rejected:", MOCK_APPLICATION.id);
    router.back();
  };

  return (
    <div className="min-h-svh bg-background px-10 pt-10 pb-10">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-primary">

          {/* Header */}
          <div className="bg-primary px-6 py-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Shelter Verification</h2>
            <button
              onClick={() => router.back()}
              className="text-black text-2xl leading-none font-medium hover:opacity-70 transition-opacity"
            >
              ‹
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 bg-background">
            <p className="font-semibold text-sm mb-4">Account Details</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="text" readOnly value={MOCK_APPLICATION.email}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" readOnly value="••••••••"
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shelter Name</label>
                <input type="text" readOnly value={MOCK_APPLICATION.shelterName}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" readOnly value={MOCK_APPLICATION.username}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" readOnly value={MOCK_APPLICATION.location}
                  className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white focus:outline-none" />
              </div>
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <p className="font-semibold text-sm mb-4">Documents</p>
              <div className="space-y-3">
                {[
                  "Registration Certificate",
                  "Barangay Clearance",
                  "Business Permit",
                  "Valid ID of the Owner",
                  "Photos of the Shelter",
                ].map((doc) => (
                  <div key={doc}>
                    <label className="block text-sm font-medium mb-1">{doc}</label>
                    <button className="w-full border border-primary rounded-lg px-3 py-2 text-sm text-gray-400 bg-white hover:bg-primary/10 transition-colors">
                      View Documents
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex flex-col gap-3 bg-background">
            <button onClick={handleApprove}
              className="w-full bg-green-500 text-white font-bold rounded-full py-3 hover:bg-green-600 transition-colors">
              Approve Application
            </button>
            <button onClick={handleReject}
              className="w-full bg-red-500 text-white font-bold rounded-full py-3 hover:bg-red-600 transition-colors">
              Reject Application
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}