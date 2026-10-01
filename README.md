# Dlicom Game Hub
Static site, all files in one folder — no build step. Open `index.html` in a browser (or upload the folder to Netlify / Vercel / GitHub Pages).
- `games.js` — game list (title, url, creator's X handle). Add a game by adding one line; the site sorts A–Z.
- `music.js` — procedural chill background music (Web Audio, no audio file).
- `app.js` — search, bookmarks (localStorage), comments, mascot wave every 10 s.
- `style.css` — theme colours are CSS variables at the top (`--p`, `--c`).
- logo.jpg, mascot-*.webp — logo and mascots. The waving mascot is the pink one recoloured to blue with a CSS hue-rotate filter; replace `mascot-wave.webp` with a true blue waving image any time.
Comments are stored in the visitor's browser. For site-wide comments, connect a backend (Supabase / Firebase) in `openC` and the post handler in `app.js`.

## Voting (everyone can vote)
Files: `votes.js` (logic) + `config.js` (your database keys). Works in 3 modes automatically: Supabase (public, everyone) > Claude viewers > this device only.
### Free public database in ~5 minutes (Supabase)
1. Create a free project at supabase.com. 2. SQL Editor -> run:
```sql
create table votes(game_id text, voter text, primary key(game_id,voter));
alter table votes enable row level security;
create policy "read" on votes for select using (true);
create policy "add"  on votes for insert with check (true);
create policy "del"  on votes for delete using (true);
```
3. Settings -> API: copy the Project URL and the `anon` public key into `config.js`. Deploy the folder — done.
Each visitor gets a random anonymous ID (max 5 votes each). For stricter one-person-one-vote, add Supabase Auth (Google/X login) and use the user id as `voter`.
