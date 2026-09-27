# CAPTCHA From Hell

A fictional interactive CAPTCHA game where proving you're human becomes progressively more ridiculous.

The experience starts as a convincing verification gate and escalates through visual selection, classification, transcription, reaction tests, instruction traps, and a moving final boss. It is intentionally absurd, fully client-side, and designed as a polished browser game rather than a real security product.

## Features

- Three difficulty modes: Normal, Annoying, and CAPTCHA From Hell
- Deterministic challenge engine with replayable runs
- Multiple interactive challenge types
- Confidence, suspicion, attempts, and audit telemetry
- Success, failure, escalation, and final punchline states
- Keyboard-aware and reduced-motion-friendly interactions
- Responsive operator-console UI
- No account, API key, database, or external service required

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Framer Motion · Lucide

## Local development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm check
pnpm build
```

The production bundle is emitted to `dist/public`.

## Architecture

- `client/src/engine/ChallengeEngine.ts` handles game state and progression.
- `client/src/challenges/registry.ts` defines challenge sequences and difficulty.
- `client/src/components/challenge/ChallengeStage.tsx` renders challenge interactions.
- `client/src/components/CaptchaShell.tsx` owns the console chrome and telemetry.
- `client/src/pages/Home.tsx` controls the landing, verification, result, and replay flow.

## Deployment

The project is configured for static deployment on Vercel. No server-side runtime is required.

## Important

This is fictional entertainment. It does not perform real CAPTCHA verification, identity checks, security analysis, or data collection.

## License

MIT
