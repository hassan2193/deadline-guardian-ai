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

export function buildSpokenNudge(task, risk, language = "en") {
  const remaining = formatTimeRemaining(task.deadline);
  const nextStep = nextOpenSubtaskTitle(task);

  if (language === "hi") {
    const stepLine = nextStep ? `${nextStep} se shuru karo.` : `${task.title} shuru karo.`;
    if (risk === "critical") {
      return `Bhai, dhyan do. ${task.title} ke liye sirf ${remaining} bache hain. ${stepLine} Abhi shuru karna padega.`;
    }
    if (risk === "high") {
      return `${task.title} ${remaining} mein due hai. ${stepLine} Aaj hi shuru kar do.`;
    }
    if (risk === "medium") {
      return `${task.title} ${remaining} mein due hai. Thoda time hai, par jaldi shuru karo.`;
    }
    return `${task.title} abhi safe hai, ${remaining} bache hain. Koi jaldi nahi.`;
  }

  // English (default)
  const stepLine = nextStep ? `Start with ${nextStep}.` : `Start "${task.title}".`;
  if (risk === "critical") {
    return `Heads up. ${task.title} has only ${remaining} left. ${stepLine} You need to start right now.`;
  }
  if (risk === "high") {
    return `${task.title} is due in ${remaining}. ${stepLine} Start today.`;
  }
  if (risk === "medium") {
    return `${task.title} is due in ${remaining}. You have some room, but start soon.`;
  }
  return `${task.title} is on track with ${remaining} left. No rush yet.`;
}

export function buildSpokenWarning(warningMessage, language = "en") {
  if (language === "hi") {
    return `Dhyan do, ek scheduling problem hai. ${warningMessage}`;
  }
  return `Heads up, there's a scheduling conflict. ${warningMessage}`;
}
