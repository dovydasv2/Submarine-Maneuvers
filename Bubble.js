function Bubble(index) {
  this.index = index;
  this.speed = random(1,5);
  this.timer = 0;
  this.time = random(50,75)
  this.opacityLine = 125;
  this.opacityFill = 100;
  
  this.x = 400 + 65*cos(subRotation);
  this.y = 200 + 65*sin(subRotation);
  this.vx = this.speed*cos(subRotation + random(-0.5,0.5));
  this.vy = this.speed*sin(subRotation + random(-0.5,0.5));
  this.size = random(2, 10);

  this.update = function() {
    if(this.timer < this.time) {
    this.x += this.vx;
    this.y += this.vy;
    this.timer ++;
    this.opacityLine -= this.opacityLine / this.time;
    this.opacityFill -= this.opacityFill / this.time;
    }
  }
  
  this.draw = function() {
    if(this.timer < this.time) {
    strokeWeight(2)
    stroke(255,this.opacityLine); // No border for the bubble
    fill(255, this.opacityFill); // Semi-transparent white
    circle(this.x, this.y, this.size);
    }
  }
  

}