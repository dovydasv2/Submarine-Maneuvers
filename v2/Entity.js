
class Entity {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.dead = false;
  }
  update(dt) {}
  draw() {}
  collides(other, r1, r2) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const rr = (r1 + r2);
    return dx*dx + dy*dy <= rr*rr;
  }
}
