"use client";
import React from "react";
import Navbar from "../layout/NavBar";

export default function ProfileShell({
    main,
    side,
}: {
    main: React.ReactNode;
    side?: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f6f3ee] flex">
            <div className="pl-10">
                <Navbar />
            </div>

            <div className="flex-1 flex justify-end">
                <div className="max-w-5xl rounded-xl bg-[#f3be0f]">
                    <main className="p-10">
                        <div className="h-[88svh] w-full rounded-2xl bg-[#f6f3ee] overflow-hidden">
                            <div className="grid h-full gap-3 lg:grid-cols-[60svh_1fr]">
                                <div>{side}</div>
                                <div>{main}</div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}