
/** Audio.js - basic audio manager using p5.sound */
class AudioManager {
  constructor(store) {
    this.store = store;
    this.sounds = {};
    this.music = null;
    this.loaded = false;
    this.musicGain = 0.35;
    this.sfxGain = 0.9;
  }

  preload() {
    try {
      // These names match files already present in your repo root (per README/file list).
      // If any are missing, the game will just skip them.
      this.sounds.pop = loadSound("../pop-made-by-duffybro-83905_vvID4vgB.mp3", () => {}, () => {});
      this.sounds.bubble = loadSound("../big-bubble-2-169074.mp3", () => {}, () => {});
      this.sounds.pickup = loadSound("../scale-e6-14577_koMfJaU5.mp3", () => {}, () => {});
      this.music = loadSound("../river-flow-underwater-ftus-1-01-00.mp3", () => {}, () => {});
      this.loaded = true;
    } catch (e) {
      console.warn("Audio preload failed:", e);
    }
  }

  playSfx(name, rate=1) {
    if (!this.loaded) return;
    if (!this.store.data.settings.sfx) return;
    const s = this.sounds[name];
    if (s && s.isLoaded()) {
      s.rate(rate);
      s.setVolume(this.sfxGain, 0.02);
      s.play();
    }
  }

  ensureMusic() {
    if (!this.loaded || !this.music) return;
    if (!this.store.data.settings.music) {
      if (this.music.isPlaying()) this.music.stop();
      return;
    }
    if (!this.music.isPlaying()) {
      this.music.setVolume(this.musicGain, 0.2);
      this.music.loop();
    }
  }
}
