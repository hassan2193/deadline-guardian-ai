import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { routes } from "./routes.jsx";
import { useTasks } from "./hooks/useTasks";

const ICONS = {
  grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  calendar: <path d="M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" />,
  spark: <path d="M12 2l2 7h7l-6 5 2 8-7-5-7 5 2-8-6-5h7z" />,
  trend: <path d="M3 17l5-5 4 4 8-8M21 4h-6v6" />,
};

function Icon({ name }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

export default function App() {
  const { overdueTasks } = useTasks();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 220,
          borderRight: "1px solid var(--border)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 10px 24px",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--urgent)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#0e1014",
              fontSize: 15,
            }}
          >
            DG
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Deadline Guardian
          </div>
        </div>

        {routes.map((r) => (
          <NavLink
            key={r.path}
            to={r.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              color: isActive ? "var(--text)" : "var(--text-muted)",
              background: isActive ? "var(--surface-raised)" : "transparent",
              fontSize: 14,
              fontWeight: 500,
              position: "relative",
            })}
          >
            <Icon name={r.icon} />
            {r.label}
            {r.path === "/" && overdueTasks.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--urgent)",
                  color: "#1a0d0a",
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: "1px 7px",
                }}
              >
                {overdueTasks.length}
              </span>
            )}
          </NavLink>
        ))}

        <div
          style={{
            marginTop: "auto",
            padding: "0 10px",
            fontSize: 12,
            color: "var(--text-dim)",
          }}
        >
          Built for the Last-Minute Life Saver hackathon brief.
        </div>
      </aside>

      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1100 }}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}
