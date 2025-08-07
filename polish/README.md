
# Polish Drop‑in (zero/one‑line edits)

This folder lets you preview polish (surface light, background fish, cave texture, optional mines, optional rotational drag) **without rewriting your game**.

## Use it like the v2 demo

1) Copy this entire **`polish/`** folder into your repo root (so you have `Submarine-Maneuvers/polish/`).  
2) Visit `https://<username>.github.io/Submarine-Maneuvers/polish/`

It loads your **existing** scripts from the parent folder and then layers the polish on top (via `Shim.js`).

## Optional: enable precise collisions + mine hits (one‑line hook)

If you want the add‑ons to use your cave geometry and actually cause hits, expose a small handle in your code, e.g. after you create these objects/arrays in `sketch.js`:

```js
// Example: adjust names to match your variables
window.__SM = {
  sub:       sub,            // your submarine/player object with x, y, angle, radius
  caveTop:   topPoints,      // array of {x,y} or [x,y] across the screen
  caveBot:   bottomPoints,
  onHit:     () => gameOver()  // your existing death/gameover function
};
```

If you don't add this, the polish still shows visuals; collisions stay exactly as your original game.

## Notes
- If your `index.html` loads game files in a different order than we guessed here, edit `polish/index.html` to mirror your order.
- Toggle features inside `polish/Shim.js` (e.g., disable mines or drag).
