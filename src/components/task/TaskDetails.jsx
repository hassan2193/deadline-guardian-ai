// src/components/task/TaskDetails.jsx
import React, { useState } from "react";
import { breakdownTask } from "../../services/breakdownService";
import { formatDeadlineDate, formatTimeRemaining, riskLevel, RISK_COLORS } from "../../utils/deadlineUtils";
import { useVoiceContext } from "../../context/VoiceContext";
import SpeakButton from "../voice/SpeakButton.jsx";

export default function TaskDetails({ task, onClose, onToggleSubtask, onSetSubtasks, onComplete }) {
  const [generating, setGenerating] = useState(false);
  const { speak, settings } = useVoiceContext();
  if (!task) return null;

  const risk = riskLevel(task.deadline, task.effortHours);
  const color = RISK_COLORS[risk];

  async function handleBreakdown() {
    setGenerating(true);
    try {
      const subs = await breakdownTask(task);
      onSetSubtasks(
        task.id,
        subs.map((s, i) => ({ id: `${task.id}-gen-${i}`, title: s.title, done: false, estimatedMinutes: s.estimatedMinutes }))
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,9,12,0.6)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          padding: 24,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: 18 }}>{task.title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 18 }}>
            ✕
          </button>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>{task.description}</p>

        <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12 }}>
          <div>
            <div style={{ color: "var(--text-dim)" }}>Deadline</div>
            <div style={{ marginTop: 2 }}>{formatDeadlineDate(task.deadline)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-dim)" }}>Status</div>
            <div style={{ marginTop: 2, color }}>{formatTimeRemaining(task.deadline)}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-dim)" }}>Effort</div>
            <div style={{ marginTop: 2 }}>{task.effortHours}h</div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ fontSize: 13, color: "var(--text-muted)" }}>Sub-steps</h4>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {(task.subtasks || []).length > 0 && (
              <SpeakButton
                text={
                  settings.language === "hi"
                    ? `${task.title} ke liye steps: ` +
                      task.subtasks.map((s, i) => `${i + 1}. ${s.title}`).join(". ")
                    : `Steps for ${task.title}: ` +
                      task.subtasks.map((s, i) => `Step ${i + 1}: ${s.title}`).join(". ")
                }
                size={26}
              />
            )}
            <button
              onClick={handleBreakdown}
              disabled={generating}
              style={{
                background: "var(--focus-dim)",
                color: "var(--focus)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "5px 10px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {generating ? "Breaking down…" : "AI breakdown"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {(task.subtasks || []).length === 0 && (
            <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
              No steps yet — use "AI breakdown" to split this into actionable pieces.
            </div>
          )}
          {(task.subtasks || []).map((s) => (
            <label
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                padding: "8px 10px",
                background: "var(--surface-raised)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" checked={s.done} onChange={() => onToggleSubtask(task.id, s.id)} />
              <span style={{ textDecoration: s.done ? "line-through" : "none", color: s.done ? "var(--text-dim)" : "var(--text)" }}>
                {s.title}
              </span>
              {s.estimatedMinutes && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-dim)" }}>{s.estimatedMinutes}m</span>
              )}
              <span onClick={(e) => e.preventDefault()}>
                <SpeakButton text={s.title} size={22} />
              </span>
            </label>
          ))}
        </div>

        {task.status !== "done" && (
          <button
            onClick={() => {
              onComplete(task.id);
              onClose();
            }}
            style={{
              marginTop: 22,
              width: "100%",
              background: "var(--safe)",
              color: "#062b1c",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 0",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Mark task complete
          </button>
        )}
      </div>
    </div>
  );
}
