// src/services/breakdownService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildBreakdownPrompt } from "../prompts/breakdownPrompt";

function localBreakdown(task) {
  const totalMin = Math.round((task.effortHours || 1) * 60);
  const templates = [
    "Gather everything you need",
    "Draft the core first pass",
    "Refine and fix gaps",
    "Final review",
    "Submit and confirm it's done",
  ];
  const n = totalMin > 90 ? 5 : totalMin > 30 ? 4 : 3;
  const chosen = templates.slice(0, n);
  const each = Math.max(Math.round(totalMin / n), 5);
  return chosen.map((title) => {
    const full = `${title} — ${task.title}`;
    return {
      title: full.length > 70 ? title : full,
      estimatedMinutes: each,
    };
  });
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
