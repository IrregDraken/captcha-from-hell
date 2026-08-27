// Blackbox Operator style: the engine is the control room; it owns the sequence, telemetry, and dry system verdicts without knowing anything about React.

import type { ChallengeId, DifficultyMode, EngineListener, EngineSnapshot, FeedbackTone } from "@/types/game";
import { failureMessages } from "@/data/challengeData";

const baseOrder: ChallengeId[] = [
  "find-human",
  "traffic-lights",
  "read-text",
  "reaction",
  "instructions",
  "impossible-checkbox",
  "behavior-analysis",
  "captcha-ception",
  "final-boss",
];

const modeCounts: Record<DifficultyMode, number> = { normal: 5, annoying: 7, hell: 9 };

function shuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let value = seed || 17;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((value / 233280) * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export class ChallengeEngine {
  private snapshot: EngineSnapshot;
  private listeners = new Set<EngineListener>();
  private seed = 1;
  private advanceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.snapshot = this.createInitialSnapshot("normal");
  }

  private createInitialSnapshot(mode: DifficultyMode): EngineSnapshot {
    return {
      screen: "landing",
      mode,
      challengeOrder: [],
      challengeIndex: -1,
      currentChallengeId: null,
      challengeSeed: 0,
      attempts: 0,
      totalAttempts: 0,
      completed: 0,
      confidence: 42,
      suspicion: 18,
      status: "Awaiting proof of humanity",
      feedback: "Verification required.",
      feedbackTone: "neutral",
      startedAt: null,
      finishedAt: null,
    };
  }

  getSnapshot(): EngineSnapshot {
    return this.snapshot;
  }

  subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  private emit(patch: Partial<EngineSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener(this.snapshot));
  }

  setMode(mode: DifficultyMode) {
    if (this.snapshot.screen !== "landing") return;
    this.emit({ mode, feedback: mode === "hell" ? "You selected this." : "Mode ready.", feedbackTone: "neutral" });
  }

  start() {
    const order = this.snapshot.mode === "normal"
      ? baseOrder.slice(0, modeCounts.normal - 1).concat("final-boss")
      : this.snapshot.mode === "annoying"
        ? baseOrder.slice(0, modeCounts.annoying - 1).concat("final-boss")
        : shuffle(baseOrder, Date.now() % 100000).slice(0, modeCounts.hell);
    this.seed += 1;
    this.emit({
      screen: "transition",
      challengeOrder: order,
      challengeIndex: -1,
      currentChallengeId: null,
      challengeSeed: this.seed,
      attempts: 0,
      totalAttempts: 0,
      completed: 0,
      confidence: this.snapshot.mode === "hell" ? 28 : this.snapshot.mode === "annoying" ? 35 : 42,
      suspicion: this.snapshot.mode === "hell" ? 31 : this.snapshot.mode === "annoying" ? 24 : 18,
      status: "Analyzing human behavior...",
      feedback: "Verification inconclusive.",
      feedbackTone: "warning",
      startedAt: Date.now(),
      finishedAt: null,
    });
  }

  launchNext() {
    const nextIndex = this.snapshot.challengeIndex + 1;
    const nextId = this.snapshot.challengeOrder[nextIndex];
    if (!nextId) {
      this.emit({ screen: "success", status: "Humanity confirmed.", feedback: "HUMAN VERIFIED ✓", feedbackTone: "success", finishedAt: Date.now() });
      return;
    }
    this.seed += 1;
    this.emit({
      screen: "challenge",
      challengeIndex: nextIndex,
      currentChallengeId: nextId,
      challengeSeed: this.seed,
      attempts: 0,
      status: "Challenge active",
      feedback: "Awaiting compliant input.",
      feedbackTone: "neutral",
    });
  }

  recordAttempt(success: boolean, message?: string, confidenceDelta = 0) {
    const nextAttempts = this.snapshot.attempts + 1;
    const totalAttempts = this.snapshot.totalAttempts + 1;
    const tone: FeedbackTone = success ? "success" : "error";
    const confidence = Math.max(3, Math.min(99, this.snapshot.confidence + confidenceDelta + (success ? 4 : -2)));
    const suspicion = Math.max(2, Math.min(98, this.snapshot.suspicion + (success ? -3 : 4)));
    this.emit({
      attempts: nextAttempts,
      totalAttempts,
      confidence,
      suspicion,
      feedback: message ?? (success ? "Acceptable human behavior detected." : failureMessages[(totalAttempts - 1) % failureMessages.length]),
      feedbackTone: tone,
      status: success ? "Evidence accepted" : "Evidence rejected",
      completed: success ? this.snapshot.completed + 1 : this.snapshot.completed,
    });
    if (success) {
      if (this.advanceTimer) clearTimeout(this.advanceTimer);
      this.advanceTimer = setTimeout(() => {
        this.advanceTimer = null;
        this.launchNext();
      }, 620);
    }
  }

  showJoke() {
    this.emit({ screen: "joke", status: "Access granted.", feedback: "Unfortunately, this proves very little.", feedbackTone: "warning" });
  }

  reset() {
    if (this.advanceTimer) clearTimeout(this.advanceTimer);
    this.advanceTimer = null;
    this.seed += 1;
    this.snapshot = this.createInitialSnapshot(this.snapshot.mode);
    this.snapshot.challengeSeed = this.seed;
    this.listeners.forEach((listener) => listener(this.snapshot));
  }
}
