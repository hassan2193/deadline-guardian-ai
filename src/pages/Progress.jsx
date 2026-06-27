import React from "react";
import { useTaskContext } from "../context/TaskContext";
import { useProgress } from "../hooks/useProgress";
import CompletionStats from "../components/progress/CompletionStats.jsx";
import StreakCard from "../components/progress/StreakCard.jsx";
import ProgressTracker from "../components/progress/ProgressTracker.jsx";

export default function Progress() {
  const { tasks } = useTaskContext();
  const stats = useProgress();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-dim)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Progress
        </div>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>
          How you're actually doing
        </h1>
      </div>

      <CompletionStats stats={stats} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <StreakCard streak={stats.streak} />
        <ProgressTracker tasks={tasks} />
      </div>
    </div>
  );
}
