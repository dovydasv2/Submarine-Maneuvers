
const _mines = { items:[], spawnTimer: 3.5 };
function _spawnMine() {
  _mines.items.push({
    x: width + 30, y: random(50, height-50),
    vx: -random(70, 120), r: 12 + random(-2, 4),
    phase: random(TWO_PI)
  });
}
function minesUpdate(dt) {
  _mines.spawnTimer -= dt;
  if (_mines.spawnTimer <= 0) {
    _mines.spawnTimer = random(4.5, 8.5);
    if (random() < 0.6) _spawnMine();
  }
  for (let m of _mines.items) {
    m.x += m.vx * dt;
    m.y += sin(frameCount*0.05 + m.phase) * 0.6;
  }
  _mines.items = _mines.items.filter(m => m.x > -40);
}
function minesDraw() {
  for (let m of _mines.items) {
    push(); translate(m.x, m.y);
    fill(200, 60, 60); stroke(100,20,20);
    ellipse(0, 0, m.r*2, m.r*2);
    for (let i=0;i<8;i++){ const a=i*TWO_PI/8; line(cos(a)*m.r, sin(a)*m.r, cos(a)*(m.r+6), sin(a)*(m.r+6)); }
    pop();
  }
}
function minesCollide(cx, cy, r) {
  for (let m of _mines.items) { const dx=cx-m.x, dy=cy-m.y, rr=r+m.r; if (dx*dx+dy*dy <= rr*rr) return true; }
  return false;
}
