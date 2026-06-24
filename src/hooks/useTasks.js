import { useMemo } from "react";
import { useTaskContext } from "../context/TaskContext";
import { sortByPriority } from "../utils/priorityUtils";
import { isOverdue } from "../utils/deadlineUtils";

export function useTasks() {
  const ctx = useTaskContext();

  const pendingTasks = useMemo(
    () => ctx.tasks.filter((t) => t.status !== "done"),
    [ctx.tasks],
  );
  const doneTasks = useMemo(
    () => ctx.tasks.filter((t) => t.status === "done"),
    [ctx.tasks],
  );
  const overdueTasks = useMemo(
    () => pendingTasks.filter((t) => isOverdue(t.deadline)),
    [pendingTasks],
  );
  const prioritized = useMemo(
    () => sortByPriority(pendingTasks),
    [pendingTasks],
  );

  return {
    ...ctx,
    pendingTasks,
    doneTasks,
    overdueTasks,
    prioritized,
  };
}
