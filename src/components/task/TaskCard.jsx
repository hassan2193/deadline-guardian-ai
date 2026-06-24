// src/components/task/TaskCard.jsx
import React from "react";
import RiskIndicator from "../planner/RiskIndicator.jsx";
import { formatTimeRemaining, riskLevel, RISK_COLORS } from "../../utils/deadlineUtils";
import { totalStepsProgress } from "../../utils/progressUtils";

export default function TaskCard({ task, onComplete, onOpen }) {
  const risk = riskLevel(task.deadline, task.effortHours);
  const color = RISK_COLORS[risk];
  const steps = totalStepsProgress(task);
  const isDone = task.status === "done";

  return (
    <div
      onClick={() => onOpen && onOpen(task)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
        display: "flex",
        gap: 14,
        cursor: onOpen ? "pointer" : "default",
        opacity: isDone ? 0.55 : 1,
        transition: "border-color 0.15s ease",
      }}
    >
      <RiskIndicator deadline={task.deadline} effortHours={task.effortHours} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, textDecoration: isDone ? "line-through" : "none" }}>
            {task.title}
          </h4>
          <span
            className="mono"
            style={{ fontSize: 11, color, whiteSpace: "nowrap", fontWeight: 600 }}
          >
            {isDone ? "Done" : formatTimeRemaining(task.deadline)}
          </span>
        </div>

        {task.description && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{task.description}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 999,
              background: "var(--surface-raised)",
              color: "var(--text-muted)",
            }}
          >
            {task.category}
          </span>

          {steps && (
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {steps.done}/{steps.total} steps
            </span>
          )}

          {!isDone && onComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                borderRadius: "var(--radius-sm)",
                padding: "4px 10px",
                fontSize: 12,
              }}
            >
              Mark done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
