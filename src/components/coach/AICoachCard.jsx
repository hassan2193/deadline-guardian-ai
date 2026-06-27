import React, { useEffect, useRef } from "react";
import { RISK_COLORS, RISK_LABELS } from "../../utils/deadlineUtils";
import { useVoiceContext } from "../../context/VoiceContext";
import { buildSpokenNudge } from "../../utils/voiceMessages";
import SpeakButton from "../voice/SpeakButton.jsx";

export default function AICoachCard({ task, nudge, risk }) {
  const color = RISK_COLORS[risk];
  const { speak, settings } = useVoiceContext();
  const spokenRef = useRef(false);

  const spokenText = buildSpokenNudge(
    task,
    risk,
    settings.language,
    settings.tone,
  );

  // Auto-speak once per card mount, only for critical/high risk tasks,
  // and only if the user hasn't turned auto-speak off.
  useEffect(() => {
    if (spokenRef.current) return;
    if (!settings.autoSpeak) return;
    if (risk !== "critical" && risk !== "high") return;
    spokenRef.current = true;
    speak(spokenText, { urgent: risk === "critical" });
  }, [task.id, risk, settings.autoSpeak, settings.language]);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color}33`,
        borderRadius: "var(--radius-md)",
        padding: 16,
        display: "flex",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 4,
          borderRadius: 4,
          background: color,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>
            {RISK_LABELS[risk]}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {task.title}
          </span>
        </div>
        <p style={{ fontSize: 14, marginTop: 6 }}>{nudge}</p>
      </div>
      <SpeakButton text={spokenText} urgent={risk === "critical"} />
    </div>
  );
}
