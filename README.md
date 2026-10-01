# Dlicom Game Hub
Static site, all files in one folder — no build step. Open `index.html` in a browser (or upload the folder to Netlify / Vercel / GitHub Pages).
- `games.js` — game list (title, url, creator's X handle). Add a game by adding one line; the site sorts A–Z.
- `music.js` — procedural chill background music (Web Audio, no audio file).
- `app.js` — search, bookmarks (localStorage), comments, mascot wave every 10 s.
- `style.css` — theme colours are CSS variables at the top (`--p`, `--c`).
- logo.jpg, mascot-*.webp — logo and mascots. The waving mascot is the pink one recoloured to blue with a CSS hue-rotate filter; replace `mascot-wave.webp` with a true blue waving image any time.
Comments are stored in the visitor's browser. For site-wide comments, connect a backend (Supabase / Firebase) in `openC` and the post handler in `app.js`.
