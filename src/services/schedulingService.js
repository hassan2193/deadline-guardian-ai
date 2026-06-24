// src/services/schedulingService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildSchedulePrompt } from "../prompts/schedulePrompt";
import { sortByPriority } from "../utils/priorityUtils";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Local fallback: greedily places pending tasks in priority order into a
// 9am-10pm day grid, inserting a short break every ~90 minutes of work.
function localSchedule(tasks, { dayStartHour = 9, dayEndHour = 22 } = {}) {
  const pending = sortByPriority(tasks.filter((t) => t.status !== "done"));
  const blocks = [];
  let cursorMin = dayStartHour * 60;
  const endMin = dayEndHour * 60;
  let workedSinceBreak = 0;

  for (const task of pending) {
    const durMin = Math.max(Math.round((task.effortHours || 1) * 60), 15);
    if (cursorMin + durMin > endMin) break;

    const startStr = `${pad(Math.floor(cursorMin / 60))}:${pad(cursorMin % 60)}`;
    cursorMin += durMin;
    const endStr = `${pad(Math.floor(cursorMin / 60))}:${pad(cursorMin % 60)}`;

    blocks.push({ start: startStr, end: endStr, taskTitle: task.title, note: `Est. ${task.effortHours}h` });

    workedSinceBreak += durMin;
    if (workedSinceBreak >= 90 && cursorMin + 15 <= endMin) {
      const bStart = `${pad(Math.floor(cursorMin / 60))}:${pad(cursorMin % 60)}`;
      cursorMin += 15;
      const bEnd = `${pad(Math.floor(cursorMin / 60))}:${pad(cursorMin % 60)}`;
      blocks.push({ start: bStart, end: bEnd, taskTitle: "Break", note: "Stretch, water, reset" });
      workedSinceBreak = 0;
    }
  }

  return blocks;
}

export async function generateDailySchedule(tasks, options = {}) {
  const pending = tasks.filter((t) => t.status !== "done");
  if (!pending.length) return [];
  if (!isAIConfigured) return localSchedule(tasks, options);
  try {
    const result = await generateJSON(buildSchedulePrompt(pending, options));
    return result.blocks;
  } catch (err) {
    console.warn("AI scheduling failed, using local fallback:", err.message);
    return localSchedule(tasks, options);
  }
}
