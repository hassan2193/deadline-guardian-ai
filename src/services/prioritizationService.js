import { generateJSON, isAIConfigured } from "./geminiService";
import { buildPrioritizationPrompt } from "../prompts/prioritizationPrompt";
import { sortByPriority, priorityScore } from "../utils/priorityUtils";

function localPrioritize(tasks) {
  const sorted = sortByPriority(tasks);
  return sorted.map((t, i) => ({
    id: t.id,
    rank: i + 1,
    reason:
      i === 0
        ? "Highest combined urgency and impact right now."
        : `Score ${priorityScore(t)} from deadline pressure and importance.`,
  }));
}

export async function prioritizeTasks(tasks) {
  if (!tasks.length) return [];
  if (!isAIConfigured) return localPrioritize(tasks);
  try {
    const result = await generateJSON(buildPrioritizationPrompt(tasks));
    return result.ranking;
  } catch (err) {
    console.warn(
      "AI prioritization failed, using local fallback:",
      err.message,
    );
    return localPrioritize(tasks);
  }
}
