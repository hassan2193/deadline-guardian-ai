import React from "react";
import { useVoiceContext } from "../../context/VoiceContext";

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid var(--border)",
};

const labelStyle = { fontSize: 13, color: "var(--text)" };
const subLabelStyle = { fontSize: 12, color: "var(--text-dim)", marginTop: 2 };

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: checked ? "var(--safe)" : "var(--surface-raised)",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 20 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}

export default function VoiceSettings() {
  const { settings, updateSettings, speak, supported } = useVoiceContext();

  if (!supported) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--text-dim)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: 16,
        }}
      >
        Voice coaching isn't supported in this browser.
      </div>
    );
  }

  const handleTest = () => {
    const sample =
      settings.language === "hi"
        ? settings.tone === "professional"
          ? "Namaste, yeh aapka AI Voice Coach hai. अब koi bhi zaroori deadline miss nahi hogi."
          : "Dost, ye tumhara AI Voice Coach hai. अब important deadlines miss nahi hongi."
        : "Hey, this is your AI Voice Coach. You won't miss an important deadline again.";
    speak(sample, { force: true });
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: 16,
      }}
    >
      <h4 style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>
        🔊 AI Voice Coach
      </h4>

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Voice coach</div>
          <div style={subLabelStyle}>Master switch for spoken nudges</div>
        </div>
        <Toggle
          checked={settings.enabled}
          onChange={(v) => updateSettings({ enabled: v })}
        />
      </div>

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Auto-speak risky tasks</div>
          <div style={subLabelStyle}>
            Speak automatically for critical / at-risk tasks
          </div>
        </div>
        <Toggle
          checked={settings.autoSpeak}
          onChange={(v) => updateSettings({ autoSpeak: v })}
        />
      </div>

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Language</div>
          <div style={subLabelStyle}>Voice used for spoken messages</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "en", label: "English" },
            { id: "hi", label: "हिंदी" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateSettings({ language: opt.id })}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                background:
                  settings.language === opt.id
                    ? "var(--focus, #6c8cff)"
                    : "var(--surface-raised)",
                color:
                  settings.language === opt.id ? "#fff" : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...rowStyle, borderBottom: "none" }}>
        <div>
          <div style={labelStyle}>Tone</div>
          <div style={subLabelStyle}>
            Casual ("dost") or a more formal voice
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "casual", label: "Casual" },
            { id: "professional", label: "Professional" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateSettings({ tone: opt.id })}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                background:
                  settings.tone === opt.id
                    ? "var(--focus, #6c8cff)"
                    : "var(--surface-raised)",
                color: settings.tone === opt.id ? "#fff" : "var(--text-muted)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleTest}
        style={{
          marginTop: 10,
          width: "100%",
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          background: "var(--surface-raised)",
          color: "var(--text)",
          cursor: "pointer",
        }}
      >
        ▶ Test voice
      </button>
    </div>
  );
}
