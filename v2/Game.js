
const GAME_STATES = {
  BOOT: "BOOT",
  MENU: "MENU",
  PLAY: "PLAY",
  PAUSE: "PAUSE",
  GAMEOVER: "GAMEOVER",
  SETTINGS: "SETTINGS",
  CREDITS: "CREDITS"
};

class Game {
  constructor(w, h, store, audio) {
    this.w=w; this.h=h;
    this.store = store;
    this.audio = audio;

    this.state = GAME_STATES.BOOT;
    this.parallax = new Parallax(w, h);
    this.player = new Submarine(120, h/2);
    this.obstacles = [];
    this.jellies = [];
    this.powerups = [];

    this.spawnTimer = 0;
    this.powerTimer = 8;
    this.seconds = 0;
    this.distance = 0;
    this.speed = 140;
    this.difficulty = this.store.data.settings.difficulty || "Normal";
    this.ui = {
      buttons: [], toggles: []
    };
    this._buildMenus();
  }

  _buildMenus() {
    // Main menu buttons
    this.ui.menuButtons = [
      new UIButton(this.w/2-80, this.h*0.55, 160, 42, "Play", () => this.start()),
      new UIButton(this.w/2-80, this.h*0.55+52, 160, 42, "Settings", () => this.goto(GAME_STATES.SETTINGS)),
      new UIButton(this.w/2-80, this.h*0.55+104, 160, 42, "Credits", () => this.goto(GAME_STATES.CREDITS))
    ];

    // Settings toggles
    this.ui.toggles = [
      new Toggle(this.w/2-130, this.h*0.45, "Sound Effects", this.store.data.settings.sfx, (v)=>{ this.store.data.settings.sfx = v; this.store.save(); }),
      new Toggle(this.w/2-130, this.h*0.45+40, "Music", this.store.data.settings.music, (v)=>{ this.store.data.settings.music = v; this.store.save(); })
    ];

    this.ui.difficultyButtons = [
      new UIButton(this.w/2-140, this.h*0.45+90, 90, 36, "Easy", ()=>{ this.setDifficulty("Easy"); }),
      new UIButton(this.w/2-45, this.h*0.45+90, 90, 36, "Normal", ()=>{ this.setDifficulty("Normal"); }),
      new UIButton(this.w/2+50, this.h*0.45+90, 90, 36, "Hard", ()=>{ this.setDifficulty("Hard"); }),
    ];

    this.ui.backButton = new UIButton(20, 20, 90, 36, "Back", ()=> this.goto(GAME_STATES.MENU));
    this.ui.resumeButton = new UIButton(this.w/2-60, this.h*0.55, 120, 40, "Resume", ()=> this.resume());
    this.ui.retryButton = new UIButton(this.w/2-60, this.h*0.58, 120, 40, "Retry", ()=> this.start());
  }

  setDifficulty(d) {
    this.difficulty = d;
    this.store.data.settings.difficulty = d;
    this.store.save();
  }

  goto(s) { this.state = s; }
  start() {
    this.seconds = 0;
    this.distance = 0;
    this.speed = (this.difficulty==="Easy"? 120 : this.difficulty==="Hard"? 170 : 140);
    this.player.reset(120, this.h/2);
    this.obstacles.length = 0;
    this.jellies.length = 0;
    this.powerups.length = 0;
    this.spawnTimer = 0;
    this.powerTimer = 5;
    this.goto(GAME_STATES.PLAY);
  }
  pause() { if (this.state===GAME_STATES.PLAY) this.goto(GAME_STATES.PAUSE); }
  resume() { if (this.state===GAME_STATES.PAUSE) this.goto(GAME_STATES.PLAY); }

