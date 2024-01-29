function MenuFish() {
 
    this.x = random(0, width);
    this.y = random(0, height);
    this.rightBound = width;
    this.leftBound = 0;

  this.rightBound = width + 100;
  this.leftBound = 0-100
  this.initialDirection = posOrNeg[random(0, 1).toFixed()]
  this.vx = this.initialDirection * random(0.3,0.5)
  this.rotation = 0;
  this.scale = random(0.3,0.7);
  this.direction = 1
  this.color = [fishColors[random(0, fishColors.length - 1).toFixed()]]
  
  this.draw = function() {
    push();
    fill(this.color[0], this.color[1], this.color[2]);
  translate(this.x, this.y);
  strokeWeight(0);
  rotate(0)
  scale(this.scale * this.direction, this.scale);
  triangle(10, 0, 30, 10, 30, -10);
  ellipse(0, 0, 40, 20);
  fill("black");
  circle(-10, -4, 4);
  strokeWeight(2);
  line(-18, 1, -8, 1);
  pop();
  }
  
  this.update = function() {
  this.x += this.vx
  
  if(this.vx > 0) {
    this.direction = -1
  } else {this.direction = 1}
  if(this.x > this.rightBound || this.x < this.leftBound){
    this.vx = -this.vx
    
  }

    
  }
  
  
  
  
  
  
  
  
}