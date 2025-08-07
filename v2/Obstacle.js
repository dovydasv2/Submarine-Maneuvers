
class Mine extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.speed = speed;
    this.r = 14;
    this.phase = random(TWO_PI);
  }
  update(dt) {
    this.x -= this.speed * dt;
    // subtle bob
    this.y += sin((frameCount*0.05) + this.phase) * 0.8;
    if (this.x < -30) this.dead = true;
  }
  draw() {
    push();
    translate(this.x, this.y);
    fill(200, 60, 60);
    stroke(100, 20, 20);
    ellipse(0, 0, this.r*2, this.r*2);
    for (let i=0;i<8;i++){
      const a=i*TWO_PI/8;
      line(cos(a)*this.r, sin(a)*this.r, cos(a)*(this.r+6), sin(a)*(this.r+6));
    }
    pop();
  }
}

class Jelly extends Entity {
  constructor(x, y, speed) {
    super(x, y);
    this.speed = speed*0.8;
    this.r = 18;
    this.phase = random(TWO_PI);
  }
  update(dt) {
    this.x -= this.speed * dt;
    this.y += sin((frameCount*0.06) + this.phase) * 1.6;
    if (this.x < -40) this.dead = true;
  }
  draw() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(120, 200, 220, 200);
    arc(0, 0, 40, 28, PI, TWO_PI, CHORD);
    rect(-20, 0, 40, 10, 6);
    for (let i=-2;i<=2;i++) {
      rect(i*6, 8, 4, 12, 2);
    }
    pop();
  }
}
