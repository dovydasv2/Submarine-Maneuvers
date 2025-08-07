
/** Storage.js - lightweight wrapper around localStorage */
class SaveStore {
  constructor(keyPrefix = "subManeuvers_v2") {
    this.keyPrefix = keyPrefix;
    this.defaultData = {
      bestScore: 0,
      settings: {
        sfx: true,
        music: true,
        difficulty: "Normal"
      },
      stats: { runs: 0, totalSeconds: 0 }
    };
    this.data = this.load();
  }

  key(k) { return `${this.keyPrefix}:${k}`; }

  load() {
    try {
      const raw = localStorage.getItem(this.key("save"));
      if (!raw) return structuredClone(this.defaultData);
      const parsed = JSON.parse(raw);
      // Fill any missing keys (simple patching)
      const out = structuredClone(this.defaultData);
      Object.assign(out, parsed);
      if (parsed.settings) Object.assign(out.settings, parsed.settings);
      if (parsed.stats) Object.assign(out.stats, parsed.stats);
      return out;
    } catch(e) {
      console.warn("Save load failed, using defaults:", e);
      return structuredClone(this.defaultData);
    }
  }

  save() {
    try {
      localStorage.setItem(this.key("save"), JSON.stringify(this.data));
    } catch(e) {
      console.warn("Save failed:", e);
    }
  }

  setBest(score) {
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
      this.save();
      return true;
    }
    return false;
  }
}
