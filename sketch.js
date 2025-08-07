// === Submarine Maneuvers — sketch.js (polish inline) ===
// This is your file with small, targeted additions:
// - light rays/surface shimmer near start
// - passive background fish (behind the cave)
// - cave texture overlay
// - occasional mines (rare, easy to disable)
// - rotational water drag (gentle)
// - precise circle-vs-segment collision with cave walls
// You can tweak toggles near the top (POLISH_CONFIG).

// -------------------- POLISH TOGGLES --------------------
const POLISH_CONFIG = {
  lightEnabled: true,
  backgroundFish: true,
  caveTexture: true,
  minesEnabled: true,
  rotationalDrag: true
};

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
let subAngVel = 0;               // (polish) rotational inertia/drag

//hitbox radii
let hitBoxRadii = [25, 15, 20, 15, 20];
let hitBoxes = []; // (polish) ensure defined

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

// (polish) timing
let _lastMs = 0;
function dtSeconds() {
  const now = millis();
  const d = (_lastMs ? now - _lastMs : 16) / 1000;
  _lastMs = now;
  return Math.min(d, 0.05);
}

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
  const c = createCanvas(800, 800);
  const holder = document.getElementById('canvas-holder');
  if (holder) c.parent('canvas-holder');

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
  const dts = dtSeconds();
  if(!LAUNCHED){ backTrackPlay(); }

  //if actually in the game
  if (START && !GAMEOVER) {

    //gradient at the top of the game screen (darkening as you go lower)
    background(5, 62, 115);
    makeGradient();
    drawBackgroundRectangle();

    // (polish) surface shimmer + light shafts near the top
    if (POLISH_CONFIG.lightEnabled) {
      const depth01 = constrain((-score)/1000, 0, 1); // 0 at start, increases as you go deeper
      drawSurfaceAndLightRays(width, height, depth01, millis()/1000);
    }

    //general kinematics
    gravity(0.0125);
    waterResistance(0.0005);
    arrowMovement(0.04, 0.04);

    // (polish) rotational water drag tries to align sub with its motion
    if (POLISH_CONFIG.rotationalDrag) rotationalWaterDrag(dts);

    updateHitboxes();

    //turn off collision if debug on
    if (!DEBUG) {
      terrainCollision(); // (polish) now uses precise segment distance math
    }

    kinematics();

    //draw everything
    if (POLISH_CONFIG.backgroundFish) { passiveFishUpdate(dts); passiveFishDraw(); } // behind cave
    drawFish();
    makeBubbles();
    updateBubbles();
    drawBubbles();
    drawCoins();
    drawTerrain();

    // (polish) cave texture overlay (after cave draw)
    if (POLISH_CONFIG.caveTexture) {
      const polylines = buildCavePolylines();
      drawCaveTexture(polylines.rightPts, polylines.leftPts, millis()/1000);
    }

    // (polish) occasional mines inside the tunnel
    if (POLISH_CONFIG.minesEnabled) {
      minesUpdate(dts);
      minesDraw();
      // collide mines vs sub hitboxes
      for (let i=0; i<hitBoxes.length; i++) {
        if (minesCollide(hitBoxes[i].x, hitBoxes[i].y, hitBoxes[i].radius)) {
          GAMEOVER = true;
          gameOverSound.setVolume(1); gameOverSound.play();
          break;
        }
      }
    }

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
    subAngVel = 0;
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
  }
}

function drawFish() {
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

// (polish) precise collision vs cave walls using segment distance
function terrainCollision() {
  // early out: too high -> gameover
  if (terrainRight.length && terrainRight[0].y1 > height) {
    GAMEOVER = true;
    gameOverSound.setVolume(1); gameOverSound.play();
    return;
  }

  // Check all hit circles against the inner edges of both walls
  for (let i = 0; i < hitBoxes.length; i++) {
    const hb = hitBoxes[i];
    // right wall segments
    for (let j = 0; j < terrainRight.length; j++) {
      const q = terrainRight[j];
      if (circleIntersectsSegment(hb.x, hb.y, hb.radius, q.x1, q.y1, q.x2, q.y2)) {
        GAMEOVER = true;
        gameOverSound.setVolume(1); gameOverSound.play();
        return;
      }
    }
    // left wall segments
    for (let j = 0; j < terrainLeft.length; j++) {
      const q = terrainLeft[j];
      if (circleIntersectsSegment(hb.x, hb.y, hb.radius, q.x1, q.y1, q.x2, q.y2)) {
        GAMEOVER = true;
        gameOverSound.setVolume(1); gameOverSound.play();
        return;
      }
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
    } else {
      lastMove = random(-50, 50);
    }
    move += lastMove;
    currentTerrainNum++;
  }
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
    subRotation += strengthRotate;
  }
  if (keyIsDown(37) || keyIsDown(65)) {
    subRotation -= strengthRotate;
  }
  if (keyIsDown(38) || keyIsDown(87)) {
    xVelocityPlayer += strengthY * cos(PI - subRotation);
    yVelocityPlayer -= strengthY * sin(PI - subRotation);
  }
}

