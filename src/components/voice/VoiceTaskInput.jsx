// src/components/voice/VoiceTaskInput.jsx
import React, { useState, useRef } from "react";

export default function VoiceTaskInput({ onResult }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const recognitionRef = useRef(null);

  function start() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stop() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      title={listening ? "Stop listening" : "Add a task by voice"}
      style={{
        background: listening ? "var(--urgent-dim)" : "var(--surface-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        width: 40,
        display: "grid",
        placeItems: "center",
        color: listening ? "var(--urgent)" : "var(--text-muted)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 11a7 7 0 0 1-14 0M12 18v4M8 22h8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
