//general array that has a positive or negative value
let posOrNeg = [-1, 1];

//variables/arrays for home screen
let buttons = [];
let backButton = [];
let HOWTOPLAY = false;
let CONTROLS = false;

//variables and arrays for terrain generation
let terrainRight = [];
let terrainLeft = [];
let numLevels = 3;
let numTerrain = 40;
let quadWidth = 20;
let currentTerrainNum = 0;
let rightTemp = 0;
let leftTemp = 0;
let firstNewTerrain = true;
let lastMove = 0;
let x = 600;
let y = 550;
let lx = 200;
let ly = 550;
let move = 0;

//variables for the gradient background
let gradient = 0;
let gradientX = -800;
let gradientY = -800;
let currentNum = 0;

//variables/arrays for coins
let coins = [];
let coinAmount = 80;
let coinScore = 0;
let coinSound = 0;

//variables for movement/position
let xPositionPlayer = 0;
let xVelocityPlayer = 0;
let xAccelPlayer = 0;
let yPositionPlayer = 25;
let yVelocityPlayer = 0;
let yAccelPlayer = 0;
let subRotation = 1.57079632679; //pi/2

//hitbox radii
let hitBoxRadii = [25, 15, 20, 15, 20];

//variables for score and scoreboard
let score = 0;
let highScore = 0;
let scoreboardFont = 0;

//variables for fish
let numFishes = 25;
let fishColors = [
  [235, 138, 138], //red
  [235, 138, 214], //pink
  [147, 200, 219], //blue
  [214, 138, 75], //orange
  [188, 245, 208], //green
  [245, 224, 118], //yellow
];
let fish = [];
let initialFishGeneration = true;
let menuFish = [];

//variables/arrays for bubbles
let bubbles = [];
let bubbleNum = 0;
let mouseBubbles = [];
let mouseBubbleNum = 0;
let bubbleSound = 0;
let mouseBubblesOnScreen = false;
let gameOverSound = 0;
let backTrack = 0;
let buttonSound = 0;

//states
let INITIALGENERATION = true;
let PLAYING = 0;
let START = false;
let GAMEOVER = false;
let WIN = false;
let OUTOFBOUNDS = false;
let LAUNCHED = false;
let LEVEL = 0;
let tempVar = 0;

//DEBUG
let DEBUG = false;

//FOR CLEARING/SETTING LOCAL STORAGE (HIGHSCORE)
//localStorage.clear()
//localStorage.setItem("HIGHSCORE", -487)

function preload() {
  scoreboardFont = loadFont("Scoreboard.ttf");
  bubbleSound = loadSound("river-flow-underwater-ftus-1-01-00.mp3");
  coinSound = loadSound("scale-e6-14577_koMfJaU5.mp3");
  gameOverSound = loadSound("big-bubble-2-169074.mp3");
  backTrack = loadSound("underwater-ambiencewav-14428.mp3");
  buttonSound = loadSound("pop-made-by-duffybro-83905_vvID4vgB.mp3");
  
  
}




function setup() {
  //get the stored high score from local storage
  if ((localStorage.getItem("HIGHSCORE") != null) | undefined) {
    highScore = localStorage.getItem("HIGHSCORE");
  }
  backTrack.setVolume(0.33)
  backTrack.loop()
  createCanvas(800, 800);
  //loading assets
  
  textFont(scoreboardFont);
  makeButtons();
  generateTerrain(125);
  generateMenuFish(10);

  INITIALGENERATION = false;
  generateCoinPositions(coinAmount);
  generateFish();
 
}

