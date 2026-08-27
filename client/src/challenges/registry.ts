// Blackbox Operator style: each definition is a clean operations record, while the renderer behind it can be as ridiculous as needed.

import type { ChallengeDefinition, ChallengeId } from "@/types/game";

export const challengeRegistry: Record<ChallengeId, ChallengeDefinition> = {
  "find-human": { id: "find-human", title: "Find the Human", eyebrow: "VISUAL DISCRIMINATION", difficulty: "LOW", shortDescription: "One human signal. Eleven convincing decoys.", estimatedSeconds: 45 },
  "traffic-lights": { id: "traffic-lights", title: "Select All Traffic Lights", eyebrow: "OBJECT CLASSIFICATION", difficulty: "MED", shortDescription: "The street is watching. Select every compliant signal.", estimatedSeconds: 40 },
  "read-text": { id: "read-text", title: "Prove You Can Read", eyebrow: "OPTICAL RECOGNITION", difficulty: "MED", shortDescription: "Transcribe the characters. Please ignore your eyes.", estimatedSeconds: 35 },
  reaction: { id: "reaction", title: "Reaction Test", eyebrow: "REFLEX ANALYSIS", difficulty: "HIGH", shortDescription: "Click green. Not before. Not after. You know the drill.", estimatedSeconds: 25 },
  instructions: { id: "instructions", title: "Follow the Instructions", eyebrow: "LOGIC COMPLIANCE", difficulty: "HIGH", shortDescription: "The instruction is awkward on purpose.", estimatedSeconds: 50 },
  "impossible-checkbox": { id: "impossible-checkbox", title: "The Impossible Checkbox", eyebrow: "MOTOR CONTROL", difficulty: "HIGH", shortDescription: "The checkbox would like to discuss your cursor.", estimatedSeconds: 35 },
  "behavior-analysis": { id: "behavior-analysis", title: "Human Behavior Analysis", eyebrow: "BIOMETRIC INFERENCE", difficulty: "SEVERE", shortDescription: "We are measuring your hesitation in real time.", estimatedSeconds: 32 },
  "captcha-ception": { id: "captcha-ception", title: "CAPTCHAception", eyebrow: "RECURSIVE VERIFICATION", difficulty: "SEVERE", shortDescription: "A checkbox inside a checkbox inside a bad decision.", estimatedSeconds: 55 },
  "final-boss": { id: "final-boss", title: "Final Humanity Test", eyebrow: "ULTIMATE REVIEW", difficulty: "SEVERE", shortDescription: "One final piece of evidence. Allegedly.", estimatedSeconds: 25 },
};

export const getChallengeDefinition = (id: ChallengeId | null) => id ? challengeRegistry[id] : null;
