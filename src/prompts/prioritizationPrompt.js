export function buildPrioritizationPrompt(tasks) {
  const list = tasks
    .map(
      (t, i) =>
        `${i + 1}. id=${t.id} | "${t.title}" | importance=${t.importance}/5 | effort=${t.effortHours}h | deadline=${t.deadline} | status=${t.status}`,
    )
    .join("\n");

  return `You are an executive assistant prioritizing a user's task list right now (current time: ${new Date().toISOString()}).

Tasks:
${list}

Rank these tasks by what the user should work on first, considering deadline pressure, importance, and effort (quick high-impact wins can jump ahead of low-impact tasks even if their deadline is sooner).

Return ONLY valid JSON, no markdown fences:
{
  "ranking": [
    { "id": "task id", "rank": 1, "reason": "max 12 words explaining why this rank" }
  ]
}`;
}