function draw() {
if(!LAUNCHED){
  backTrackPlay();
}
  //if actually in the game
  if (START && !GAMEOVER) {

    //gradient at the top of the game screen (darkening as you go lower)
    background(5, 62, 115);
    makeGradient();
    drawBackgroundRectangle();

    //general kinematics
    gravity(0.0125);
    waterResistance(0.0005);
    arrowMovement(0.04, 0.04);
    updateHitboxes();
    
    //turn off collision if debug on
   if (!DEBUG) {
     terrainCollision();
    }
    
    kinematics();
    
    //draw everything
    drawFish();
    makeBubbles();
    updateBubbles();
    drawBubbles();
    drawCoins();
    drawTerrain();

    coinCollision();
    drawSubmarine(400, 200, 0.5, subRotation);
    fill(0, 0, 0, 100);
    scoreboard();
  } else {
    //if how to play button clicked, go to HOWTOPLAY screen
    if (HOWTOPLAY) {
      howToPlay();
    }
    //if controls button clicked, go to CONTROLS screen
    if (CONTROLS) {
      controls();
    }
    //if not in one of the other menus, go to main menu
    if (!HOWTOPLAY && !CONTROLS) {
      startGame();
    }
    //if gameover, go to gameover screen
    if (GAMEOVER) {
      gameOver();
    }
  }
}

//
function backTrackPlay() {
 
 // backTrack.loop()
 //backTrack.play();
  LAUNCHED = true;
}


function keyPressed() {
  //if in game
  if (START && !GAMEOVER) {
    //if up or w pressed
    if (keyCode === 87 || keyCode === 38) {
      bubbleSound.setVolume(0);
      bubbleSound.fade(1 / 5, 0.125);
      bubbleSound.play();
      bubbleSound.fade(1 / 3, 0.125);
    }
  }
}


function keyReleased() {
  if (START && !GAMEOVER) {
    if (keyCode === 87 || keyCode === 38) {
      //fade out bubble sound
      bubbleSound.fade(0, 1 / 3);
    }
  }
}

//HOWTOPLAY menu
function howToPlay() {
  background(5, 62, 115);
  makeGradient();
  drawBackgroundRectangle();
  drawMenuFish();
  drawMouseBubbles();
  drawBackButton();
  strokeWeight(2);
  textSize(55);
  textAlign(CENTER, CENTER);
  fill(0);
  stroke(0);
  text("DIVE AS DEEP AS YOU CAN", 400 + 5, 200 + 6);
  text("AVOIDING THE CAVES AND", 400 + 5, 275 + 6);
  text("COLLECTING COINS", 400 + 5, 350 + 6);
  text("ALONG THE WAY", 400 + 5, 425 + 6);
  text("THE DEEPER YOU GO,", 400 + 5, 575 + 6);
  text("THE HIGHER YOUR SCORE", 400 + 5, 650 + 6);

  fill(255);
  strokeWeight(2);
  stroke(255);
  textSize(55);
  textAlign(CENTER, CENTER);
  text("DIVE AS DEEP AS YOU CAN", 400, 200);
  text("AVOIDING THE CAVES AND", 400, 275);
  text("COLLECTING COINS", 400, 350);
  text("ALONG THE WAY", 400, 425);
  text("THE DEEPER YOU GO,", 400, 575);
  text("THE HIGHER YOUR SCORE", 400, 650);
}

//CONTROLS menu
function controls() {
  background(5, 62, 115);
  makeGradient();
  drawBackgroundRectangle();
  drawMenuFish();
  drawMouseBubbles();
  drawBackButton();
  strokeWeight(2);
  textSize(55);
  textAlign(CENTER, CENTER);
  fill(0);
  stroke(0);

  text("USE WASD OR ARROW KEYS", 400 + 5, 175 + 6);
  text("TO MOVE", 400 + 5, 250 + 6);
  text("HOLDING LEFT/A OR RIGHT/D", 400 + 5, 350 + 6);
  text("ROTATES THE SUB", 400 + 5, 425 + 6);
  text("HOLDING UP/W", 400 + 5, 525 + 6);
  text("PROPELLS THE SUB", 400 + 5, 600 + 6);
  text("IN THE DIRECTION IT'S FACING", 400 + 5, 675 + 6);

  fill(255);
  stroke(255);
  text("USE WASD OR ARROW KEYS", 400, 175);
  text("TO MOVE", 400, 250);
  text("HOLDING LEFT/A OR RIGHT/D", 400, 350);
  text("ROTATES THE SUB", 400, 425);
  text("HOLDING UP/W", 400, 525);
  text("PROPELLS THE SUB", 400, 600);
  text("IN THE DIRECTION IT'S FACING", 400, 675);
}

