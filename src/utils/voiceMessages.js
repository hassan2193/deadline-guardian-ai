// src/utils/voiceMessages.js
// Builds short, speakable lines for the AI Voice Coach.
//
// The on-screen nudge text comes from Gemini (or a local fallback) and is
// always in English. Rather than attempting to translate that arbitrary
// text on the fly (unreliable without a translation API), we generate a
// dedicated Hindi/English line directly from the task + risk + time
// remaining — the same inputs the nudge itself is based on.

import { formatTimeRemaining } from "./deadlineUtils";

function nextOpenSubtaskTitle(task) {
  const next = (task.subtasks || []).find((s) => !s.done);
  return next ? next.title : null;
}

export function buildSpokenNudge(task, risk, language = "en", tone = "casual") {
  const remaining = formatTimeRemaining(task.deadline);
  const nextStep = nextOpenSubtaskTitle(task);
  const professional = tone === "professional";

  if (language === "hi") {
    const stepLine = nextStep
      ? `${nextStep} se shuru karo.`
      : `${task.title} shuru karo.`;
    if (risk === "critical") {
      return professional
        ? `Dhyan dein. ${task.title} ke liye sirf ${remaining} bache hain. ${stepLine} Ise abhi shuru karna zaroori hai.`
        : `Bhai, dhyan do. ${task.title} ke liye sirf ${remaining} bache hain. ${stepLine} Abhi shuru karna padega.`;
    }
    if (risk === "high") {
      return professional
        ? `${task.title} ${remaining} mein due hai. ${stepLine} Kripya aaj hi shuru karein.`
        : `${task.title} ${remaining} mein due hai. ${stepLine} Aaj hi shuru kar do.`;
    }
    if (risk === "medium") {
      return professional
        ? `${task.title} ${remaining} mein due hai. Samay hai, lekin jald shuru karna behtar hoga.`
        : `${task.title} ${remaining} mein due hai. Thoda time hai, par jaldi shuru karo.`;
    }
    return professional
      ? `${task.title} abhi track par hai, ${remaining} bache hain. Koi jaldi nahi hai.`
      : `${task.title} abhi safe hai, ${remaining} bache hain. Koi jaldi nahi.`;
  }

  // English (default)
  const stepLine = nextStep
    ? `Start with ${nextStep}.`
    : `Start "${task.title}".`;
  if (risk === "critical") {
    return professional
      ? `Attention. ${task.title} has only ${remaining} left. ${stepLine} This needs to start immediately.`
      : `Heads up. ${task.title} has only ${remaining} left. ${stepLine} You need to start right now.`;
  }
  if (risk === "high") {
    return professional
      ? `${task.title} is due in ${remaining}. ${stepLine} Please start today.`
      : `${task.title} is due in ${remaining}. ${stepLine} Start today.`;
  }
  if (risk === "medium") {
    return `${task.title} is due in ${remaining}. You have some room, but start soon.`;
  }
  return `${task.title} is on track with ${remaining} left. No rush yet.`;
}

export function buildSpokenWarning(
  warningMessage,
  language = "en",
  tone = "casual",
) {
  if (language === "hi") {
    return tone === "professional"
      ? `Dhyan dein, ek scheduling samasya hai. ${warningMessage}`
      : `Dhyan do, ek scheduling problem hai. ${warningMessage}`;
  }
  return `Heads up, there's a scheduling conflict. ${warningMessage}`;
}
