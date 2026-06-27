import { hoursUntil } from "./deadlineUtils";

export function quadrantFor(task) {
  const hrs = hoursUntil(task.deadline);
  const urgent = hrs < 24 * 2; // due within 48h
  const important = task.importance >= 4;
  if (urgent && important) return "do-now";
  if (!urgent && important) return "schedule";
  if (urgent && !important) return "delegate-or-shrink";
  return "later";
}

export const QUADRANT_META = {
  "do-now": { label: "Do now", color: "var(--urgent)" },
  schedule: { label: "Schedule", color: "var(--focus)" },
  "delegate-or-shrink": { label: "Quick win", color: "var(--warn)" },
  later: { label: "Later", color: "var(--text-dim)" },
};

export function priorityScore(task) {
  const hrs = Math.max(hoursUntil(task.deadline), 0.1);
  const urgencyScore = 100 / Math.sqrt(hrs); // grows sharply as deadline nears
  const importanceScore = (task.importance || 3) * 8;
  const effortPenalty = (task.effortHours || 1) * 1.5;
  const overdueBoost = hrs <= 0.1 ? 50 : 0;
  return Math.round(
    urgencyScore + importanceScore - effortPenalty + overdueBoost,
  );
}

export function sortByPriority(tasks) {
  return [...tasks].sort((a, b) => priorityScore(b) - priorityScore(a));
}
