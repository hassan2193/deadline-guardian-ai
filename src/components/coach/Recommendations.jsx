// src/components/coach/Recommendations.jsx
import React, { useEffect, useState } from "react";
import { scanForRisks } from "../../services/riskService";

export default function Recommendations({ tasks }) {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    scanForRisks(tasks).then((result) => {
      if (active) {
        setWarnings(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
      }}
    >
      <h4 style={{ fontSize: 14, color: "var(--text-muted)" }}>Schedule conflict scan</h4>
      {loading && <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>Scanning…</div>}
      {!loading && warnings.length === 0 && (
        <div style={{ fontSize: 13, color: "var(--safe)", marginTop: 8 }}>No conflicts detected.</div>
      )}
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
        {warnings.map((w, i) => (
          <div
            key={i}
            style={{
              fontSize: 13,
              padding: "8px 10px",
              background: "var(--warn-dim)",
              color: "var(--warn)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {w.message}
          </div>
        ))}
      </div>
    </div>
  );
}
