// src/utils/deadlineUtils.js
// Helpers for working with deadlines, time remaining, and risk windows.

export function hoursUntil(deadlineISO) {
  const now = new Date();
  const deadline = new Date(deadlineISO);
  return (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
}

export function isOverdue(deadlineISO) {
  return hoursUntil(deadlineISO) < 0;
}

export function formatTimeRemaining(deadlineISO) {
  const hrs = hoursUntil(deadlineISO);
  if (hrs < 0) {
    const overdueHrs = Math.abs(hrs);
    if (overdueHrs < 24) return `Overdue by ${Math.round(overdueHrs)}h`;
    return `Overdue by ${Math.round(overdueHrs / 24)}d`;
  }
  if (hrs < 1) return `${Math.round(hrs * 60)}m left`;
  if (hrs < 24) return `${Math.round(hrs)}h left`;
  const days = Math.floor(hrs / 24);
  const remHrs = Math.round(hrs % 24);
  return `${days}d ${remHrs}h left`;
}

export function formatDeadlineDate(deadlineISO) {
  const d = new Date(deadlineISO);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Risk bands drive color coding across the app.
export function riskLevel(deadlineISO, effortHours = 1) {
  const hrs = hoursUntil(deadlineISO);
  if (hrs < 0) return "critical";
  // Not enough runway to comfortably finish the estimated effort.
  const buffer = hrs / Math.max(effortHours, 0.5);
  if (buffer < 1.5) return "critical";
  if (buffer < 3) return "high";
  if (buffer < 8) return "medium";
  return "low";
}

export const RISK_COLORS = {
  critical: "var(--urgent)",
  high: "var(--warn)",
  medium: "var(--focus)",
  low: "var(--safe)",
};

export const RISK_LABELS = {
  critical: "Critical",
  high: "At risk",
  medium: "Watch",
  low: "On track",
};
