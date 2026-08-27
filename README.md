# CAPTCHA From Hell

An absurdly annoying fictional CAPTCHA game where proving you are human becomes progressively more ridiculous. This is a local, client-only game experience built as a dark security-console simulation: it begins with a plausible verification gate and escalates into impossible bureaucracy, moving goalposts, reaction tests, and a final administrative punchline.

> Fictional simulation. No real security service is involved, no data is retained, and the interface does not verify identity.

## Features

CAPTCHA From Hell includes three selectable difficulty modes: **Normal**, **Annoying**, and **CAPTCHA From Hell**. Each mode changes the length of the challenge sequence and the degree of escalation.

The challenge engine currently supports visual human selection, traffic-light classification with a deliberate regeneration round, ambiguous text transcription, a reaction test, an instruction-following trap, and a moving checkbox final boss. Every challenge has success and failure feedback, confidence and suspicion telemetry, attempt accounting, an audit trail, and a replay path.

The interface is responsive, keyboard-aware, reduced-motion friendly, and designed as an asymmetric operator console rather than a generic centered landing page. Generated visual assets provide the console backdrop, scanline texture, diagnostic eye mark, and CAPTCHA tile illustrations.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 with a project-specific CSS design system |
| Interaction | React hooks, framework-agnostic TypeScript challenge engine |
| Icons | lucide-react |
| Runtime | Static frontend with the scaffold's Express production wrapper |
| Validation | TypeScript compiler and Vite production build |

## Installation

Clone the repository and install dependencies with pnpm:

```bash
git clone https://github.com/IrregDraken/captcha-from-hell.git
cd captcha-from-hell
pnpm install
```

Node.js 22 or newer and pnpm 10 are recommended. The repository is self-contained and does not require an API key, database, authentication provider, or external game service.

## Development command

Start the Vite development server:

```bash
pnpm dev
```

Open the local URL printed by Vite. The managed project preview may also expose the development server through its preview URL.

## Production build command

Run the type check and production bundle separately when validating a change:

```bash
pnpm check
pnpm build
```

The build emits the browser bundle under `dist/public` and the scaffold production wrapper at `dist/index.js`. `pnpm preview` can serve the Vite output for a local production-style check.

## Project architecture

The application is intentionally small. The game rules are separated from the React rendering layer so new challenges can be added without coupling them to page layout.

| Path | Responsibility |
| --- | --- |
| `client/src/engine/ChallengeEngine.ts` | State machine for mode selection, sequence progression, scoring, feedback, reset, and replay. |
| `client/src/types/game.ts` | Shared TypeScript contracts for snapshots, modes, challenge definitions, and challenge submissions. |
| `client/src/data/challengeData.ts` | Copy pools, visual glyph data, and deterministic data used by challenge stages. |
| `client/src/challenges/registry.ts` | Challenge metadata, difficulty, timing, and stage dispatch order. |
| `client/src/components/challenge/ChallengeStage.tsx` | Renderers for all supported CAPTCHA interactions. |
| `client/src/hooks/useChallengeGame.ts` | React adapter that subscribes to the engine and manages browser-only timers. |
| `client/src/components/CaptchaShell.tsx` | Console chrome, command bar, challenge bay, audit feed, and replay controls. |
| `client/src/components/TelemetryRail.tsx` | Live confidence, suspicion, attempts, and sequence progress display. |
| `client/src/pages/Home.tsx` | Landing mode selector, fake verification transition, active game, success report, and final joke. |
| `client/src/index.css` | Blackbox Operator visual language, responsive layout, states, textures, and motion rules. |

## Challenge system

A run is represented by an immutable `EngineSnapshot` exposed through a small listener-based `ChallengeEngine`. The engine owns the selected mode, deterministic challenge seed, current challenge index, active challenge identifier, score telemetry, attempts, audit message, and terminal screen.

`ChallengeStage` receives the current snapshot and a `record` callback. Each renderer owns only its local input state—selected tile IDs, text buffer, reaction phase, or checkbox position—and submits a typed result to the engine. The engine updates telemetry and either schedules the next stage or keeps the current challenge active with failure feedback. The traffic-light stage intentionally requires a second classification pass to make the fictional bureaucracy feel unfair while remaining solvable.

## How to add a new CAPTCHA challenge

1. Add a new `ChallengeId` literal and the corresponding `ChallengeDefinition` entry in `client/src/types/game.ts`.
2. Add any copy, visual data, or deterministic pools to `client/src/data/challengeData.ts`.
3. Add the challenge metadata to `client/src/challenges/registry.ts`, including label, title, difficulty, time limit, and the sequence position for each mode.
4. Add a renderer branch to `ChallengeStage.tsx`. Keep input state local to that renderer and call `record({ success, confidenceDelta, suspicionDelta, message })` when the user submits.
5. Add or update the relevant `ChallengeEngine` validation method if the challenge needs non-trivial scoring or state transitions.
6. Run `pnpm check`, `pnpm build`, and manually verify success, failure, reset, keyboard, and reduced-motion behavior in the browser.

Keep challenge logic deterministic when possible by deriving randomized data from `snapshot.challengeSeed`; this makes QA and replay behavior easier to reason about.

## Known limitations

The game is intentionally client-only and does not provide real CAPTCHA security, user accounts, server persistence, analytics, or multiplayer. The generated visual assets are referenced through the project-scoped asset storage URLs used by the managed preview environment; if the project is moved to an unrelated host, those URLs must be replaced with an equivalent asset hosting strategy.

The final boss is designed as a humorous interactive fiction sequence rather than a strict security test. Timer behavior depends on browser scheduling, and automated testing covers the deterministic engine and build but not every possible pointer timing permutation.

## License

This project is released under the MIT License. See [`LICENSE`](./LICENSE).
