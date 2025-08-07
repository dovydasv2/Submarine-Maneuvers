
class ShieldPower extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.speed = speed * 0.9;
    this.r = 10;
  }
  update(dt) {
    this.x -= this.speed * dt;
    if (this.x < -20) this.dead = true;
  }
  draw() {
    push();
    translate(this.x, this.y);
    noFill();
    stroke(120, 220, 255);
    strokeWeight(2);
    ellipse(0, 0, this.r*2+6, this.r*2+6);
    noStroke();
    fill(200, 240, 255);
    ellipse(0, 0, this.r*2, this.r*2);
    pop();
  }
}
