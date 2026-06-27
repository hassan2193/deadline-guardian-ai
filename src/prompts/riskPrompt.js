export function buildRiskPrompt(tasks) {
  const list = tasks
    .map(
      (t) =>
        `- "${t.title}" | effort=${t.effortHours}h | deadline=${t.deadline} | importance=${t.importance}/5`,
    )
    .join("\n");

  return `You are a risk-assessment assistant for a personal task list (current time: ${new Date().toISOString()}).

Tasks:
${list}

Identify any scheduling conflicts or overload risk (e.g. multiple tasks competing for the same narrow time window, insufficient total hours before a deadline).

Return ONLY valid JSON, no markdown fences:
{
  "warnings": [
    { "taskIds": ["id1","id2"], "message": "max 16 words describing the conflict" }
  ]
}
If there are no conflicts, return { "warnings": [] }.`;
}
