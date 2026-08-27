# CAPTCHA From Hell — Memory

- The app is a frontend-only WebDev static project and must remain self-contained in the browser.
- The requested experience is UI-heavy rather than canvas-heavy, so the challenge game uses React components and a plain TypeScript engine instead of a 3D scene.
- The chosen design direction is Blackbox Operator; see `ideas.md` for the full contract.
- Large media files must stay outside the project directory. If generated art is used, preserve originals under `/home/ubuntu/webdev-static-assets/` and reference uploaded storage paths.
- The GitHub CLI connection currently reports 401 Bad credentials even though the task shows GitHub selected. Repository creation is blocked until that session credential mismatch clears.
