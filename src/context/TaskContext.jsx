import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { sampleTasks, sampleCompletionLog } from "../data/sampleTasks";

const STORAGE_KEY = "dg_tasks_v1";
const LOG_KEY = "dg_completion_log_v1";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : sampleTasks;
    } catch {
      return sampleTasks;
    }
  });

  const [completionLog, setCompletionLog] = useState(() => {
    try {
      const saved = localStorage.getItem(LOG_KEY);
      return saved ? JSON.parse(saved) : sampleCompletionLog;
    } catch {
      return sampleCompletionLog;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(completionLog));
  }, [completionLog]);

  const addTask = useCallback((task) => {
    setTasks((prev) => [
      ...prev,
      { id: `t_${Date.now()}`, status: "todo", subtasks: [], ...task },
    ]);
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setSubtasks = useCallback((id, subtasks) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, subtasks } : t)));
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s,
        );
        return { ...t, subtasks };
      }),
    );
  }, []);

  const completeTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "done" } : t)),
    );
    setCompletionLog((prev) => [...prev, new Date().toISOString()]);
  }, []);

  const value = {
    tasks,
    completionLog,
    addTask,
    updateTask,
    deleteTask,
    setSubtasks,
    toggleSubtask,
    completeTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx)
    throw new Error("useTaskContext must be used within a TaskProvider");
  return ctx;
}
