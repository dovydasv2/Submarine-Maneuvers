function MouseBubble(index) {
  this.index = index;
  this.speed = random(1,5);
  this.timer = 0;
  this.time = random(60,85)
  this.opacityLine = 125;
  this.opacityFill = 75;
  
  this.x = mouseX;
  this.y = mouseY;
  this.vx = this.speed*random(-0.3,0.3)
  this.vy = this.speed*random(-0.3,0.3)
  this.size = random(4, 15);

  this.update = function() {
    if(this.timer < this.time) {
    this.x += this.vx;
    this.y += this.vy;
    this.timer ++
    
    this.opacityLine -= this.opacityLine / this.time;
    this.opacityFill -= this.opacityFill / this.time;
    //this.size -= this.size/this.time
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