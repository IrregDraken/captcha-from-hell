# CAPTCHA From Hell — Structure

```text
client/src/
├── App.tsx                     # app shell and route entry
├── main.tsx                    # React bootstrap
├── index.css                   # Blackbox Operator design system
├── types/
│   └── game.ts                 # modes, challenge contracts, telemetry
├── data/
│   └── challengeData.ts        # copy pools, icon pools, procedural prompts
├── engine/
│   └── ChallengeEngine.ts      # challenge registry, sequence, scoring
├── challenges/
│   └── registry.ts             # challenge definitions and validators
├── hooks/
│   └── useChallengeGame.ts     # React adapter and timer lifecycle
├── components/
│   ├── CaptchaShell.tsx        # global console layout
│   ├── TelemetryRail.tsx       # live metrics and progress
│   ├── ChallengeStage.tsx       # dispatcher for current challenge UI
│   ├── challenge/              # individual challenge renderers
│   └── ui/                     # scaffold-provided primitives
└── pages/
    └── Home.tsx                # single-page game route
```

The engine owns game state transitions and has no React coupling. Challenge definitions expose stable metadata, a renderer key, an initial-state factory, and a validator. The React hook subscribes to engine snapshots and owns browser-only timer cleanup. Challenge components emit semantic actions back to the hook rather than mutating engine internals directly.

The visual layer is deliberately more opinionated than the scaffold: the shell is an asymmetric two-rail console on desktop and a stacked command strip on mobile. Shared colors and motion tokens live in `index.css`, while challenge components retain small local layout rules so each task can feel distinct without duplicating the game state model.
