"use client";

import Image from "next/image";
import user_icon from "@/public/icons/user.svg";
import more_icon from "@/public/icons/More.svg";

import { useState } from "react";

export default function SettingsPage() {
  const [active, setActive] = useState<"account" | "deletion">("account");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <main className="flex-1 flex justify-center items-start py-12">
      <div className="w-225 bg-white rounded-[15px] border-4 border-primary mt-4 shadow-lg">
        <div className="bg-primary rounded-t-[15px] px-10 py-6 flex items-center gap-2 border-b-2 border-primary">
          <h1 className="text-5xl font-extrabold text-black mr-2">Settings</h1>
          <span className="text-3xl font-bold">&lt;</span>
        </div>
        <div className="flex justify-center gap-8 px-10 py-6 border-b border-primary bg-white">
          <button
            className={`flex items-center gap-4 px-8 py-3 rounded-full border-2 border-primary bg-white transition-all focus:outline-none text-lg
                ${active === "account" ? "font-bold" : "font-normal"}`}
            onClick={() => setActive("account")}
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
              <Image
                src={user_icon}
                alt="Account Settings"
                width={28}
                height={28}
              />
            </span>
            <span className="text-black">Account Settings</span>
          </button>
          <button
            className={`flex items-center gap-4 px-8 py-3 rounded-full border-2 border-primary bg-white transition-all focus:outline-none text-lg
                ${active === "deletion" ? "font-bold" : "font-normal"}`}
            onClick={() => setActive("deletion")}
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
              <Image
                src={more_icon}
                alt="Account Deletion"
                width={28}
                height={28}
              />
            </span>
            <span className="text-black">Account Deletion</span>
          </button>
        </div>
        <div className="p-10 min-h-100">
          {active === "account" && !showChangePassword && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col gap-4 w-full max-w-md">
                <label className="flex flex-col text-xl font-bold text-black">
                  <span>Email:</span>
                  <input
                    type="email"
                    className="mt-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="Enter your email"
                  />
                </label>
                <label className="flex flex-col text-xl font-bold text-black">
                  <span>Phone No.:</span>
                  <input
                    type="tel"
                    className="mt-1 px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="Enter your phone number"
                  />
                </label>
              </div>
              <button
                className="mt-2 px-8 py-2 rounded-full border-2 border-primary bg-white text-black font-semibold text-lg hover:bg-primary hover:text-white transition-all"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
              <button className="mt-4 px-12 py-3 rounded-full border-2 border-primary bg-white text-black font-bold text-2xl hover:bg-primary hover:text-white transition-all">
                Log Out
              </button>
            </div>
          )}
          {active === "account" && showChangePassword && (
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex items-center gap-2 w-full justify-center">
                <h2 className="text-4xl font-extrabold text-black text-center">
                  Change Password
                </h2>
                <button
                  className="ml-2 text-3xl font-bold text-black hover:text-primary focus:outline-none"
                  onClick={() => setShowChangePassword(false)}
                  aria-label="Back"
                >
                  &lt;
                </button>
              </div>
              <form
                className="flex flex-col gap-6 w-full max-w-2xl items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowChangePassword(false);
                  setShowPasswordChanged(true);
                  setTimeout(() => setShowPasswordChanged(false), 2000);
                }}
              >
                <div className="flex flex-row items-center gap-4 w-full justify-center">
                  <label className="text-xl font-bold text-black w-60 text-right">
                    Current Password:
                  </label>
                  <input
                    type="password"
                    className="px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white w-96"
                    placeholder="Enter Current Password"
                  />
                </div>
                <div className="flex flex-row items-center gap-4 w-full justify-center">
                  <label className="text-xl font-bold text-black w-60 text-right">
                    New Password:
                  </label>
                  <input
                    type="password"
                    className="px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white w-96"
                    placeholder="Enter New Password"
                  />
                </div>
                <div className="flex flex-row items-center gap-4 w-full justify-center">
                  <label className="text-xl font-bold text-black w-60 text-right">
                    Confirm New Password:
                  </label>
                  <input
                    type="password"
                    className="px-4 py-2 rounded-lg border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-white w-96"
                    placeholder="Confirm New Password"
                  />
                </div>
                <div className="flex flex-row gap-6 mt-4">
                  <button
                    type="button"
                    className="px-8 py-2 rounded-full border-2 border-red-400 bg-white text-black font-semibold text-lg hover:bg-red-400 hover:text-white transition-all"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 rounded-full border-2 border-primary bg-white text-black font-semibold text-lg hover:bg-primary hover:text-white transition-all"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          {active === "deletion" && (
            <div className="relative flex flex-col items-center justify-center min-h-100 w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-6">
                Deleting your account will:
              </h2>
              <ul className="text-xl text-black font-medium mb-6 list-disc list-inside text-center">
                <li>Remove your profile and personal information</li>
                <li>Delete all saved data and history</li>
                <li>Prevent you from accessing the account again</li>
              </ul>
              <div className="text-xl font-bold text-center mb-8">
                This action is permanent.
              </div>
              <button
                className="px-10 py-3 rounded-full border-2 border-red-500 text-black font-semibold text-xl bg-white hover:bg-red-500 hover:text-white transition-all"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
              {showDeleteConfirm && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-88">
                  <div className="rounded-t-[15px] rounded-b-[15px] bg-white border-2 border-primary shadow-lg">
                    <div className="bg-primary rounded-t-[15px] px-6 py-3">
                      <h3 className="text-xl font-extrabold text-center text-[#b91c1c]">
                        Account Deletion Notice
                      </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center px-6 py-6">
                      <div className="text-xl font-bold text-center text-black mb-2">
                        Are you sure you want to delete your account?
                      </div>
                      <div className="text-lg font-bold text-center text-red-600 mb-6">
                        This action can’t be undone!
                      </div>
                      <div className="flex gap-6 justify-center">
                        <button
                          className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-red-500 bg-white text-black font-semibold text-lg hover:bg-red-500 hover:text-white transition-all"
                          onClick={() => {
                            /* handle actual delete here */
                          }}
                        >
                          <span className="w-7 h-7 flex items-center justify-center">
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="14" cy="14" r="14" fill="#FACC15" />
                              <path
                                d="M9.5 19C10.5 17.5 17.5 17.5 18.5 19"
                                stroke="#B91C1C"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <circle cx="10" cy="12" r="1.5" fill="#B91C1C" />
                              <circle cx="18" cy="12" r="1.5" fill="#B91C1C" />
                            </svg>
                          </span>
                          Yes
                        </button>
                        <button
                          className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-green-500 bg-white text-black font-semibold text-lg hover:bg-green-500 hover:text-white transition-all"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          <span className="w-7 h-7 flex items-center justify-center">
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="14" cy="14" r="14" fill="#22C55E" />
                              <path
                                d="M9.5 19C10.5 20.5 17.5 20.5 18.5 19"
                                stroke="#166534"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <circle cx="10" cy="12" r="1.5" fill="#166534" />
                              <circle cx="18" cy="12" r="1.5" fill="#166534" />
                            </svg>
                          </span>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {showPasswordChanged && (
          <div className="fixed left-1/2 top-1/4 transform -translate-x-1/2 z-50">
            <div className="rounded-t-[15px] rounded-b-[15px] bg-white border-2 border-primary shadow-lg w-[320px]">
              <div className="bg-primary rounded-t-[15px] px-6 py-3">
                <h3 className="text-xl font-extrabold text-center text-black">
                  Password Status
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-6">
                <span className="text-base font-semibold text-black text-center">
                  Your password has
                  <br />
                  been changed!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
