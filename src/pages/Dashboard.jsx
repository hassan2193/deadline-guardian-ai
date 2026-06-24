import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskForm from "../components/task/TaskForm.jsx";
import TaskList from "../components/task/TaskList.jsx";
import TaskDetails from "../components/task/TaskDetails.jsx";
import CompletionStats from "../components/progress/CompletionStats.jsx";
import { useProgress } from "../hooks/useProgress";

export default function Dashboard() {
  const {
    tasks,
    prioritized,
    overdueTasks,
    addTask,
    completeTask,
    toggleSubtask,
    setSubtasks,
  } = useTasks();
  const stats = useProgress();
  const [openTaskId, setOpenTaskId] = useState(null);
  // Always look up the live task by id so updates (like AI breakdown results)
  // show up immediately instead of only after the panel is closed/reopened.
  const openTask = openTaskId ? tasks.find((t) => t.id === openTaskId) || null : null;

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
          Dashboard
        </div>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>What needs you today</h1>
      </div>

      <CompletionStats stats={stats} />

      <TaskForm onAdd={addTask} />

      {overdueTasks.length > 0 && (
        <div
          style={{
            background: "var(--urgent-dim)",
            border: "1px solid rgba(255,93,74,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            fontSize: 13,
            color: "var(--urgent)",
          }}
        >
          {overdueTasks.length} task{overdueTasks.length > 1 ? "s are" : " is"}{" "}
          already overdue. Open the Coach tab for what to do next.
        </div>
      )}

      <div>
        <h3
          style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 12 }}
        >
          Priority order — handled by the AI ranker
        </h3>
        <TaskList
          tasks={prioritized}
          onComplete={completeTask}
          onOpen={(t) => setOpenTaskId(t.id)}
        />
      </div>

      {openTask && (
        <TaskDetails
          task={openTask}
          onClose={() => setOpenTaskId(null)}
          onToggleSubtask={toggleSubtask}
          onSetSubtasks={setSubtasks}
          onComplete={completeTask}
        />
      )}
    </div>
  );
}
