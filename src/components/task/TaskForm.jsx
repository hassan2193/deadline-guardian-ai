// src/components/task/TaskForm.jsx
import React, { useState } from "react";
import { analyzeTaskText } from "../../services/taskAnalysisService";
import VoiceTaskInput from "../voice/VoiceTaskInput.jsx";

const inputStyle = {
  width: "100%",
  background: "var(--surface-raised)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text)",
  padding: "10px 12px",
  fontSize: 14,
};

export default function TaskForm({ onAdd }) {
  const [rawText, setRawText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!rawText.trim()) {
      setError("Please type or speak a task before analyzing.");
      return;
    }
    setError("");
    setAnalyzing(true);
    try {
      const result = await analyzeTaskText(rawText);
      setPreview(result);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleConfirm() {
    if (!preview) return;
    const hoursFromNow = preview.suggestedDeadlineHoursFromNow;
    const finalDeadline = deadline
      ? new Date(deadline).toISOString()
      : new Date(Date.now() + (hoursFromNow || 24) * 3600 * 1000).toISOString();

    onAdd({
      title: preview.title,
      description: preview.description,
      importance: preview.importance,
      effortHours: preview.effortHours,
      category: preview.category,
      deadline: finalDeadline,
    });

    setRawText("");
    setDeadline("");
    setPreview(null);
    setError("");
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 18,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ ...inputStyle, border: error ? "1px solid var(--urgent)" : inputStyle.border }}
          placeholder='Type a task, e.g. "Submit assignment by Friday 6pm"'
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
        />
        <VoiceTaskInput onResult={(text) => setRawText(text)} />
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          style={{
            background: "var(--urgent)",
            color: "#1a0d0a",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "0 16px",
            fontWeight: 600,
            fontSize: 13,
            whiteSpace: "nowrap",
          }}
        >
          {analyzing ? "Analyzing…" : "Analyze with AI"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: 12, color: "var(--urgent)", marginTop: 6 }}>{error}</div>
      )}

      {preview && (
        <div
          style={{
            marginTop: 14,
            background: "var(--surface-raised)",
            borderRadius: "var(--radius-sm)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            AI read this as:{" "}
            <strong style={{ color: "var(--text)" }}>{preview.title}</strong> · {preview.category} ·
            importance {preview.importance}/5 · ~{preview.effortHours}h effort
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "var(--text-dim)" }}>Deadline</label>
            <input
              type="datetime-local"
              style={{ ...inputStyle, width: 220 }}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button
              onClick={handleConfirm}
              style={{
                background: "var(--safe)",
                color: "#062b1c",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "8px 14px",
                fontWeight: 600,
                fontSize: 13,
                marginLeft: "auto",
              }}
            >
              Add task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
