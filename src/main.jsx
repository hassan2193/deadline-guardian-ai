import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { VoiceProvider } from "./context/VoiceContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </TaskProvider>
    </BrowserRouter>
  </React.StrictMode>
);
