export function completionRate(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round((done / tasks.length) * 100);
}

export function tasksDueToday(tasks) {
  const today = new Date();
  return tasks.filter((t) => {
    const d = new Date(t.deadline);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate() &&
      t.status !== "done"
    );
  });
}

export function tasksMissed(tasks) {
  const now = new Date();
  return tasks.filter((t) => new Date(t.deadline) < now && t.status !== "done");
}

export function totalStepsProgress(task) {
  if (!task.subtasks || task.subtasks.length === 0) return null;
  const done = task.subtasks.filter((s) => s.done).length;
  return {
    done,
    total: task.subtasks.length,
    pct: Math.round((done / task.subtasks.length) * 100),
  };
}
