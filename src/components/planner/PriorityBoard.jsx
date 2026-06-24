// src/components/planner/PriorityBoard.jsx
import React from "react";
import { quadrantFor, QUADRANT_META } from "../../utils/priorityUtils";
import { formatTimeRemaining } from "../../utils/deadlineUtils";

const ORDER = ["do-now", "schedule", "delegate-or-shrink", "later"];

export default function PriorityBoard({ tasks, onOpen }) {
  const groups = ORDER.map((key) => ({
    key,
    meta: QUADRANT_META[key],
    items: tasks.filter((t) => quadrantFor(t) === key),
  }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {groups.map((g) => (
        <div
          key={g.key}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: 14,
            minHeight: 140,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: g.meta.color }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{g.meta.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: "auto" }}>{g.items.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {g.items.length === 0 && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Nothing here.</div>}
            {g.items.map((t) => (
              <div
                key={t.id}
                onClick={() => onOpen && onOpen(t)}
                style={{
                  fontSize: 13,
                  padding: "8px 10px",
                  background: "var(--surface-raised)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span>{t.title}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {formatTimeRemaining(t.deadline)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
