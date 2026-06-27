import React from "react";
import { useVoiceContext } from "../../context/VoiceContext";

export default function SpeakButton({ text, urgent = false, size = 28 }) {
  const { speak, stop, speaking, supported } = useVoiceContext();

  if (!supported) return null;

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(text, { urgent, force: true });
    }
  };

  return (
    <button
      onClick={handleClick}
      title={speaking ? "Stop" : "Speak this"}
      aria-label={speaking ? "Stop speaking" : "Speak this message"}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: speaking
          ? "var(--focus-dim, rgba(99,140,255,0.15))"
          : "var(--surface-raised)",
        color: speaking ? "var(--focus, #6c8cff)" : "var(--text-muted)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {speaking ? (
          <>
            <rect x="6" y="6" width="4" height="12" />
            <rect x="14" y="6" width="4" height="12" />
          </>
        ) : (
          <>
            <path d="M4 9v6h4l5 5V4L8 9H4z" />
            <path d="M16 8.5a4.5 4.5 0 010 7" />
            <path d="M18.5 6a8 8 0 010 12" />
          </>
        )}
      </svg>
    </button>
  );
}
