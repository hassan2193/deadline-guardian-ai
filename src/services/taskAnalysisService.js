import { generateJSON, isAIConfigured } from "./geminiService";
import { buildTaskAnalysisPrompt } from "../prompts/taskAnalysisPrompt";

const CATEGORY_KEYWORDS = [
  {
    category: "Academic",
    words: [
      "assignment",
      "exam",
      "homework",
      "thesis",
      "lecture",
      "submit",
      "report",
    ],
  },
  {
    category: "Bills",
    words: ["bill", "payment", "invoice", "rent", "emi", "due"],
  },
  {
    category: "Career",
    words: ["interview", "resume", "application", "offer", "job"],
  },
  {
    category: "Work",
    words: ["meeting", "client", "standup", "deck", "presentation", "project"],
  },
  {
    category: "Health",
    words: ["doctor", "appointment", "gym", "workout", "medicine"],
  },
  { category: "Habit", words: ["daily", "habit", "streak", "routine"] },
];

function guessCategory(text) {
  const lower = text.toLowerCase();
  for (const { category, words } of CATEGORY_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) return category;
  }
  return "Personal";
}

function guessImportance(text) {
  const lower = text.toLowerCase();
  if (/(urgent|critical|asap|interview|exam|final)/.test(lower)) return 5;
  if (/(important|deadline|submit|client)/.test(lower)) return 4;
  if (/(should|maybe|sometime)/.test(lower)) return 2;
  return 3;
}

function guessEffort(text) {
  const lower = text.toLowerCase();
  if (/(report|thesis|project|presentation)/.test(lower)) return 3;
  if (/(email|call|pay|book)/.test(lower)) return 0.3;
  return 1;
}

// Heuristic fallback used when no AI key is configured (or the call fails).
function localAnalyze(rawText) {
  const title = rawText.length > 60 ? rawText.slice(0, 57) + "..." : rawText;
  return {
    title,
    description: rawText,
    importance: guessImportance(rawText),
    effortHours: guessEffort(rawText),
    category: guessCategory(rawText),
    suggestedDeadlineHoursFromNow: null,
  };
}

export async function analyzeTaskText(rawText) {
  if (!isAIConfigured) return localAnalyze(rawText);
  try {
    const result = await generateJSON(buildTaskAnalysisPrompt(rawText));
    return result;
  } catch (err) {
    console.warn("AI task analysis failed, using local fallback:", err.message);
    return localAnalyze(rawText);
  }
}
