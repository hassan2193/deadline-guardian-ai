// src/prompts/taskAnalysisPrompt.js
// Used to extract structured fields (importance, effort, category) from free-text task input.

export function buildTaskAnalysisPrompt(rawText) {
  return `You are a productivity assistant that converts a raw task description into structured fields.
Return ONLY valid JSON, no markdown fences, no preamble.

Task description: "${rawText}"

Return JSON with exactly these fields:
{
  "title": "short imperative title, max 8 words",
  "description": "one sentence clarifying detail",
  "importance": 1-5 integer (5 = high stakes / hard to recover if missed),
  "effortHours": number (realistic estimate of focused hours needed),
  "category": "one of: Academic, Work, Bills, Career, Personal, Habit, Health, Other",
  "suggestedDeadlineHoursFromNow": number or null (only if the text implies a deadline you can infer; otherwise null)
}`;
}
