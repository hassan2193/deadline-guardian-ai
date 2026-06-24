// src/components/coach/AICoachCard.jsx
import React from "react";
import { RISK_COLORS, RISK_LABELS } from "../../utils/deadlineUtils";

export default function AICoachCard({ task, nudge, risk }) {
  const color = RISK_COLORS[risk];
  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}33`,
        borderRadius: "var(--radius-md)",
        padding: 16,
        display: "flex",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 4,
          borderRadius: 4,
          background: color,
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>{RISK_LABELS[risk]}</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{task.title}</span>
        </div>
        <p style={{ fontSize: 14, marginTop: 6 }}>{nudge}</p>
      </div>
    </div>
  );
}