function coinCollision() {
  for (let i = 0; i < hitBoxes.length; i++) {
    let hitBox = hitBoxes[i];
    for (let j = 0; j < coins.length; j++) {
      if (dist(hitBox.x, hitBox.y, coins[j][0], coins[j][1]) < hitBox.radius + 15) {
        if (coinSound.isPlaying()) coinSound.stop();
        coinSound.setVolume(0.75);
        coinSound.play();
        coinScore++;
        score = score - 10;
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
    let y_value = random(800, 50000);
    var valid_right_x = 400;
    var valid_left_x = 400;

    for (let i = 0; i < terrainRight.length; i++) {
      let quad = terrainRight[i];
      if (quad.y1 < y_value && quad.y2 > y_value) {
        valid_right_x = min(quad.x1, quad.x2, quad.x3, quad.x4);
        break;
      }
    }

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

// -------------------- POLISH HELPERS (inline) --------------------

// rotational drag: sub tries to align with its velocity
function rotationalWaterDrag(dt) {
  // velocity of the sub (world scroll sign reversed is fine here)
  const vx = xVelocityPlayer, vy = yVelocityPlayer;
  const sp = Math.hypot(vx, vy);
  if (!sp) return;

  // facing vector (nose); thrust uses PI - subRotation; either orientation works for alignment
  const hx = Math.cos(subRotation), hy = Math.sin(subRotation);

  // signed cross tells which side flow is on
  const cross = hx*vy - hy*vx;
  // quadratic-ish drag
  const ROT_DRAG = 3.0;
  subAngVel -= subAngVel * ROT_DRAG * dt;
  subAngVel += cross * Math.min(0.8, sp * 0.002);
  subRotation += subAngVel;
}

// closest point on segment and circle/segment test
function closestPointOnSegment(ax, ay, bx, by, px, py) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const ab2 = abx*abx + aby*aby;
  let t = (ab2 === 0) ? 0 : (apx*abx + apy*aby) / ab2;
  t = Math.max(0, Math.min(1, t));
  return { x: ax + abx * t, y: ay + aby * t };
}
function circleIntersectsSegment(cx, cy, r, ax, ay, bx, by) {
  const q = closestPointOnSegment(ax, ay, bx, by, cx, cy);
  const dx = cx - q.x, dy = cy - q.y;
  return (dx*dx + dy*dy) <= r*r;
}

// Build inner-edge polylines for texture overlay
function buildCavePolylines() {
  const rightPts = [];
  const leftPts = [];
  for (let i=0;i<terrainRight.length;i++) {
    rightPts.push({x: terrainRight[i].x1, y: terrainRight[i].y1});
    rightPts.push({x: terrainRight[i].x2, y: terrainRight[i].y2});
  }
  for (let i=0;i<terrainLeft.length;i++) {
    leftPts.push({x: terrainLeft[i].x1, y: terrainLeft[i].y1});
    leftPts.push({x: terrainLeft[i].x2, y: terrainLeft[i].y2});
  }
  return { rightPts, leftPts };
}

// Light rays + surface shimmer
function drawSurfaceAndLightRays(w, h, depth01, t) {
  // light shafts
  push();
  blendMode(ADD);
  noStroke();
  for (let i = 0; i < 5; i++) {
    const x = (i+1) * (w/6) + sin(t*0.5 + i)*w*0.05;
    const rw = w * 0.12;
    for (let y = 0; y < h; y+=4) {
      const f = y / h;
      const a = (1 - f) * (1 - depth01) * 40;
      if (a > 0.5) { fill(255, 255, 210, a); rect(x - rw/2, y, rw, 4); }
    }
  }
  pop();

  // surface shimmer when shallow
  if (depth01 < 0.25) {
    const y0 = 30 + 8 * sin(t*2.2);
    stroke(220, 240, 255, 160 - depth01*500);
    strokeWeight(3);
    for (let x = 0; x < w; x+=6) {
      const y = y0 + sin(x*0.03 + t*1.6) * 2;
      point(x, y);
    }
  }
}

// Cave texture
function drawCaveTexture(topPts, botPts, t) {
  stroke(30, 50, 70, 80);
  for (let pts of [topPts, botPts]) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i+1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = -dy/len, uy = dx/len;
      const n = 1 + Math.floor(len / 90);
      for (let k = 0; k < n; k++) {
        const s = (k+0.3)/(n+0.5);
        const px = a.x + dx*s, py = a.y + dy*s;
        const l = 4 + noise(px*0.01, py*0.01, t*0.2)*10;
        line(px, py, px + ux*l, py + uy*l);
      }
    }
  }
  noStroke(); fill(20, 40, 60, 80);
  for (let i = 0; i < 50; i++) rect(random(width), random(height), 1, 1);
}

// Passive background fish (behind cave)
const _pfish = { items:[], spawnTimer: 0 };
function _spawnFish() {
  _pfish.items.push({
    x: width + 20,
    y: random(40, height-40),
    vx: -random(20, 60),
    r: random(6, 14),
    w: random(TWO_PI),
    a: 120
  });
}
function passiveFishUpdate(dt) {
  _pfish.spawnTimer -= dt;
  if (_pfish.spawnTimer <= 0) {
    _pfish.spawnTimer = random(0.9, 1.8);
    if (random() < 0.7) _spawnFish();
  }
  for (let f of _pfish.items) {
    f.x += f.vx * dt;
    f.y += sin((frameCount*0.05) + f.w) * 6 * dt * 10;
  }
  _pfish.items = _pfish.items.filter(f => f.x > -40);
}
function passiveFishDraw() {
  noStroke();
  for (let f of _pfish.items) {
    fill(120, 190, 220, f.a);
    ellipse(f.x, f.y, f.r*2.2, f.r*1.2);
    triangle(f.x - f.r, f.y, f.x - f.r - f.r*0.7, f.y - f.r*0.4, f.x - f.r - f.r*0.7, f.y + f.r*0.4);
    fill(230, 255, 255, f.a);
    ellipse(f.x + f.r*0.3, f.y - f.r*0.2, f.r*0.25, f.r*0.25);
  }
}

// Rare mines
const _mines = { items:[], spawnTimer: 3.5 };
function _spawnMine() {
  _mines.items.push({
    x: width + 30, y: random(60, height-60),
    vx: -random(70, 120), r: 12 + random(-2, 4),
    phase: random(TWO_PI)
  });
}
function minesUpdate(dt) {
  _mines.spawnTimer -= dt;
  if (_mines.spawnTimer <= 0) {
    _mines.spawnTimer = random(4.5, 8.5);
    if (random() < 0.6) _spawnMine();
  }
  for (let m of _mines.items) {
    m.x += m.vx * dt;
    m.y += sin(frameCount*0.05 + m.phase) * 0.6;
  }
  _mines.items = _mines.items.filter(m => m.x > -40);
}
function minesDraw() {
  for (let m of _mines.items) {
    push(); translate(m.x, m.y);
    fill(200, 60, 60); stroke(100,20,20);
    ellipse(0, 0, m.r*2, m.r*2);
    for (let i=0;i<8;i++){ const a=i*TWO_PI/8; line(cos(a)*m.r, sin(a)*m.r, cos(a)*(m.r+6), sin(a)*(m.r+6)); }
    pop();
  }
}
function minesCollide(cx, cy, r) {
  for (let m of _mines.items) { const dx=cx-m.x, dy=cy-m.y, rr=r+m.r; if (dx*dx+dy*dy <= rr*rr) return true; }
  return false;
}

//DEPRECATED
/*function keyIsPressed() {
  if (keyCode == 38) {
    bubbleSound.play();
  } else {
    bubbleSound.stop();
  }
  if (keyCode == 82) { ... }
}*/
