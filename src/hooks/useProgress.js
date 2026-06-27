import { useMemo } from "react";
import { useTaskContext } from "../context/TaskContext";
import {
  completionRate,
  tasksDueToday,
  tasksMissed,
} from "../utils/progressUtils";
import { calculateStreak } from "../utils/calculateStreak";

export function useProgress() {
  const { tasks, completionLog } = useTaskContext();

  const stats = useMemo(
    () => ({
      rate: completionRate(tasks),
      dueToday: tasksDueToday(tasks),
      missed: tasksMissed(tasks),
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks],
  );

  const streak = useMemo(() => calculateStreak(completionLog), [completionLog]);

  return { ...stats, streak };
}
