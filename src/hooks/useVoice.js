// src/hooks/useVoice.js
// Wraps the browser SpeechSynthesis API to let the AI "speak" nudges and
// coaching messages out loud, instead of relying on text the user can
// scroll past and ignore.

import { useCallback, useEffect, useRef, useState } from "react";

const SETTINGS_KEY = "dg_voice_settings_v1";

const DEFAULT_SETTINGS = {
  enabled: true, // master on/off
  autoSpeak: true, // speak automatically for high-risk / critical tasks
  language: "en", // "en" | "hi"
  tone: "casual", // "casual" (bhai/dost) | "professional"
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function pickVoice(voices, language) {
  if (!voices.length) return null;
  const wantHindi = language === "hi";
  const langPrefix = wantHindi ? "hi" : "en";

  // Prefer an exact language-prefix match.
  const match = voices.find((v) =>
    v.lang?.toLowerCase().startsWith(langPrefix),
  );
  if (match) return match;

  // Fall back to any English voice (most browsers always ship one),
  // since Hindi voices aren't installed on every system.
  const fallback = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
  return fallback || voices[0];
}

// TTS engines treat short all-caps tokens (ML, AI, HR, PDF) as a single
// word and mangle the pronunciation ("ML" -> "mill"/"militr" etc).
// Spelling them out as separate letters ("M L") makes the engine read
// each letter individually instead, which sounds correct in both
// English and Hindi voices.
function spellOutAbbreviations(text) {
  return text.replace(/\b[A-Z]{2,5}\b/g, (match) => match.split("").join(" "));
}

// Time strings like "3h left", "45m left", "2d 6h" use single-letter
// units that read fine visually but get spoken as the literal letter
// ("h") instead of "hours". Expand them into words before speaking,
// using the correct singular form when the count is exactly 1.
function expandTimeUnits(text, language) {
  const plural =
    language === "hi"
      ? { h: "ghante", m: "minute", d: "din" }
      : { h: "hours", m: "minutes", d: "days" };
  const singular =
    language === "hi"
      ? { h: "ghanta", m: "minute", d: "din" }
      : { h: "hour", m: "minute", d: "day" };

  return text.replace(/(\d+)\s?(h|m|d)\b/g, (_, num, unit) => {
    const n = parseInt(num, 10);
    const word = n === 1 ? singular[unit] : plural[unit];
    return `${num} ${word}`;
  });
}

// Hindi number words for 0-99, enough to cover realistic hour/minute/day
// counts. Mixing Hindi voice + raw digits sounds inconsistent (engine
// reads digits in English), so in Hindi mode we spell numbers out fully.
const HINDI_ONES = [
  "shunya",
  "ek",
  "do",
  "teen",
  "chaar",
  "paanch",
  "chhah",
  "saat",
  "aath",
  "nau",
  "das",
  "gyarah",
  "barah",
  "terah",
  "chaudah",
  "pandrah",
  "solah",
  "satrah",
  "atharah",
  "unnees",
];
const HINDI_TENS = [
  "",
  "",
  "bees",
  "tees",
  "chaalees",
  "pachaas",
  "saath",
  "sattar",
  "assi",
  "navve",
];

function numberToHindiWords(n) {
  if (n < 20) return HINDI_ONES[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return ones === 0
      ? HINDI_TENS[tens]
      : `${HINDI_ONES[ones]} ${HINDI_TENS[tens]}`;
  }
  return String(n); // fall back for anything larger than realistic deadlines
}

function spellOutNumbers(text, language) {
  if (language !== "hi") return text;
  return text.replace(/\b\d{1,2}\b/g, (match) =>
    numberToHindiWords(parseInt(match, 10)),
  );
}

// Symbols read awkwardly by TTS ("/" -> "slash", "&" -> "and" said abruptly).
// Replace with natural words/pauses so sentences flow instead of sounding
// like raw text being read character-by-character.
function cleanSymbolsForSpeech(text) {
  return text
    .replace(/\s*\/\s*/g, " or ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\s*-\s*/g, " ")
    .replace(/\s*—\s*/g, ", ")
    .replace(/[_*#]/g, "");
}

export function useVoice() {
  const [settings, setSettings] = useState(loadSettings);
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const queueRef = useRef([]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supported]);

  const speak = useCallback(
    (text, { urgent = false, force = false } = {}) => {
      if (!supported || !text) return;
      if (!settings.enabled && !force) return;

      // Cancel anything already queued/speaking so language switches take
      // effect immediately instead of an old utterance finishing first.
      window.speechSynthesis.cancel();

      // Re-fetch voices live instead of relying on React state — some
      // browsers (notably Chrome) populate the voice list asynchronously,
      // and a stale closure can keep picking the wrong/default voice even
      // after the real list has loaded.
      const liveVoices = window.speechSynthesis.getVoices();
      const voice = pickVoice(
        liveVoices.length ? liveVoices : voices,
        settings.language,
      );

      const cleanedText = cleanSymbolsForSpeech(
        spellOutAbbreviations(
          spellOutNumbers(
            expandTimeUnits(text, settings.language),
            settings.language,
          ),
        ),
      );
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang; // keep voice + lang consistent, avoids Chrome ignoring the voice
      } else {
        utterance.lang = settings.language === "hi" ? "hi-IN" : "en-IN";
      }

      // Urgent messages are spoken faster and slightly higher pitched so
      // they read as alarmed rather than calm, without changing the words.
      utterance.rate = urgent ? 1.15 : 0.98;
      utterance.pitch = urgent ? 1.15 : 1;
      utterance.volume = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      // Small delay avoids a known Chrome bug where speak() called right
      // after cancel() is silently dropped.
      setTimeout(() => window.speechSynthesis.speak(utterance), 50);
    },
    [supported, settings.enabled, settings.language, voices],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    supported,
    speaking,
    settings,
    updateSettings,
    speak,
    stop,
  };
}
