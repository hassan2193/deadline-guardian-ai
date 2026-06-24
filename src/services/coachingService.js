// src/services/coachingService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildCoachingPrompt } from "../prompts/coachingPrompt";
import { riskLevel, formatTimeRemaining } from "../utils/deadlineUtils";

function nextOpenSubtask(task) {
  return (task.subtasks || []).find((s) => !s.done);
}

function localNudge(task, risk) {
  const remaining = formatTimeRemaining(task.deadline);
  const next = nextOpenSubtask(task);
  const action = next ? next.title : `Start "${task.title}"`;

  if (risk === "critical") {
    return `${action} — right now. ${remaining}, and there's no real buffer left.`;
  }
  if (risk === "high") {
    return `${action} next. ${remaining} — start today so you're not rushing tomorrow.`;
  }
  if (risk === "medium") {
    return `${action} this week. ${remaining}, plenty of room if you start soon.`;
  }
  return `${action} when you get a slot. ${remaining} — no pressure yet.`;
}

export async function getCoachingNudge(task) {
  const risk = riskLevel(task.deadline, task.effortHours);
  if (!isAIConfigured) return { nudge: localNudge(task, risk), risk };
  try {
    const result = await generateJSON(buildCoachingPrompt(task, risk));
    return { nudge: result.nudge, risk };
  } catch (err) {
    console.warn("AI coaching failed, using local fallback:", err.message);
    return { nudge: localNudge(task, risk), risk };
  }
}

export async function getNudgesForTasks(tasks) {
  const pending = tasks.filter((t) => t.status !== "done");
  const withRisk = pending.map((t) => ({ task: t, risk: riskLevel(t.deadline, t.effortHours) }));
  const priority = withRisk
    .filter((x) => x.risk === "critical" || x.risk === "high")
    .sort((a, b) => (a.risk === "critical" ? -1 : 1));

  const results = [];
  for (const { task } of priority.slice(0, 4)) {
    results.push(await getCoachingNudge(task));
  }
  return results.map((r, i) => ({ ...r, task: priority[i].task }));
}
