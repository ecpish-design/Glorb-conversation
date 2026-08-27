# GLORB // Conversation Mission — Rebuild

A new, static GitHub Pages-ready rebuild of the Conversation Mission.

## What is included

- 35-screen learner journey based on the approved rebuild map
- Story → explicit teaching → whole rule → model → practise → explanatory feedback structure for START, JOIN and END
- START: GREET → OPEN → NOTICE
- JOIN: LISTEN → WAIT → CONNECT
- END: SIGNAL → FINISH PHRASE → EXIT
- Final integrated Conversation Mission
- Adult More Information panel with curriculum, evidence, disclaimers and references
- Read Aloud using the browser Speech Synthesis API
- Small typewriter-style on-screen text effect across lesson screens, with reduced-motion fallback
- Transcript/replay support for the JOIN timing activity
- Keyboard-accessible native controls and visible focus styles
- Reduced-motion support
- Non-drag END sequencing
- No localStorage, sessionStorage, account, database or analytics
- Certificate that records exactly what was practised, without claiming mastery

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Commit and push.
4. In GitHub: **Settings → Pages → Deploy from a branch**.
5. Choose `main` and `/ (root)`.

## Asset folders

- `assets/ui/` contains the clean filenames used by the rebuilt interface.
- `assets/source-library/` contains the supplied Conversation Mission image library copied into the project so the original visual material remains with the build.
- `assets/ASSET-INVENTORY.md` summarises the key UI and scenario assets used by the lesson.

## Important educational position

This is an explicit-teaching and structured-practice aid. It is not a real-life conversation, diagnostic assessment, validated measure of conversational competence, or replacement for responsive in-person teaching. Use alongside modelling, discussion, rehearsal, natural practice opportunities and observation where possible.
