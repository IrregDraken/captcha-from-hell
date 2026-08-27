// Blackbox Operator style: copy is clipped, official, and quietly judgmental; data stays deterministic enough to debug but varied enough to replay.

export const failureMessages = [
  "Incorrect. That was suspicious.",
  "A human probably would not click that.",
  "Your humanity remains unconfirmed.",
  "Nice try, robot.",
  "Behavioral anomaly detected.",
  "We have concerns.",
  "Please reconsider your life choices.",
];

export const trafficObjects = [
  { glyph: "◉", label: "traffic light", correct: true, tint: "red" },
  { glyph: "▣", label: "signal box", correct: true, tint: "blue" },
  { glyph: "◌", label: "lantern", correct: false, tint: "amber" },
  { glyph: "◫", label: "vending display", correct: false, tint: "green" },
  { glyph: "◈", label: "construction beacon", correct: false, tint: "coral" },
  { glyph: "◉", label: "traffic light", correct: true, tint: "green" },
  { glyph: "⊙", label: "street camera", correct: false, tint: "blue" },
  { glyph: "▥", label: "parking meter", correct: false, tint: "amber" },
  { glyph: "◍", label: "traffic light", correct: true, tint: "red" },
  { glyph: "□", label: "window signal", correct: false, tint: "blue" },
  { glyph: "△", label: "warning sign", correct: false, tint: "amber" },
  { glyph: "◉", label: "traffic light", correct: true, tint: "green" },
];

export const instructionPrompts = [
  "Click the blue square, but only after clicking the red circle.",
  "Select the triangle that is NOT touching another triangle.",
  "Click every object except the object that looks most clickable.",
];

export const instructionObjects = [
  { id: "red-circle", label: "red circle", shape: "circle", tint: "coral" },
  { id: "blue-square", label: "blue square", shape: "square", tint: "blue" },
  { id: "green-triangle", label: "green triangle", shape: "triangle", tint: "green" },
  { id: "amber-circle", label: "amber circle", shape: "circle", tint: "amber" },
  { id: "violet-square", label: "steel square", shape: "square", tint: "steel" },
];

export const nestedLabels = [
  "I'm not a robot",
  "I am definitely not a robot",
  "I promise I am human",
  "I am beginning to question this verification process",
  "Please let me leave",
];

export const terminalLines = [
  "Analyzing cursor movement...",
  "Analyzing hesitation...",
  "Analyzing clicking patterns...",
  "Analyzing human irrationality...",
  "Comparing against 8,492 robot profiles...",
];

export const humanGlyphs = ["◉", "◒", "◍", "◌", "●", "◐", "◓", "◉", "◒", "◍", "◐", "●"];

export const readCodes = ["H7x9Q2", "O0l1S5", "K4vR8N", "I1m5Z0", "Q8bB2D"];

export const finalAnswers = [
  { id: "A", label: "Say it is human" },
  { id: "B", label: "Solve the CAPTCHA" },
  { id: "C", label: "Refuse to answer" },
  { id: "D", label: "Become self-aware" },
];
