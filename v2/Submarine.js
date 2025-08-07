
class Submarine extends Entity {
  constructor(x, y) {
    super(x, y);
    this.vy = 0;
    this.radius = 16;
    this.angle = 0;
    this.shield = 0; // seconds remaining
    this.color = color(250, 230, 120);
    this.trail = [];
  }

  reset(x, y) {
    this.x = x; this.y = y;
    this.vy = 0; this.angle = 0; this.dead = false;
    this.shield = 0; this.trail = [];
  }

  giveShield(seconds=5) { this.shield = seconds; }

  inputUp() {
    this.vy -= 220; // impulse
  }

  update(dt, boundsH) {
    // Physics
    this.vy += 360 * dt; // gravity
    this.vy = constrain(this.vy, -320, 360);
    this.y += this.vy * dt;
    this.y = constrain(this.y, 20, boundsH-20);
    this.angle = lerp(this.angle, map(this.vy, -300, 300, -0.6, 0.8), 0.12);
    if (this.shield > 0) this.shield = max(0, this.shield - dt);

    // Trail particles
    this.trail.push({
      x: this.x - 20 + random(-1,1), y: this.y + random(-2,2),
      a: 160, r: random(2,4), vx: -random(40,80), vy: random(-12,12)
    });
    this.trail = this.trail.filter(p => (p.a -= 100*dt) > 5);
    for (let p of this.trail) { p.x += p.vx*dt; p.y += p.vy*dt; }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Body
    noStroke();
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, 48, 18, 9);
    // Nose
    triangle(24, -9, 24, 9, 36, 0);
    // Fins
    fill(250, 190, 90);
    triangle(-18, -9, -28, -20, -14, -8);
    triangle(-18, 9, -28, 20, -14, 8);
    // Window
    fill(200, 230, 255);
    ellipse(8, 0, 12, 12);

    // Shield indicator
    if (this.shield > 0) {
      noFill();
      stroke(120, 220, 255, 140);
      strokeWeight(2);
      ellipse(4, 0, 44, 44);
    }
    pop();

    // Trail
    noStroke();
    for (let p of this.trail) {
      fill(200, 240, 255, p.a);
      ellipse(p.x, p.y, p.r*2, p.r*2);
    }
  }
}
