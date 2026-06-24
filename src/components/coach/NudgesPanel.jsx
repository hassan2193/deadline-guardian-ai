// src/components/coach/NudgesPanel.jsx
import React, { useEffect, useState } from "react";
import { getNudgesForTasks } from "../../services/coachingService";
import AICoachCard from "./AICoachCard.jsx";

export default function NudgesPanel({ tasks }) {
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getNudgesForTasks(tasks).then((result) => {
      if (active) {
        setNudges(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);

  if (loading) {
    return <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Reading your task list…</div>;
  }

  if (!nudges.length) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--safe)",
          background: "var(--safe-dim)",
          padding: 14,
          borderRadius: "var(--radius-md)",
        }}
      >
        Nothing urgent right now. Good place to get ahead on something due later.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {nudges.map((n) => (
        <AICoachCard key={n.task.id} task={n.task} nudge={n.nudge} risk={n.risk} />
      ))}
    </div>
  );
}
