// src/prompts/breakdownPrompt.js
// Used to split a large task into actionable sub-steps with mini-deadlines.

export function buildBreakdownPrompt(task) {
  return `You are a planning assistant. Break this task into a sequence of small, concrete, actionable sub-steps a person can complete one at a time.

Task: "${task.title}"
Description: "${task.description || "(none)"}"
Deadline: ${task.deadline}
Total estimated effort: ${task.effortHours} hours

Return ONLY valid JSON, no markdown fences:
{
  "subtasks": [
    { "title": "imperative action, max 8 words", "estimatedMinutes": number }
  ]
}
Rules:
- 3 to 6 subtasks, ordered logically.
- Each subtask should be completable in one sitting.
- Minutes across subtasks should roughly sum to the total effort hours.`;
}
