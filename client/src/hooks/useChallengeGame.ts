// Blackbox Operator style: this hook is the thin console cable between the pure engine and the browser UI, including timer cleanup and replay-safe state.

import { useCallback, useEffect, useRef, useState } from "react";
import { ChallengeEngine } from "@/engine/ChallengeEngine";
import type { ChallengeAction, DifficultyMode } from "@/types/game";

export function useChallengeGame() {
  const engineRef = useRef<ChallengeEngine | null>(null);
  if (!engineRef.current) engineRef.current = new ChallengeEngine();
  const engine = engineRef.current;
  const [snapshot, setSnapshot] = useState(engine.getSnapshot());

  useEffect(() => engine.subscribe(setSnapshot), [engine]);

  const setMode = useCallback((mode: DifficultyMode) => engine.setMode(mode), [engine]);
  const start = useCallback(() => engine.start(), [engine]);
  const launchNext = useCallback(() => engine.launchNext(), [engine]);
  const record = useCallback((action: ChallengeAction) => engine.recordAttempt(action.success, action.message, action.confidenceDelta), [engine]);
  const showJoke = useCallback(() => engine.showJoke(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);

  return { snapshot, setMode, start, launchNext, record, showJoke, reset };
}