//draw the main menu
function startGame() {
  if (START == false) {
    background(5, 62, 115);
    makeGradient();
    drawBackgroundRectangle();
    drawMenuFish();
    drawMouseBubbles();

    drawButtons();
    drawTitle(400, 125);

  }
}

//generate fish objects for the menu screens
function generateMenuFish(amount) {
  for (i = 0; i < amount; i++) {
    menuFish.push(new MenuFish());
  }
}

//draw the menu fish
function drawMenuFish() {
  for (i = 0; i < menuFish.length; i++) {
    menuFish[i].update();
    menuFish[i].draw();
  }
}

//draw the title on the main menu screen
function drawTitle(x, y) {
  textAlign(CENTER, CENTER);

  textSize(120);
  strokeWeight(2);
  stroke(0);
  fill(0);
  text("SUBMARINE", x + 5, y + 6);
  text("MANEUVERS", x + 5, y + 115 + 6);
  stroke(255);
  fill(255);
  text("SUBMARINE", x, y);
  text("MANEUVERS", x, y + 115);
}

//make the button objects
function makeButtons() {
  buttons.push(new Button(400, 500, 400, 125, "S T A R T", 90, "START"));
  buttons.push(new Button(250, 675, 250, 75, "How to Play", 42, "HOWTOPLAY"));
  buttons.push(new Button(550, 675, 250, 75, "Controls", 42, "CONTROLS"));
  backButton.push(new Button(110, 82, 150, 75, "Back", 42, "BACK"));
}

//draw the buttons
function drawButtons() {
  for (i = 0; i < buttons.length; i++) {
    buttons[i].update();
    buttons[i].draw();
  }
}

//draw the back button
function drawBackButton() {
  backButton[0].update();
  backButton[0].draw();
}

//make mouse bubbles objects when the mouse is moved
function mouseMoved() {
  if (!START || GAMEOVER) {
    makeBubbles();
    mouseBubbles.push(new MouseBubble(mouseBubbleNum));
    mouseBubbleNum++;
  }
}

function drawMouseBubbles() {
  for (i = 0; i < mouseBubbleNum; i++) {
    mouseBubbles[i].update();
    mouseBubbles[i].draw();
  }
}

