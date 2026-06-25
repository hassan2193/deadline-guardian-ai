// src/context/VoiceContext.jsx
// Makes a single useVoice() instance available across the whole app so
// every page (Coach, Planner, Dashboard) shares the same settings and
// doesn't register multiple speechSynthesis listeners.

import React, { createContext, useContext } from "react";
import { useVoice } from "../hooks/useVoice";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const voice = useVoice();
  return <VoiceContext.Provider value={voice}>{children}</VoiceContext.Provider>;
}

export function useVoiceContext() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoiceContext must be used within a VoiceProvider");
  return ctx;
}
