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

/**
 * Sends a single-turn prompt to Gemini and parses the response as JSON.
 * Throws if the API key is missing or the call/parse fails — callers should
 * catch this and use their local heuristic fallback.
 */
export async function generateJSON(prompt, { model = "gemini-1.5-flash" } = {}) {
  if (!API_KEY) {
    throw new Error("AI not configured: missing VITE_GEMINI_API_KEY");
  }

  const res = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  return JSON.parse(stripFences(text));
}