//draw GAMEOVER menu
function gameOver() {
  START = false;

  bubbleSound.fade(0, 1 / 3);
  updateBubbles();
  stroke(0);
  background(5, 62, 115);
  gradientY = -800;
  makeGradient();
  frameRate(35);

  
  drawBackgroundRectangle();
  drawMenuFish();
  drawMouseBubbles();
  stroke(0);
  strokeWeight(3);
  textSize(125);
  fill(0);
  textAlign(CENTER, BOTTOM);
  textStyle(BOLD);
  text("GAME OVER", width / 2 + 5, 250 + 6);
  stroke(255);
  fill(255);
  text("GAME OVER", width / 2, 250);

  textStyle(NORMAL);
  stroke(0);
  textSize(75);
  fill(0);
  text(
    "SCORE: " + String(Math.round(-score)).padStart(4, "O"),
    5 + width / 2,
    400 + 4
  );
  text(
    "HIGH SCORE: " + String(Math.round(-highScore)).padStart(4, "O"),
    5 + width / 2,
    500 + 4
  );
  textSize(75);
  stroke(255);
  fill(255);
  text("SCORE: " + String(Math.round(-score)).padStart(4, "O"), width / 2, 400);
  text(
    "HIGH SCORE: " + String(Math.round(-highScore)).padStart(4, "O"),
    width / 2,
    500
  );

  fill(0);
  stroke(0);
  textSize(75);
  text("Press R to Restart", width / 2 + 5, 675 + 4);
  stroke(255);
  fill(255);
  text("Press R to Restart", width / 2, 675);
  yPositionPlayer = 0;
  xPositionPlayer = 0
  //check if you got a high score
  if (score < highScore) {
    highScore = Math.round(score);
    highScore = int(highScore);
    if (!DEBUG) {
      //write high score to local storage
      localStorage.setItem("HIGHSCORE", highScore);
    }
  }

  //if r is pressed, restart the game
  if (keyIsDown(82)) {
    buttonSound.play()
    frameRate(60);
    
    
   
    
    //get rid of all objects
    fish = fish.filter((fish) => fish == 100000000);
    coins = coins.filter((coin) => coin == 100000000);
    terrainRight = terrainRight.filter((terrain) => terrain.y1 == 100000);
    terrainLeft = terrainLeft.filter((terrain) => terrain.y1 == 100000);
    
    //set variables to defaults
    firstNewTerrain = true;
    coinScore = 0;
    score = 0;
    subRotation = 1.57079632679; //pi/2
    x = 600;
    y = 550;
    lx = 200;
    ly = 550;
    move = 0;
    xVelocityPlayer = 0;
    yVelocityPlayer = 0;
    
    //recreate all of the objects and initial generation
    INITIALGENERATION = true;
    generateTerrain(numTerrain * numLevels + 5);
    initialFishGeneration = true;
    let fishAtTop = random(3, 7).toFixed();
    for (i = 0; i < fishAtTop; i++) {
      fish.push(new Fish());
    }
    initialFishGeneration = false;
    for (i = fishAtTop; i < numFishes + 1; i++) {
      fish.push(new Fish());
    }
    generateCoinPositions(coinAmount);
    INITIALGENERATION = false;
    
    //start the game again
    GAMEOVER = false;
    START = true;
  }
}


//draw the scoreboard
function scoreboard() {
  textAlign(LEFT, CENTER);
  strokeWeight(1);
  fill(0);
  stroke(0);
  text("SCORE: " + String(-score.toFixed()).padStart(4, "O"), 517 + 3, 25 + 4);
  fill(255);
  stroke(255);
  textSize(50);
  text("SCORE: " + String(-score.toFixed()).padStart(4, "O"), 517, 25);
  fill(0);
  stroke(0);
  text("COINS: " + String(coinScore).padStart(2, "O"), 589 + 3, 75 + 4);
  fill(255);
  stroke(255);
  text("COINS: " + String(coinScore).padStart(2, "O"), 589, 75);
  stroke(0);
  fill(0);
  text("HIGHSCORE: " + String(-highScore).padStart(4, "O"), 10 + 3, 25 + 4);
  fill(255);
  stroke(255);
  text("HIGHSCORE: " + String(-highScore).padStart(4, "O"), 10, 25);
}

//make bubbles objects when up/w pressed
function makeBubbles() {
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    bubbles.push(new Bubble(bubbleNum));
    bubbleNum++;
  }
}

function drawBubbles() {
  for (i = 0; i < bubbleNum; i++) {
    bubbles[i].draw();
  }
}

function updateBubbles() {
  for (i = 0; i < bubbleNum; i++) {
    bubbles[i].update();
  }
}

//generate in-game fish
function generateFish() {
  let fishAtTop = random(3, 7).toFixed();
  //draw the fish that are above the terrain at the beginning
  for (i = 0; i < fishAtTop; i++) {
    fish.push(new Fish());
  }
  initialFishGeneration = false;
  //draw the fish in the terrain
  for (i = fishAtTop; i < numFishes + 1; i++) {
    fish.push(new Fish());
    //console.log(fish[i].x)
    // console.log(fish[i].y)
  }
}

