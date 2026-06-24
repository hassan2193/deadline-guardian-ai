// src/hooks/useSchedule.js
import { useState, useCallback } from "react";
import { generateDailySchedule } from "../services/schedulingService";

export function useSchedule(tasks) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateDailySchedule(tasks);
      setBlocks(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  return { blocks, loading, error, generate };
}