  update(dt) {
    this.parallax.update(dt);
    this.audio.ensureMusic();

    switch (this.state) {
      case GAME_STATES.BOOT:
        this.goto(GAME_STATES.MENU);
        break;
      case GAME_STATES.MENU:
        break;
      case GAME_STATES.PLAY:
        this.seconds += dt; this.distance += this.speed * dt;
        // Ramp difficulty with time
        this.speed += dt * (this.difficulty==="Hard"? 6 : this.difficulty==="Easy"? 2 : 4);

        // Player update
        this.player.update(dt, this.h);

        // Spawning
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
          this.spawnTimer = max(0.8 - this.seconds*0.02, 0.25);
          const y = random(30, this.h-30);
          if (random() < 0.6) this.obstacles.push(new Mine(this.w+30, y, this.speed));
          else this.jellies.push(new Jelly(this.w+40, y, this.speed));
        }
        this.powerTimer -= dt;
        if (this.powerTimer <= 0) {
          this.powerTimer = random(8, 15);
          this.powerups.push(new ShieldPower(this.w+20, random(30, this.h-30), this.speed*0.9));
        }

        // Update entities
        for (let arr of [this.obstacles, this.jellies, this.powerups]) {
          for (let e of arr) e.update(dt);
          for (let i=arr.length-1; i>=0; i--) if (arr[i].dead) arr.splice(i,1);
        }

        // Collisions
        const pr = this.player.radius;
        // Powerups
        for (let p of this.powerups) {
          if (this.player.collides(p, pr, p.r)) {
            p.dead = true;
            this.player.giveShield(6);
            this.audio.playSfx("pickup", 1.1);
          }
        }
        // Obstacles
        const lists = [...this.obstacles, ...this.jellies];
        for (let o of lists) {
          if (this.player.collides(o, pr, o.r)) {
            if (this.player.shield > 0) {
              // Consume shield & pop obstacle
              this.player.shield = 0;
              o.dead = true;
              this.audio.playSfx("bubble", 0.9);
            } else {
              this.gameOver();
              break;
            }
          }
        }
        break;
      case GAME_STATES.PAUSE:
        break;
      case GAME_STATES.GAMEOVER:
        break;
      case GAME_STATES.SETTINGS:
      case GAME_STATES.CREDITS:
        break;
    }
  }

  drawHud() {
    // Top HUD
    fill(255, 255, 255, 220);
    textAlign(LEFT, TOP);
    textSize(16);
    text(`Dist: ${Math.floor(this.distance/10)}m`, 16, 12);
    textAlign(RIGHT, TOP);
    text(`Best: ${Math.floor(this.store.data.bestScore/10)}m`, this.w-16, 12);

    // Shield bar
    if (this.player.shield > 0) {
      const w = map(this.player.shield, 0, 6, 0, 100);
      noStroke();
      fill(120, 220, 255, 180);
      rect(this.w-120, 34, w, 8, 6);
      noFill();
      stroke(200, 230, 255, 180);
      rect(this.w-120, 34, 100, 8, 6);
    }
  }

  draw(ctx) {
    this.parallax.draw(ctx);
    switch (this.state) {
      case GAME_STATES.MENU:
        this._drawTitle();
        break;
      case GAME_STATES.PLAY:
        this._drawPlay();
        break;
      case GAME_STATES.PAUSE:
        this._drawPlay();
        this._overlay("Paused");
        this.ui.resumeButton.draw();
        break;
      case GAME_STATES.GAMEOVER:
        this._drawPlay();
        this._overlay("Game Over");
        this.ui.retryButton.draw();
        break;
      case GAME_STATES.SETTINGS:
        this._drawSettings();
        break;
      case GAME_STATES.CREDITS:
        this._drawCredits();
        break;
    }
  }

  _drawTitle() {
    push();
    textAlign(CENTER, CENTER);
    fill(220);
    textSize(40);
    text("Submarine Maneuvers", this.w/2, this.h*0.3);
    textSize(18);
    fill(200);
    text("Endless runner — dodge mines & jellies, grab shields.\nSpace / Click / Tap to swim.", this.w/2, this.h*0.38);
    pop();

    for (let b of this.ui.menuButtons) b.draw();
    // Best score
    textAlign(CENTER, TOP); textSize(16); fill(200);
    text(`Best: ${Math.floor(this.store.data.bestScore/10)}m`, this.w/2, this.h*0.78);
  }

  _drawPlay() {
    // Draw entities
    this.player.draw();
    for (let e of this.powerups) e.draw();
    for (let e of this.obstacles) e.draw();
    for (let e of this.jellies) e.draw();
    // HUD
    this.drawHud();
  }

  _overlay(title) {
    push();
    noStroke();
    fill(0, 0, 0, 120);
    rect(0, 0, this.w, this.h);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(28);
    text(title, this.w/2, this.h*0.35);
    pop();
  }

  _drawSettings() {
    push();
    textAlign(CENTER, CENTER);
    textSize(26); fill(230);
    text("Settings", this.w/2, this.h*0.25);

    for (let t of this.ui.toggles) t.draw();
    textAlign(LEFT, CENTER); textSize(16); fill(220);
    text("Difficulty", this.w/2-130, this.h*0.45+90-18);
    for (let b of this.ui.difficultyButtons) {
      b.draw();
      if (b.label === this.difficulty) {
        noFill(); stroke(255); rect(b.x-2, b.y-2, b.w+4, b.h+4, 12);
      }
    }
    this.ui.backButton.draw();
    pop();
  }

  _drawCredits() {
    push();
    textAlign(CENTER, TOP);
    fill(230); textSize(26);
    text("Credits", this.w/2, this.h*0.22);
    textSize(16); fill(210);
    text("Original by Dovydas Vabalas\nv2 polish & menus by ChatGPT\np5.js + p5.sound\nAudio: see repo files", this.w/2, this.h*0.32);
    this.ui.backButton.draw();
    pop();
  }

  gameOver() {
    this.goto(GAME_STATES.GAMEOVER);
    const improved = this.store.setBest(this.distance);
    this.store.data.stats.runs += 1;
    this.store.data.stats.totalSeconds += this.seconds;
    this.store.save();
    this.audio.playSfx("pop", 0.8);
  }

  handlePointerDown(x, y) {
    switch (this.state) {
      case GAME_STATES.MENU: {
        for (let b of this.ui.menuButtons) if (b.contains(x,y)) return b.onClick();
        // click to start too
        if (y > this.h*0.2 && y < this.h*0.7) this.start();
        break;
      }
      case GAME_STATES.PLAY:
        this.player.inputUp(); this.audio.playSfx("bubble", 1.05);
        break;
      case GAME_STATES.PAUSE:
        if (this.ui.resumeButton.contains(x, y)) this.resume();
        break;
      case GAME_STATES.GAMEOVER:
        if (this.ui.retryButton.contains(x, y)) this.start();
        break;
      case GAME_STATES.SETTINGS:
        for (let t of this.ui.toggles) if (t.hit(x, y)) return;
        for (let b of this.ui.difficultyButtons) if (b.contains(x,y)) return b.onClick();
        if (this.ui.backButton.contains(x, y)) this.goto(GAME_STATES.MENU);
        break;
      case GAME_STATES.CREDITS:
        if (this.ui.backButton.contains(x, y)) this.goto(GAME_STATES.MENU);
        break;
    }
  }
}
