
const _pfish = { items:[], spawnTimer: 0 };
function _spawnFish() {
  _pfish.items.push({
    x: width + 20,
    y: random(40, height-40),
    vx: -random(20, 60),
    r: random(6, 14),
    wiggle: random(TWO_PI),
    alpha: 120
  });
}
function passiveFishUpdate(dt, depth01=0) {
  _pfish.spawnTimer -= dt;
  const base = 2.5 + depth01*1.5;
  if (_pfish.spawnTimer <= 0) {
    _pfish.spawnTimer = random(1.2/base, 2.2/base);
    if (random() < 0.7) _spawnFish();
  }
  for (let f of _pfish.items) {
    f.x += f.vx * dt;
    f.y += sin((frameCount*0.05) + f.wiggle) * 6 * dt * 10;
  }
  _pfish.items = _pfish.items.filter(f => f.x > -40);
}
function passiveFishDraw() {
  noStroke();
  for (let f of _pfish.items) {
    fill(120, 190, 220, f.alpha);
    ellipse(f.x, f.y, f.r*2.2, f.r*1.2);
    triangle(f.x - f.r, f.y, f.x - f.r - f.r*0.7, f.y - f.r*0.4, f.x - f.r - f.r*0.7, f.y + f.r*0.4);
    fill(230, 255, 255, f.alpha);
    ellipse(f.x + f.r*0.3, f.y - f.r*0.2, f.r*0.25, f.r*0.25);
  }
}
