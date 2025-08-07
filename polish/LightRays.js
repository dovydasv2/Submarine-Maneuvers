
function drawSurfaceAndLightRays(w, h, depth01, t) {
  // gradient
  const g1 = color(0, 80, 140);
  const g2 = color(0, 18, 34);
  for (let y = 0; y < h; y++) {
    const s = y / h;
    const c = lerpColor(g1, g2, Math.min(1, depth01*0.6 + s*0.5));
    stroke(c); line(0, y, w, y);
  }

  // surface shimmer when shallow
  if (depth01 < 0.25) {
    const y0 = 30 + 8 * sin(t*2.2);
    stroke(220, 240, 255, 160 - depth01*500);
    strokeWeight(3);
    for (let x = 0; x < w; x+=6) {
      const y = y0 + sin(x*0.03 + t*1.6) * 2;
      point(x, y);
    }
  }

  // shafts
  push(); blendMode(ADD);
  for (let i = 0; i < 5; i++) {
    const x = (i+1) * (w/6) + sin(t*0.5 + i)*w*0.05;
    const rw = w * 0.12;
    for (let y = 0; y < h; y+=4) {
      const f = y / h;
      const a = (1 - f) * (1 - depth01) * 40;
      fill(255, 255, 210, a); noStroke();
      rect(x - rw/2, y, rw, 4);
    }
  }
  pop();
}
