// Blackbox Operator style: this file names the gameplay telemetry contract so every challenge can feel like one security console.

export type DifficultyMode = "normal" | "annoying" | "hell";

export type ChallengeId =
  | "find-human"
  | "traffic-lights"
  | "read-text"
  | "reaction"
  | "instructions"
  | "impossible-checkbox"
  | "behavior-analysis"
  | "captcha-ception"
  | "final-boss";

export type GameScreen = "landing" | "transition" | "challenge" | "success" | "joke";

export type FeedbackTone = "neutral" | "success" | "error" | "warning";

export type ChallengeDifficulty = "LOW" | "MED" | "HIGH" | "SEVERE";

export interface ChallengeDefinition {
  id: ChallengeId;
  title: string;
  eyebrow: string;
  difficulty: ChallengeDifficulty;
  shortDescription: string;
  estimatedSeconds: number;
}

export interface EngineSnapshot {
  screen: GameScreen;
  mode: DifficultyMode;
  challengeOrder: ChallengeId[];
  challengeIndex: number;
  currentChallengeId: ChallengeId | null;
  challengeSeed: number;
  attempts: number;
  totalAttempts: number;
  completed: number;
  confidence: number;
  suspicion: number;
  status: string;
  feedback: string;
  feedbackTone: FeedbackTone;
  startedAt: number | null;
  finishedAt: number | null;
}

export interface EngineListener {
  (snapshot: EngineSnapshot): void;
}

export interface ChallengeAction {
  success: boolean;
  message: string;
  confidenceDelta?: number;
}
