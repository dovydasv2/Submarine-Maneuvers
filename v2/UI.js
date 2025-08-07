
class UIButton {
  constructor(x, y, w, h, label, onClick) {
    this.x=x; this.y=y; this.w=w; this.h=h;
    this.label = label;
    this.onClick = onClick;
    this.enabled = true;
  }
  contains(px, py) { return px>=this.x && px<=this.x+this.w && py>=this.y && py<=this.y+this.h; }
  draw() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(70, 194, 240);
    if (!this.enabled) fill(120, 150, 170);
    rect(this.x, this.y, this.w, this.h, 10);
    fill(0, 19, 31);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.label, this.x+this.w/2, this.y+this.h/2);
    pop();
  }
}

class Toggle {
  constructor(x, y, label, initial, onChange) {
    this.x=x; this.y=y; this.label=label;
    this.value = initial; this.onChange = onChange;
  }
  draw() {
    push();
    textAlign(LEFT, CENTER);
    textSize(16); fill(220);
    text(this.label, this.x, this.y);
    const bx = this.x + 180, by = this.y-10, w=44, h=22;
    stroke(0,0); fill(this.value? color(70,194,240) : color(60));
    rect(bx, by, w, h, 999);
    fill(0); circle(bx + (this.value? (w-11) : 11), by+h/2, 18);
    pop();
  }
  toggle() { this.value = !this.value; this.onChange?.(this.value); }
  hit(px, py) {
    const bx = this.x + 180, by = this.y-10, w=44, h=22;
    if (px>=bx && px<=bx+w && py>=by && py<=by+h) { this.toggle(); return true; }
    return false;
  }
}
