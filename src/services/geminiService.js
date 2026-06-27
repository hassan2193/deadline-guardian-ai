// src/services/geminiService.js
// Thin wrapper around the Gemini API. If no API key is configured, every
// caller in this app has a heuristic fallback, so the product still works
// fully offline for a demo — it just uses local logic instead of a live model.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

export const isAIConfigured = Boolean(API_KEY);

function stripFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

// --- Request queue -------------------------------------------------------
// The app fires several AI calls at once (scheduling, coaching, risk scan,
// breakdown). The free Gemini tier has a low requests-per-minute limit, so
// firing them in parallel burns through it instantly and every call after
// the first few comes back 429. This queue runs calls one at a time with a
// short gap between them so the app stays under the limit.
let queue = Promise.resolve();
const MIN_GAP_MS = 1200;

function enqueue(task) {
  const run = queue.then(async () => {
    const result = await task();
    await new Promise((r) => setTimeout(r, MIN_GAP_MS));
    return result;
  });
  // Keep the chain alive even if this call throws, so later calls aren't blocked.
  queue = run.catch(() => {});
  return run;
}

async function callGemini(prompt, model) {
  const res = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 },
    }),
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }
  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  return JSON.parse(stripFences(text));
}

/**
 * Sends a single-turn prompt to Gemini and parses the response as JSON.
 * Throws if the API key is missing or the call/parse fails — callers should
 * catch this and use their local heuristic fallback.
 *
 * Uses gemini-2.5-flash-lite by default — it has a higher free-tier
 * requests-per-minute quota than gemini-2.5-flash, which matters more here
 * than the small quality difference for short tasks like breakdowns/nudges.
 */
export async function generateJSON(
  prompt,
  { model = "gemini-2.5-flash-lite" } = {},
) {
  if (!API_KEY) {
    throw new Error("AI not configured: missing VITE_GEMINI_API_KEY");
  }

  return enqueue(async () => {
    try {
      return await callGemini(prompt, model);
    } catch (err) {
      if (err.message === "RATE_LIMITED") {
        // One retry after a longer pause — covers the case where the
        // burst at app load briefly exceeds the per-minute limit.
        await new Promise((r) => setTimeout(r, 4000));
        return callGemini(prompt, model);
      }
      throw err;
    }
  });
}
