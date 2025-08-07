
/** Parallax.js - simple layered background water + bubbles */
class Parallax {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.bubbles = [];
    this.spawnTimer = 0;
  }

  resize(w, h) { this.w = w; this.h = h; }

  update(dt) {
    // Spawn bubbles
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = random(0.15, 0.35);
      this.bubbles.push({
        x: random(this.w),
        y: this.h + 10,
        r: random(2, 8),
        vy: random(20, 60),
        drift: random(-20, 20),
        alpha: random(80, 160)
      });
    }
    for (let b of this.bubbles) {
      b.y -= b.vy * dt;
      b.x += b.drift * dt*0.2;
      b.alpha -= 10 * dt;
    }
    this.bubbles = this.bubbles.filter(b => b.y + b.r > -8 && b.alpha > 15);
  }

  draw(ctx) {
    // Water gradient
    const g1 = color(0, 40, 80);
    const g2 = color(0, 16, 30);
    for (let y = 0; y < this.h; y++) {
      const t = y / this.h;
      const c = lerpColor(g1, g2, t);
      stroke(c);
      line(0, y, this.w, y);
    }

    noStroke();
    // Light rays
    push();
    blendMode(ADD);
    for (let i = 0; i < 5; i++) {
      const x = (i+1) * (this.w/6) + sin(frameCount * 0.005 + i) * (this.w*0.05);
      const w = this.w * 0.15;
      for (let y = 0; y < this.h; y+=4) {
        const alpha = map(y, 0, this.h, 40, 0);
        fill(255, 255, 200, alpha*0.25);
        rect(x - w/2, y, w, 4);
      }
    }
    pop();

    // Bubbles
    for (let b of this.bubbles) {
      fill(180, 220, 255, b.alpha);
      stroke(255, 255, 255, b.alpha+20);
      ellipse(b.x, b.y, b.r*2, b.r*2);
    }
  }
}
