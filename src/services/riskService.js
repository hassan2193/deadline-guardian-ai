// src/services/riskService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildRiskPrompt } from "../prompts/riskPrompt";
import { hoursUntil } from "../utils/deadlineUtils";

// Local fallback: flags pairs of pending tasks whose deadlines are close
// together but whose combined effort can't fit in the time available.
function localRiskScan(tasks) {
  const pending = tasks.filter((t) => t.status !== "done");
  const warnings = [];

  for (let i = 0; i < pending.length; i++) {
    for (let j = i + 1; j < pending.length; j++) {
      const a = pending[i];
      const b = pending[j];
      const aHrs = hoursUntil(a.deadline);
      const bHrs = hoursUntil(b.deadline);
      const closeWindow = Math.abs(aHrs - bHrs) < 6;
      const combinedEffort = (a.effortHours || 1) + (b.effortHours || 1);
      const tightestWindow = Math.min(Math.max(aHrs, 0.1), Math.max(bHrs, 0.1));

      if (closeWindow && combinedEffort > tightestWindow) {
        warnings.push({
          taskIds: [a.id, b.id],
          message: `"${a.title}" and "${b.title}" compete for the same narrow window.`,
        });
      }
    }
  }
  return warnings;
}

export async function scanForRisks(tasks) {
  const pending = tasks.filter((t) => t.status !== "done");
  if (pending.length < 2) return [];
  if (!isAIConfigured) return localRiskScan(tasks);
  try {
    const result = await generateJSON(buildRiskPrompt(pending));
    return result.warnings;
  } catch (err) {
    console.warn("AI risk scan failed, using local fallback:", err.message);
    return localRiskScan(tasks);
  }
}
