// src/services/breakdownService.js
import { generateJSON, isAIConfigured } from "./geminiService";
import { buildBreakdownPrompt } from "../prompts/breakdownPrompt";

const CACHE_KEY = "dg_breakdown_cache_v1";

// Cache key includes title/deadline/effort, not just task.id, so an edited
// task (renamed, re-scoped, deadline moved) gets a fresh breakdown instead
// of silently reusing a stale cached result for the old version of itself.
function cacheKeyFor(task) {
  return `${task.id}|${task.title}|${task.deadline}|${task.effortHours}`;
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable — caching is a nice-to-have, fail silently.
  }
}

function localBreakdown(task) {
  const totalMin = Math.round((task.effortHours || 1) * 60);
  const templates = [
    "Gather everything you need",
    "Draft the core first pass",
    "Refine and fix gaps",
    "Final review",
    "Submit and confirm it's done",
  ];
  const n = totalMin > 90 ? 5 : totalMin > 30 ? 4 : 3;
  const chosen = templates.slice(0, n);
  const each = Math.max(Math.round(totalMin / n), 5);
  return chosen.map((title) => {
    const full = `${title} — ${task.title}`;
    return {
      title: full.length > 70 ? title : full,
      estimatedMinutes: each,
    };
  });
}

export async function breakdownTask(task, { forceRefresh = false } = {}) {
  const key = cacheKeyFor(task);
  const cache = readCache();

  if (!forceRefresh && cache[key]) {
    return cache[key];
  }

  if (!isAIConfigured) {
    return localBreakdown(task);
  }

  try {
    const aiResult = await generateJSON(buildBreakdownPrompt(task));
    const result = aiResult.subtasks;
    // Only cache real AI output. A fallback (rate limit, network blip) is
    // temporary — caching it would lock the task into the generic template
    // forever, even after the AI starts working again.
    cache[key] = result;
    writeCache(cache);
    return result;
  } catch (err) {
    console.warn("AI breakdown failed, using local fallback:", err.message);
    return localBreakdown(task);
  }
}
