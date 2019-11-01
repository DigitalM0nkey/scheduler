import { React, useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
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
    }
  }
  return [mode, transition, back];
}
