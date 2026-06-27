import React from "react";

export default function ProgressTracker({ tasks }) {
  const byCategory = {};
  tasks.forEach((t) => {
    byCategory[t.category] = byCategory[t.category] || { total: 0, done: 0 };
    byCategory[t.category].total += 1;
    if (t.status === "done") byCategory[t.category].done += 1;
  });

  const entries = Object.entries(byCategory);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 18,
      }}
    >
      <h4
        style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 14 }}
      >
        Progress by category
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map(([cat, v]) => {
          const pct = v.total ? Math.round((v.done / v.total) * 100) : 0;
          return (
            <div key={cat}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>{cat}</span>
                <span className="mono" style={{ color: "var(--text-dim)" }}>
                  {v.done}/{v.total}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--surface-raised)",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "var(--safe)",
                    borderRadius: 999,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
            No tasks yet.
          </div>
        )}
      </div>
    </div>
  );
}