function drawFish() {
  //console.log(fish)
  for (i = 0; i < fish.length; i++) {
    fish[i].update();
    fish[i].draw();
  }
}




//update the hitboxes for the submarine
function updateHitboxes() {
  let hitboxOffsets = [
    { dx: 0, dy: 0, radius: hitBoxRadii[0] }, // Center
    { dx: -35, dy: 0, radius: hitBoxRadii[1] }, // Left back
    { dx: -25, dy: 0, radius: hitBoxRadii[2] }, // Left middle
    { dx: 35, dy: 0, radius: hitBoxRadii[3] }, // Right back
    { dx: 25, dy: 0, radius: hitBoxRadii[4] }, // Right middle
  ];

  hitBoxes = hitboxOffsets.map((offset) => {
    // Calculate the rotated offsets
    let rotatedX = offset.dx * cos(subRotation) - offset.dy * sin(subRotation);
    let rotatedY = offset.dx * sin(subRotation) + offset.dy * cos(subRotation);
    // Add the submarine's position to get the world position and include the radius
    return {
      x: 400 + rotatedX,
      y: 200 + rotatedY,
      radius: offset.radius,
    };
  });
}



function terrainCollision() {
  //collision if player goes too high
  if (terrainRight[0].y1 > height) {
    GAMEOVER = true;
     gameOverSound.setVolume(1);
  gameOverSound.play()
  }
  for (let i = 0; i < hitBoxes.length; i++) {
    let hitBox = hitBoxes[i];
    // Check against terrainRight
    for (let j = 0; j < terrainRight.length; j++) {
      if (
        hitBox.x > terrainRight[j].x1 &&
        hitBox.y + hitBox.radius > terrainRight[j].y1 - 0.5 &&
        hitBox.y + hitBox.radius < terrainRight[j].y1 + 0.5
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
      if (
        hitBox.x > terrainRight[j].x2 &&
        hitBox.y + hitBox.radius > terrainRight[j].y2 - 0.5 &&
        hitBox.y + hitBox.radius < terrainRight[j].y2 + 0.5
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
      if (
        dist(hitBox.x, hitBox.y, terrainRight[j].x1, terrainRight[j].y1) <
          hitBox.radius ||
        dist(hitBox.x, hitBox.y, terrainRight[j].x2, terrainRight[j].y2) <
          hitBox.radius
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
        return;
      }
      if (
        hitBox.x > terrainRight[0].x1 &&
        hitBox.y + hitBox.radius > terrainRight[0].y1 - 1 &&
        hitBox.y + hitBox.radius < terrainRight[0].y1 + 1
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
        return;
      }
      if (hitBox.x > terrainRight[0].x3 - 200) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
    }
    if (
      hitBox.x > terrainRight[0].x2 &&
      hitBox.y > terrainRight[0].y2 - 1 &&
      hitBox.y < terrainRight[0].y2 + 1
    ) {
      GAMEOVER = true;
       gameOverSound.setVolume(1);
  gameOverSound.play()
    }

    // Check against terrainLeft (similar to above)
    for (let j = 0; j < terrainLeft.length; j++) {
      if (
        hitBox.x < terrainLeft[j].x1 &&
        hitBox.y > terrainLeft[j].y1 - 0.5 &&
        hitBox.y < terrainLeft[j].y1 + 0.5
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
      if (
        hitBox.x < terrainLeft[j].x2 &&
        hitBox.y > terrainLeft[j].y2 - 0.5 &&
        hitBox.y < terrainLeft[j].y2 + 0.5
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
      if (
        dist(hitBox.x, hitBox.y, terrainLeft[j].x1, terrainLeft[j].y1) <
          hitBox.radius ||
        dist(hitBox.x, hitBox.y, terrainLeft[j].x2, terrainLeft[j].y2) <
          hitBox.radius
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
        return;
      }
      if (
        hitBox.x < terrainLeft[0].x1 &&
        hitBox.y > terrainLeft[0].y1 - 1 &&
        hitBox.y < terrainLeft[0].y1 + 1
      ) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
        return;
      }
      if (hitBox.x < terrainLeft[0].x3 + 200) {
        GAMEOVER = true;
         gameOverSound.setVolume(1);
  gameOverSound.play()
      }
    }
    if (
      hitBox.x < terrainLeft[0].x2 &&
      hitBox.y > terrainLeft[0].y2 - 1 &&
      hitBox.y < terrainLeft[0].y2 + 1
    ) {
      GAMEOVER = true;
       gameOverSound.setVolume(1);
  gameOverSound.play()
    }
  }
}

function generateTerrain(amount) {
  for (let i = 0; i < amount; i++) {
    rightTemp = random(550 + move - xPositionPlayer, 600 + move - xPositionPlayer);
    let quadRight = {
      x1: x,
      y1: y,
      x2: rightTemp,
      y2: y + quadWidth,
      x3: rightTemp + 1000,
      y3: y + quadWidth,
      x4: rightTemp + 1000,
      y4: y,
    };

    terrainRight.push(quadRight);
    x = quadRight.x2;

    if (INITIALGENERATION) {
      y += quadWidth;
    }
    leftTemp = quadRight.x2 - random(200, 300);
    let quadLeft = {
      x1: lx,
      y1: ly,
      x2: leftTemp,
      y2: ly + quadWidth,
      x3: leftTemp - 1000,
      y3: ly + quadWidth,
      x4: leftTemp - 1000,
      y4: ly,
    };

    terrainLeft.push(quadLeft);
    lx = quadLeft.x2;

    if (INITIALGENERATION) {
      ly += quadWidth;
    }
    
    if (Math.abs(lastMove) > 40) {
      lastMove = random(-40, 40);
    }else{lastMove = random(-50, 50);}
    //lastMove = random(-50,50)
    move += lastMove;
    currentTerrainNum++;
  }
 // console.log(lastMove);
}

function drawTerrain() {
  stroke(40);
  strokeWeight(1);
  fill(40);
  for (let i = 0; i < terrainRight.length; i++) {
    if (
      terrainRight[i].x1 ||
      (terrainRight[i].x2 > 0 && terrainRight[i].x1) ||
      terrainRight[i].x2 < width
    ) {
      if (terrainRight[i].y1 + quadWidth > 0 && terrainRight[i].y1 < height) {
        quad(
          terrainRight[i].x1,
          terrainRight[i].y1,
          terrainRight[i].x2,
          terrainRight[i].y2,
          terrainRight[i].x3,
          terrainRight[i].y3,
          terrainRight[i].x4,
          terrainRight[i].y4
        );
        fill(255);
        stroke(255);
       if (DEBUG) {
         text(i + currentNum, terrainRight[i].x1, terrainRight[i].y1);
         text(xPositionPlayer.toFixed(), 400, 300)
       }
      }
    }
    fill(40);
    stroke(40);

    if (i < terrainLeft.length) {
      if (
        terrainLeft[i].x1 ||
        (terrainLeft[i].x2 > 0 && terrainLeft[i].x1) ||
        terrainLeft[i].x2 < width
      ) {
        if (terrainLeft[i].y1 + quadWidth > 0 && terrainLeft[i].y1 < height) {
          quad(
            terrainLeft[i].x1,
            terrainLeft[i].y1,
            terrainLeft[i].x2,
            terrainLeft[i].y2,
            terrainLeft[i].x3,
            terrainLeft[i].y3,
            terrainLeft[i].x4,
            terrainLeft[i].y4
          );
        }
      }
    }

    //if the top terrain piece goes above the screen, delete it and generate a new one at the bottom
    if (i == 0 && terrainRight[i].y1 < -100) {
      
      x = terrainRight[terrainRight.length - 1].x2;
      y = terrainRight[terrainRight.length - 1].y2;
      lx = terrainLeft[terrainLeft.length - 1].x2;
      ly = terrainLeft[terrainLeft.length - 1].y2;

      generateTerrain(1);
      if (firstNewTerrain) {
        terrainRight[terrainRight.length - 1].x1 =
          terrainRight[terrainRight.length - 2].x2;
        terrainRight[terrainRight.length - 1].x2 =
          terrainRight[terrainRight.length - 2].x2;
        terrainLeft[terrainLeft.length - 1].x1 =
          terrainLeft[terrainLeft.length - 2].x2;
        terrainLeft[terrainLeft.length - 1].x2 =
          terrainLeft[terrainLeft.length - 2].x2;

      firstNewTerrain = false;
      }

      currentNum++;
      terrainRight = terrainRight.filter((terrain) => terrain.y1 > -100);
      terrainLeft = terrainLeft.filter((terrain) => terrain.y1 > -100);
    }

    if (i == 0 && fish[i].y < -100) {
      fish.push(new Fish());
      fish = fish.filter((fish) => fish.y > -100);
    }
  }
}

//draw submarine
function drawSubmarine(x, y, scaleSub, rotation) {
  push();
  stroke(0);
  translate(x, y);
  rotate(rotation);
  scale(scaleSub);
  strokeWeight(1.5);

  //rect(-30, -80, 50, 75);
  fill(130);
  ellipse(90, 0, 70, 20);
  ellipse(110, 0, 10, 30);
  fill(250, 203, 85);
  ellipse(0, 0, 200, 100);
  fill("black");
  circle(50, 0, 20);
  circle(0, 0, 20);
  circle(-50, 0, 20);
  pop();
}

function gravity(accel) {
  //increase downward acceleration by gravity parameter
  yVelocityPlayer += accel;
}

//restrict movement (give water resistance) for horizontal movement
function waterResistance(resistance) {
  if (xVelocityPlayer > 0) {
    xVelocityPlayer -= resistance;
  } else if (xVelocityPlayer < 0) {
    xVelocityPlayer += resistance;
  }
}

//have position, velocity, and acceleration function properly
function kinematics() {
  for (let i = 0; i < terrainRight.length; i++) {
    terrainRight[i].x1 -= xVelocityPlayer;
    terrainRight[i].x2 -= xVelocityPlayer;
    terrainRight[i].x3 -= xVelocityPlayer;
    terrainRight[i].x4 -= xVelocityPlayer;
    terrainRight[i].y1 -= yVelocityPlayer;
    terrainRight[i].y2 -= yVelocityPlayer;
    terrainRight[i].y3 -= yVelocityPlayer;
    terrainRight[i].y4 -= yVelocityPlayer;

    terrainLeft[i].x1 -= xVelocityPlayer;
    terrainLeft[i].x2 -= xVelocityPlayer;
    terrainLeft[i].x3 -= xVelocityPlayer;
    terrainLeft[i].x4 -= xVelocityPlayer;
    terrainLeft[i].y1 -= yVelocityPlayer;
    terrainLeft[i].y2 -= yVelocityPlayer;
    terrainLeft[i].y3 -= yVelocityPlayer;
    terrainLeft[i].y4 -= yVelocityPlayer;
  }
  gradientY -= yVelocityPlayer;

  for (let i = 0; i < coins.length; i++) {
    coins[i][0] -= xVelocityPlayer;
    coins[i][1] -= yVelocityPlayer;
  }
  yVelocityPlayer += yAccelPlayer;
  yPositionPlayer += yVelocityPlayer;

  xVelocityPlayer += xAccelPlayer;
  xPositionPlayer += xVelocityPlayer;
  score -= yVelocityPlayer / 50;
  if (score > 0) {
    score = 0;
  }
}

function arrowMovement(strengthRotate, strengthY) {
  if (keyIsDown(39) || keyIsDown(68)) {
    /*right arrow*/
    //accelerate player right
    subRotation += strengthRotate;
  }
  if (keyIsDown(37) || keyIsDown(65)) {
    /*left arrow*/
    //accelerate player left
    subRotation -= strengthRotate;
  }
  if (keyIsDown(38) || keyIsDown(87)) {
    /*up arrow*/
    //accelerate player up
    xVelocityPlayer += strengthY * cos(PI - subRotation);
    yVelocityPlayer -= strengthY * sin(PI - subRotation);
  }
}

function coinCollision() {
  for (let i = 0; i < hitBoxes.length; i++) {
    
    let hitBox = hitBoxes[i];
    // Check against coins
    for (let j = 0; j < coins.length; j++) {
      if (
        dist(hitBox.x, hitBox.y, coins[j][0], coins[j][1]) <
        hitBox.radius + 15
      ) {
        if (coinSound.isPlaying()) {
  coinSound.stop();
}
        coinSound.setVolume(0.75)
        coinSound.play();
        coinScore++;
        score = score - 10
        coins.splice(j, 1);
        
      }
    }
  }
}

function drawCoins() {
  for (let i = 0; i < coins.length; i++) {
    let coin_x = coins[i][0];
    let coin_y = coins[i][1];
    strokeWeight(1);
    stroke(0);
    fill(255, 225, 89);
    ellipse(coin_x, coin_y, 30, 30);
    ellipse(coin_x, coin_y, 20, 20);
    rect(coin_x - 2.5, coin_y - 2.5, 5, 5);
  }
}

function generateCoinPositions(num_coins) {
  for (let i = 0; i < num_coins; i++) {
    
    // Pick a random y-value on the screen.
    let y_value = random(800, 50000);
    var valid_right_x = 400;
    var valid_left_x = 400;

    // Find the quad on the right side even with the chosen y-value
    for (let i = 0; i < terrainRight.length; i++) {
      let quad = terrainRight[i];
      if (quad.y1 < y_value && quad.y2 > y_value) {
        valid_right_x = min(quad.x1, quad.x2, quad.x3, quad.x4);
        break;
      }
    }

    // Find the quad on the left side even with the chosen y-value
    for (let i = 0; i < terrainLeft.length; i++) {
      let quad = terrainLeft[i];
      if (quad.y1 < y_value && quad.y2 > y_value) {
        valid_left_x = max(quad.x1, quad.x2, quad.x3, quad.x4);
        break;
      }
    }

    let x_value = random(valid_left_x, valid_right_x);
    coins.push([x_value, y_value]);
  }
}

//make gradient for the background
function makeGradient() {
  gradient = drawingContext.createLinearGradient(
    gradientX + 800,
    gradientY,
    gradientX + 800,
    gradientY + 1600
  );

  gradient.addColorStop(0, color(94, 147, 196));
  gradient.addColorStop(1, color(5, 62, 115));
}

//rectangle that has the gradient
function drawBackgroundRectangle() {
  noStroke();
  fill(255);
  drawingContext.fillStyle = gradient;
  rect(gradientX, gradientY, 1600, 1600);
}

//DEPRECATED
/*function keyIsPressed() {
  if (keyCode == 38) {
    bubbleSound.play();
    console.log("playing");
  } else {
    bubbleSound.stop();
  }

  if (keyCode == 82) {
    if (GAMEOVER) {
      console.log("r");
      terrainRight = terrainRight.filter((terrain) => terrain.y1 == 100000);
      terrainLeft = terrainLeft.filter((terrain) => terrain.y1 == 100000);
      x = 600;
      y = 550;
      lx = 200;
      ly = 550;
      move = 0;
      xVelocityPlayer = 0;
      yVelocityPlayer = 0;
      INITIALGENERATION = true;
      generateTerrain(numTerrain * numLevels + 5);
      INITIALGENERATION = false;
      GAMEOVER = false;
      START = true;
    }
  }
}

*/
