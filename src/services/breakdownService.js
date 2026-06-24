// src/services/breakdownService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildBreakdownPrompt } from "../prompts/breakdownPrompt";

function localBreakdown(task) {
  const totalMin = Math.round((task.effortHours || 1) * 60);
  const templates = [
    "Gather everything you need",
    "Draft the core/first pass",
    "Refine and fix gaps",
    "Final review",
    "Submit / send / complete",
  ];
  const n = totalMin > 90 ? 5 : totalMin > 30 ? 4 : 3;
  const chosen = templates.slice(0, n);
  const each = Math.max(Math.round(totalMin / n), 5);
  return chosen.map((title, i) => ({
    title: `${title}: ${task.title}`.length > 60 ? title : `${title} — ${task.title}`,
    estimatedMinutes: each,
  }));
}

export async function breakdownTask(task) {
  if (!isAIConfigured) return localBreakdown(task);
  try {
    const result = await generateJSON(buildBreakdownPrompt(task));
    return result.subtasks;
  } catch (err) {
    console.warn("AI breakdown failed, using local fallback:", err.message);
    return localBreakdown(task);
  }
}
