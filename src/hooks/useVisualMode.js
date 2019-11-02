import { useState } from "react";

export default function useVisualMode(initial) {
  const [visualMode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace) {
    if (replace) {
      setHistory(prev => prev.slice(0, -1));
    }
    setMode(newMode);
    setHistory(prev => [...prev, newMode]);
  }

  function back() {
    let historyMinusTwo = history.length - 2;
    if (historyMinusTwo >= 0) {
      setMode(history[historyMinusTwo]);
      let newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
    }
  }
  return { visualMode, transition, back };
}
