// src/components/progress/StreakCard.jsx
import React from "react";

export default function StreakCard({ streak }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 18,
        display: "flex",
        gap: 24,
      }}
    >
      <div>
        <div style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--urgent)" }}>
          {streak.current}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Day streak</div>
      </div>
      <div>
        <div style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 700 }}>{streak.longest}</div>
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Longest streak</div>
      </div>
    </div>
  );
}
