// src/prompts/schedulePrompt.js
// Used to generate a realistic day plan that slots pending tasks into time blocks.

export function buildSchedulePrompt(tasks, options = {}) {
  const { dayStartHour = 9, dayEndHour = 22 } = options;
  const list = tasks
    .map(
      (t) =>
        `- "${t.title}" | effort=${t.effortHours}h | deadline=${t.deadline} | importance=${t.importance}/5`
    )
    .join("\n");

  return `You are a scheduling assistant. Build a realistic plan for today (current time: ${new Date().toISOString()}), fitting work between ${dayStartHour}:00 and ${dayEndHour}:00, including short breaks.

Pending tasks:
${list}

Return ONLY valid JSON, no markdown fences:
{
  "blocks": [
    { "start": "HH:MM", "end": "HH:MM", "taskTitle": "task title or 'Break'", "note": "max 10 words" }
  ]
}`;
}
