import React, { useEffect } from "react";

export default function DailySchedule({ blocks, loading, error, onGenerate }) {
  useEffect(() => {
    onGenerate();
  }, []);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ fontSize: 15 }}>Today's AI schedule</h4>
        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            borderRadius: "var(--radius-sm)",
            padding: "5px 10px",
            fontSize: 12,
          }}
        >
          {loading ? "Building…" : "Regenerate"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: 12, color: "var(--urgent)", marginTop: 8 }}>
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {blocks.length === 0 && !loading && (
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
            Nothing scheduled — all clear or list is empty.
          </div>
        )}
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: "var(--radius-sm)",
              background:
                b.taskTitle === "Break"
                  ? "transparent"
                  : "var(--surface-raised)",
              opacity: b.taskTitle === "Break" ? 0.6 : 1,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 12, color: "var(--text-dim)", width: 90 }}
            >
              {b.start}–{b.end}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: b.taskTitle === "Break" ? 400 : 600,
              }}
            >
              {b.taskTitle}
            </span>
            {b.note && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-dim)",
                  marginLeft: "auto",
                }}
              >
                {b.note}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
