
# Submarine Maneuvers — v2 (Drop-in Folder)

This is a polished rewrite meant to live alongside your existing game. Add this `v2/` folder to the repo root, commit, and open:

https://<your-username>.github.io/Submarine-Maneuvers/v2/

It includes:
- Title screen, Settings, Pause, Game Over, and Credits screens
- Difficulty (Easy/Normal/Hard), SFX/Music toggles (saved to localStorage)
- High-score save, basic stats (runs, time played)
- Parallax water, bubbles, light shafts
- Enemies: Mines and Jellyfish
- Power-up: Shield (6s)
- Keyboard + Mouse + Touch controls
- Uses your existing audio files when present (gracefully skips if missing)

**To tweak:** open `Game.js` (spawning/difficulty), `Submarine.js` (feel), `Audio.js` (volume), `Parallax.js` (background).

If you later want this to be the default page, replace `/index.html` with `v2/index.html` and update script paths.
