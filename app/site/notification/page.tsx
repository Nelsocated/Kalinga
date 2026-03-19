"use client";

import React, { useState } from "react";
import { FaHome, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
const NavBar = dynamic(() => import("@/components/layout/NavBar"), { ssr: false });
import StepCircle from "./StepCircle";
import StepLine from "./StepLine";

const mockNotifications = [
  {
    sender: "Ilonggo Aspins",
    message: "Adoption status for Nelson has been updated. ",
    link: "#",
    date: "March 1, 2026",
  },
  {
    sender: "Ilonggo Aspins",
    message: "Adoption status for Nelson has been updated. ",
    link: "#",
    date: "March 1, 2026",
  },
  {
    sender: "Ilonggo Aspins",
    message: "Adoption status for Nelson has been updated. ",
    link: "#",
    date: "March 1, 2026",
  },
  {
    sender: "Ilonggo Aspins",
    message: "Adoption status for Nelson has been updated. ",
    link: "#",
    date: "March 1, 2026",
  },
  {
    sender: "Ilonggo Aspins",
    message: "Adoption status for Nelson has been updated. ",
    link: "#",
    date: "March 1, 2026",
  },
];

const tabs = [
  { label: "Shelter", icon: <FaHome /> },
  { label: "Applications", icon: <FaClipboardList /> },
  { label: "Date", icon: <FaCalendarAlt /> },
];


export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showStatusIdx, setShowStatusIdx] = useState<number|null>(null);

  return (
    <div style={{ background: "#FFF8E1", minHeight: "100vh", padding: 0, display: "flex" }}>
      {/* Sidebar NavBar */}
      <div style={{ minWidth: 320, background: "#FFF8E1", height: "100vh" }}>
        <NavBar />
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 0" }}>
        <div style={{ width: 900, background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px #0001", minHeight: 600, display: "flex", flexDirection: "column", border: "2px solid #FFD600" }}>
          <div style={{ background: "#FFD600", borderRadius: "16px 16px 0 0", padding: "32px 40px 16px 40px", borderBottom: "2px solid #FFD600" }}>
            <h1 style={{ fontWeight: 700, fontSize: 48, margin: 0, color: "#222", letterSpacing: -1 }}>Notifications <span style={{ fontSize: 28, cursor: "pointer", marginLeft: 16, verticalAlign: "middle" }}>&#x2039;</span></h1>
          </div>
          <div style={{ display: "flex", gap: 24, padding: "16px 40px 0 40px", borderBottom: "2px solid #FFD600", alignItems: "center", minHeight: 64, justifyContent: "center" }}>
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: activeTab === idx ? "#FFD600" : "#fff",
                  border: "2px solid #FFD600",
                  borderRadius: 24,
                  padding: "10px 36px",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#222",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                  boxShadow: activeTab === idx ? "0 2px 8px #FFD60033" : "none",
                  transition: "all 0.2s",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: 28 }}>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
          {/* Scrollable notifications list */}
          <div style={{ padding: "0 40px", overflowY: "auto", flex: 1, maxHeight: 520 }}>
            {mockNotifications.map((notif, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #FFD600", padding: "32px 0" }}>
                  <div style={{ flex: 2, fontWeight: 600, fontSize: 20, color: "#222" }}>{notif.sender}</div>
                  <div style={{ flex: 5, fontSize: 18, color: "#222" }}>
                    {notif.message}
                    <button
                      style={{ color: "#FFD600", fontWeight: 500, textDecoration: "underline", marginLeft: 2, background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0 }}
                      onClick={() => setShowStatusIdx(idx === showStatusIdx ? null : idx)}
                    >
                      Click here
                    </button>
                  </div>
                  <div style={{ flex: 2, textAlign: "right", color: "#888", fontSize: 18 }}>{notif.date}</div>
                </div>
                {showStatusIdx === idx && (
                  <div style={{ background: "#FFD600", borderRadius: 16, margin: "32px 0 0 0", padding: 0, border: "2px solid #FFD600", boxShadow: "0 2px 8px #FFD60022" }}>
                    <div style={{ background: "#FFD600", borderRadius: "16px 16px 0 0", padding: "24px 0 16px 0", textAlign: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 36, color: "#222" }}>Adoption Status</span>
                    </div>
                    <div style={{ background: "#fff", borderRadius: "0 0 16px 16px", padding: 32, border: "2px solid #FFD600", borderTop: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {/* Progress tracker */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, width: "100%", maxWidth: 600, margin: "0 auto" }}>
                        {/* Steps: 0=Submitted, 1=Under Review, 2=Contacting, 3=Approved/Not Approved, 4=Adopted/Withdrawn */}
                        <StepCircle active color="#222" label="Submitted" />
                        <StepLine />
                        <StepCircle active color="#2046A6" label="Under Review" />
                        <StepLine />
                        <StepCircle color="#BDBDBD" label="Contacting Applicant" />
                        <StepLine />
                        <StepCircle color="#43A047" label="Approved\nNot Approved" />
                        <StepLine />
                        <StepCircle color="#D32F2F" label="Adopted\nWithdrawn" />
                      </div>
                      {/* Step labels */}
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 600, margin: "16px auto 0 auto", fontWeight: 500, fontSize: 16 }}>
                        <span style={{ width: 80, textAlign: "center" }}>Submitted</span>
                        <span style={{ width: 100, textAlign: "center", color: "#2046A6" }}>Under Review</span>
                        <span style={{ width: 120, textAlign: "center" }}>Contacting Applicant</span>
                        <span style={{ width: 120, textAlign: "center", color: "#43A047" }}>Approved<br/>Not Approved</span>
                        <span style={{ width: 120, textAlign: "center", color: "#D32F2F" }}>Adopted<br/>Withdrawn</span>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
