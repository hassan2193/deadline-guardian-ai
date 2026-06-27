import React from "react";
import TaskCard from "./TaskCard.jsx";

export default function TaskList({
  tasks,
  onComplete,
  onOpen,
  emptyLabel = "No tasks here.",
}) {
  if (!tasks.length) {
    return (
      <div
        style={{ color: "var(--text-dim)", fontSize: 13, padding: "20px 0" }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
