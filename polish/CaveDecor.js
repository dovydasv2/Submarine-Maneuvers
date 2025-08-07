
function drawCaveTexture(topPts, botPts, t) {
  if (!topPts || !botPts) return;
  stroke(30, 50, 70, 80);
  for (let pts of [topPts, botPts]) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i+1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = -dy/len, uy = dx/len;
      const mx = (a.x + b.x)/2, my = (a.y + b.y)/2;
      const n = 1 + Math.floor(len / 90);
      for (let k = 0; k < n; k++) {
        const s = (k+0.3)/(n+0.5);
        const px = a.x + dx*s, py = a.y + dy*s;
        const l = 4 + noise(px*0.01, py*0.01, t*0.2)*10;
        line(px, py, px + ux*l, py + uy*l);
      }
    }
  }
  noStroke(); fill(20, 40, 60, 80);
  for (let i = 0; i < 50; i++) rect(random(width), random(height), 1, 1);
}
