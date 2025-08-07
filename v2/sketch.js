
let game, store, audioMgr;
let canvas;
let lastTime = 0;

function preload() {
  store = new SaveStore();
  audioMgr = new AudioManager(store);
  audioMgr.preload();

  // Optional: load scoreboard font if present; otherwise fallback
  window._scoreFont = null;
  try {
    window._scoreFont = loadFont("../Scoreboard.ttf");
  } catch (e) {}
}

function setup() {
  const scale = window.devicePixelRatio > 1 ? 0.75 : 1;
  const w = Math.min(900, Math.floor(window.innerWidth*0.98));
  const h = Math.min(600, Math.floor(window.innerHeight*0.78));
  canvas = createCanvas(w, h);
  canvas.parent("canvas-holder");
  frameRate(60);

  game = new Game(w, h, store, audioMgr);
  textFont(window._scoreFont || "monospace");
  lastTime = millis();
}

function windowResized() {
  const w = Math.min(900, Math.floor(window.innerWidth*0.98));
  const h = Math.min(600, Math.floor(window.innerHeight*0.78));
  resizeCanvas(w, h);
  game.w = w; game.h = h;
  game.parallax.resize(w, h);
}

function draw() {
  const now = millis();
  const dt = min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  // input: pause
  if (keyIsDown(27)) game.pause(); // ESC
  if (keyIsDown(80)) game.pause(); // P

  game.update(dt);
  game.draw(this.drawingContext);
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW || key === 'W') {
    if (game.state === "PLAY") { game.player.inputUp(); audioMgr.playSfx("bubble", 1.02); }
    else if (game.state === "MENU") { game.start(); }
    else if (game.state === "GAMEOVER") { game.start(); }
  }
  if (key === 'S') { game.goto("SETTINGS"); }
  if (key === 'M') { game.goto("MENU"); }
  if (key === 'C') { game.goto("CREDITS"); }
  if (key === 'P') { game.pause(); }
  if (key === 'R') { if (game.state === "PAUSE") game.resume(); }
}

function mousePressed() {
  game.handlePointerDown(mouseX, mouseY);
}

function touchStarted() {
  // For mobile, treat as a pointer press
  game.handlePointerDown(mouseX, mouseY);
  // prevent default to avoid iOS double-trigger
  return false;
}
