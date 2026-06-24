// src/components/planner/RiskIndicator.jsx
// Signature element: a small countdown ring whose arc and color encode risk,
// not just a colored dot. Reused across cards, planner, and coach.
import React from "react";
import { riskLevel, RISK_COLORS, RISK_LABELS, hoursUntil } from "../../utils/deadlineUtils";

export default function RiskIndicator({ deadline, effortHours = 1, size = 40, showLabel = false }) {
  const risk = riskLevel(deadline, effortHours);
  const color = RISK_COLORS[risk];
  const hrs = hoursUntil(deadline);

  // Map remaining buffer to an arc fraction (purely visual, clamps 0..1).
  const buffer = Math.max(hrs, 0) / Math.max(effortHours, 0.5);
  const fraction = Math.min(buffer / 8, 1);

  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const dash = c * fraction;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth="3" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{RISK_LABELS[risk]}</span>
      )}
    </div>
  );
}
