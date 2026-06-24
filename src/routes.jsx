import Dashboard from "./pages/Dashboard.jsx";
import Planner from "./pages/Planner.jsx";
import Progress from "./pages/Progress.jsx";
import Coach from "./pages/Coach.jsx";

export const routes = [
  { path: "/", label: "Dashboard", icon: "grid", element: <Dashboard /> },
  {
    path: "/planner",
    label: "Planner",
    icon: "calendar",
    element: <Planner />,
  },
  { path: "/coach", label: "Coach", icon: "spark", element: <Coach /> },
  {
    path: "/progress",
    label: "Progress",
    icon: "trend",
    element: <Progress />,
  },
];
