
/*
 * Shim.js — zero/one-line integration polish
 *
 * How it works:
 *  - Loads AFTER your original scripts.
 *  - Wraps p5's setup()/draw() to draw surface rays + passive fish (before your draw)
 *    and overlay cave texture + mines (after your draw).
 *  - Optional small rotational water drag if we detect a {sub} (see detectSub()).
 *  - Optional precise collisions if you expose cave polylines:
 *      window.__SM = { sub, caveTop, caveBot, onHit: () => {/* call your death/gameover *-/} }
 *    Paste that single line where you build those refs. If you don't, collisions stay unchanged.
 */

(function(){
  let origSetup = window.setup || function(){};
  let origDraw  = window.draw  || function(){};
  let _lastMs = 0;

  const cfg = {
    rotDrag: true,            // disable if you don't want rotational drag
    minesEnabled: true,       // set false to turn off mines
    textureEnabled: true,     // small rock striations speckles
    lightEnabled: true,       // surface + sunshafts
    fishEnabled: true
  };

  function dt() {
    const now = millis();
    const d = (_lastMs ? now - _lastMs : 16) / 1000;
    _lastMs = now;
    return Math.min(d, 0.05);
  }

  function detectSub() {
    // Heuristics: look for common globals
    const cands = ['sub','submarine','player','Sub','SUB'];
    for (let k of cands) {
      const o = window[k];
      if (o && typeof o === 'object' && 'x' in o && 'y' in o) return o;
    }
    return null;
  }

  function applyRotationalDrag(sub, dtSec) {
    if (!sub || !cfg.rotDrag) return;
    // If object seems to have angle + velocities
    const angle = sub.angle ?? sub.theta ?? null;
    if (angle == null) return;
    const vx = sub.vx ?? 0, vy = sub.vy ?? 0;
    const sp = Math.hypot(vx, vy);
    if (!('_angVel' in sub)) sub._angVel = 0;

    const ROT_DRAG = 3.0;
    sub._angVel -= sub._angVel * ROT_DRAG * dtSec;
    const fx = sp ? vx/sp : 1, fy = sp ? vy/sp : 0;
    const hx = Math.cos(sub.angle), hy = Math.sin(sub.angle);
    const cross = hx*fy - hy*fx;
    sub._angVel += cross * Math.min(0.8, sp * 0.002);
    sub.angle += sub._angVel;
  }

  window.setup = function(){
    const c = createCanvas(Math.min(900, Math.floor(window.innerWidth*0.98)),
                           Math.min(600, Math.floor(window.innerHeight*0.78)));
    const holder = document.getElementById('canvas-holder');
    if (holder) c.parent('canvas-holder');
    if (typeof origSetup === 'function') origSetup();
  };

  window.windowResized = function(){
    resizeCanvas(Math.min(900, Math.floor(window.innerWidth*0.98)),
                 Math.min(600, Math.floor(window.innerHeight*0.78)));
  };

  window.draw = function(){
    const dts = dt();
    const depth01 = constrain(frameCount/6000, 0, 1);
    if (cfg.lightEnabled) drawSurfaceAndLightRays(width, height, depth01, millis()/1000);
    if (cfg.fishEnabled) { passiveFishUpdate(dts, depth01); passiveFishDraw(); }

    // Call the user's draw (cave + sub + UI etc.)
    if (typeof origDraw === 'function') origDraw();

    // Optional water rotational drag (tries to find a 'sub' object)
    try { applyRotationalDrag(detectSub(), dts); } catch(e) {}

    // Cave texture overlay if user exposed cave points
    const sm = window.__SM || null;
    if (cfg.textureEnabled && sm && sm.caveTop && sm.caveBot) {
      drawCaveTexture(sm.caveTop, sm.caveBot, millis()/1000);
    }

    // Occasional mines + collision if we know sub
    if (cfg.minesEnabled) {
      minesUpdate(dts); minesDraw();
      if (sm && sm.sub && typeof sm.onHit === 'function') {
        if (minesCollide(sm.sub.x, sm.sub.y, sm.sub.radius || 12)) sm.onHit();
      }
    }

    // Precise wall collisions if points are exposed
    if (sm && sm.sub && sm.caveTop && sm.caveBot && typeof sm.onHit === 'function') {
      if (collideCaveCircle(sm.sub.x, sm.sub.y, sm.sub.radius || 12, sm.caveTop, sm.caveBot)) sm.onHit();
    }
  };
})(); 
