// src/pages/Planner.jsx
import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useSchedule } from "../hooks/useSchedule";
import PriorityBoard from "../components/planner/PriorityBoard.jsx";
import TaskBreakdown from "../components/planner/TaskBreakdown.jsx";
import DailySchedule from "../components/planner/DailySchedule.jsx";
import TaskDetails from "../components/task/TaskDetails.jsx";

export default function Planner() {
  const { tasks, prioritized, pendingTasks, toggleSubtask, setSubtasks, completeTask } = useTasks();
  const { blocks, loading, error, generate } = useSchedule(pendingTasks);
  const [openTaskId, setOpenTaskId] = useState(null);

  const topTask = prioritized[0];
  // Always look up the live task by id so updates (like AI breakdown results)
  // show up immediately instead of only after the panel is closed/reopened.
  const openTask = openTaskId ? tasks.find((t) => t.id === openTaskId) || null : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Planner
        </div>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>Plan the next move, not just the deadline</h1>
      </div>

      <TaskBreakdown task={topTask} onSetSubtasks={setSubtasks} onToggleSubtask={toggleSubtask} />

      <div>
        <h3 style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 12 }}>Eisenhower board</h3>
        <PriorityBoard tasks={pendingTasks} onOpen={(t) => setOpenTaskId(t.id)} />
      </div>

      <DailySchedule blocks={blocks} loading={loading} error={error} onGenerate={generate} />

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
