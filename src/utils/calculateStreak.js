export function calculateStreak(completionLog = []) {
  if (!completionLog.length) return { current: 0, longest: 0 };

  const days = [
    ...new Set(completionLog.map((iso) => iso.slice(0, 10))),
  ].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  // Current streak: walk backwards from today.
  const todayStr = new Date().toISOString().slice(0, 10);
  const daySet = new Set(days);
  let current = 0;
  let cursor = new Date();
  // allow today to be "in progress" without breaking the streak
  if (!daySet.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, longest };
}
