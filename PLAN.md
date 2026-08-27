# CAPTCHA From Hell — Build Plan

## Product goal
Build a fictional, replayable CAPTCHA game that begins as a credible security verification screen and escalates into a sequence of absurd but solvable human-proof challenges.

## Risk slices

| Slice | Risk | Verification |
|---|---|---|
| Challenge registry and randomized state | Incorrect progression or stale state between challenge renders | Every registered challenge can render, validate, increment attempts, and advance through the engine |
| Timed reaction test | Timer lifecycle leaks and impossible timing | Reset clears timers; early/late/success states are reachable and solvable |
| Moving checkbox | Pointer interactions becoming impossible | Button moves only a few times, then stays put; keyboard activation remains available |
| Nested CAPTCHA | Layer state desynchronizes | Exactly five layers max; completion returns to the engine once |
| Responsive console shell | Two-rail desktop layout collapses poorly on small screens | 375px and 1280px layouts remain readable and usable |

## Definition of done
- The start screen launches a loading sequence then Challenge 1.
- Normal, Annoying, and CAPTCHA From Hell modes alter challenge count and behavior.
- Challenge engine supports randomized ordering and reusable registry entries.
- All eight requested challenge concepts plus a final boss are represented in the app.
- Success and failure paths visibly update telemetry and humor copy.
- Reset/replay works without stale timers or stale selection state.
- Type-check and production build pass.
- README documents setup, architecture, challenge creation, and limitations.
- Source is committed and pushed to the public GitHub repository.
