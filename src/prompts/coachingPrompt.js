// src/prompts/coachingPrompt.js
// Used to generate a short, specific, motivating nudge for a task at risk.

export function buildCoachingPrompt(task, riskLevel) {
  return `You are a calm, direct productivity coach. Write ONE short nudge (max 2 sentences, no fluff, no emoji) for this task.

Task: "${task.title}"
Risk level: ${riskLevel}
Deadline: ${task.deadline}
Subtasks remaining: ${(task.subtasks || []).filter((s) => !s.done).length} of ${(task.subtasks || []).length}

The nudge should tell the user the single next concrete action to take right now, and why the timing matters.

Return ONLY valid JSON, no markdown fences:
{ "nudge": "the message" }`;
}
