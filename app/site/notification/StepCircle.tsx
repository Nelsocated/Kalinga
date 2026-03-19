import React from "react";

export default function StepCircle({ active, color, label }: { active?: boolean; color: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 40 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: color,
          border: active ? "4px solid #FFD600" : "2px solid #FFD600",
          boxShadow: active ? "0 0 0 4px #FFD60055" : undefined,
        }}
      />
    </div>
  );
}
