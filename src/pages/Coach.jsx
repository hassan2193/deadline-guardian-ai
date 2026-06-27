import React from "react";
import { useTasks } from "../hooks/useTasks";
import NudgesPanel from "../components/coach/NudgesPanel.jsx";
import Recommendations from "../components/coach/Recommendations.jsx";
import VoiceSettings from "../components/voice/VoiceSettings.jsx";

export default function Coach() {
  const { pendingTasks } = useTasks();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-dim)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Coach
        </div>
        <h1 style={{ fontSize: 26, marginTop: 4 }}>
          Your next concrete action
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>
          Not another reminder — a specific nudge on what to do right now, and
          why the timing matters.
        </p>
      </div>

      <VoiceSettings />
      <NudgesPanel tasks={pendingTasks} />
      <Recommendations tasks={pendingTasks} />
    </div>
  );
}
