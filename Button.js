function Button(x, y, wid, hei, buttonText, fontSize, valueToValidate) {
  this.x = x - wid/2;
  this.y = y - hei/2;
  this.xInput = x;
  this.yInput = y;
  this.wid = wid;
  this.hei = hei;
  this.buttonText = String(buttonText);
  this.fontSize = fontSize;
  this.hover = false;
  this.valueToValidate = valueToValidate;
  
  
  
  
  
  this.draw = function() {
  
    //point(this.x,this.y)
    //console.log(this.y + this.wid /2)
    //point(this.xInput, this.yInput)
  
    
    textAlign(CENTER, CENTER);
    textFont(scoreboardFont);
    strokeWeight(1)
    textSize(this.fontSize);
    stroke(0)
    fill(0)
    if(this.buttonText == "S T A R T"){text(this.buttonText, this.xInput +5, this.yInput +4 - 12);
    fill(255)
    stroke(255)
    text(this.buttonText, this.xInput, this.yInput - 12);}
    else {text(this.buttonText, this.xInput +5, this.yInput +4 - 9);
    fill(255)
    stroke(255)
    text(this.buttonText, this.xInput, this.yInput - 9);}
    
    stroke(255)
    strokeWeight(10)
    noFill();
    stroke(0)
    rect(this.x +3,this.y +4, this.wid, this.hei, 50)
     if(!this.hover){ noFill()
                  } else {fill(255, 255, 255, 50)}
    stroke(255)
    rect(this.x,this.y, this.wid, this.hei, 50)
    
    
  }
  this.update = function() {
  if(mouseX > this.x && mouseX < this.x + this.wid && mouseY < this.y + this.hei && mouseY > this.y) {
    this.hover = true;
    
  } else {this.hover = false;}
  
    if(this.hover && mouseIsPressed){
      if(!GAMEOVER){buttonSound.play()}
      
      if(this.valueToValidate == "START") {
        START = true;
      } 
      if(this.valueToValidate == "HOWTOPLAY"){
        HOWTOPLAY = true;
      }
      if(this.valueToValidate == "CONTROLS"){
        CONTROLS = true;
      }
      if(this.valueToValidate == "BACK"){
        HOWTOPLAY = false;
        CONTROLS = false;
      }
    }
  }

  
  
}