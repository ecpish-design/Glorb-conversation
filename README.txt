GLORB // Conversation Mission — mobile responsive patch

WHAT TO UPLOAD
Replace ONLY the existing styles.css in your test branch with the styles.css in this folder.

You do NOT need to replace app.js.
You do NOT need to upload or rename any assets.

WHAT THIS PATCH CHANGES
- Desktop and iPad/tablet remain unchanged (mobile rules begin at 700px).
- Phone toolbar buttons become compact icon-only circles while accessible text remains available to screen readers.
- Landing content moves upward instead of sitting in the vertical centre of a tall phone screen.
- The title, signal bar, name field and button scale for narrow phones.
- The name input stays at 16px on phones to avoid iOS Safari input zoom.
- Glorb stays inside the frame, is larger and more visible, and is no longer pushed mostly off the right edge.
- Very narrow phones and landscape phones receive separate responsive layouts.

TEST
1. Upload styles.css to your test branch and commit.
2. Wait for GitHub Pages to redeploy.
3. Hard refresh on the phone / open a private tab if Safari is caching.
4. Check portrait and landscape.

No JavaScript or learning-flow logic is changed by this patch.
