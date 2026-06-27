import React, { useState } from "react";
import { breakdownTask } from "../../services/breakdownService";
import SpeakButton from "../voice/SpeakButton.jsx";

export default function TaskBreakdown({
  task,
  onSetSubtasks,
  onToggleSubtask,
}) {
  const [generating, setGenerating] = useState(false);
  if (!task) return null;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const subs = await breakdownTask(task);
      onSetSubtasks(
        task.id,
        subs.map((s, i) => ({
          id: `${task.id}-gen-${i}`,
          title: s.title,
          done: false,
          estimatedMinutes: s.estimatedMinutes,
        })),
      );
    } finally {
      setGenerating(false);
    }
  }

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
        <div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
            Top priority right now
          </div>
          <h4 style={{ fontSize: 15, marginTop: 2 }}>{task.title}</h4>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            background: "var(--focus-dim)",
            color: "var(--focus)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {generating
            ? "Breaking down…"
            : task.subtasks?.length
              ? "Regenerate steps"
              : "Break it down"}
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {(task.subtasks || []).map((s) => (
          <label
            key={s.id}
            style={{
              display: "flex",
              gap: 8,
              fontSize: 13,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={s.done}
              onChange={() => onToggleSubtask(task.id, s.id)}
            />
            <span
              style={{
                textDecoration: s.done ? "line-through" : "none",
                color: s.done ? "var(--text-dim)" : "var(--text)",
              }}
            >
              {s.title}
            </span>
            <span
              onClick={(e) => e.preventDefault()}
              style={{ marginLeft: "auto" }}
            >
              <SpeakButton text={s.title} size={22} />
            </span>
          </label>
        ))}
        {!(task.subtasks || []).length && (
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
            No steps generated yet for this task.
          </div>
        )}
      </div>
    </div>
  );
}
