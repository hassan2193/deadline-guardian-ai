import React from "react";

function StatBlock({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          color: color || "var(--text)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

export default function CompletionStats({ stats }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <StatBlock
        label="Completion rate"
        value={`${stats.rate}%`}
        color="var(--safe)"
      />
      <StatBlock label="Tasks done" value={`${stats.done}/${stats.total}`} />
      <StatBlock
        label="Due today"
        value={stats.dueToday.length}
        color="var(--focus)"
      />
      <StatBlock
        label="Missed"
        value={stats.missed.length}
        color={stats.missed.length ? "var(--urgent)" : "var(--text)"}
      />
    </div>
  );
}
