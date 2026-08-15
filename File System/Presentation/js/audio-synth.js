// Web Audio API Retro 8-bit Sound Synthesizer (Ultra Amplified & Enhanced)

class UndertaleAudioSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.muted = false;
    this.enabled = true;
    this.volume = 1.6; // Ultra-boosted master volume with compression headroom
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Studio-grade multi-stage dynamics compressor to maximize loudness without clipping
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-8, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(3, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.001, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

      // Create Master Gain node with high output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(3.0, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.muted;
  }

  // Retro Undertale text dialogue blip (Ultra Amplified)
  playTextBlip() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(180 + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch (e) {}
  }

  // Slide turn / Page change swoosh (Ultra Amplified Dual-Tone Swoosh + Noise Click)
  playSlideChange() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Primary punchy triangle sweep
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(840, now + 0.1);

      gain1.gain.setValueAtTime(0.95, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);

      osc1.start(now);
      osc1.stop(now + 0.14);

      // Square harmonic pop
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(640, now);
      osc2.frequency.exponentialRampToValueAtTime(1280, now + 0.07);

      gain2.gain.setValueAtTime(0.70, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc2.start(now);
      osc2.stop(now + 0.085);
    } catch (e) {}
  }

  // Menu Select / Heart Move (Ultra Amplified Crisp Chime)
  playMenuSelect() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.setValueAtTime(1160, now + 0.04);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.125);
    } catch (e) {}
  }

  // Undertale Battle Encounter Sound (Ultra Dramatic 3-Stage Alarm Crash)
  playBattleEncounter() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      for (let i = 0; i < 3; i++) {
        const hitTime = now + i * 0.075;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220 + i * 160, hitTime);
        osc.frequency.linearRampToValueAtTime(1100 + i * 300, hitTime + 0.07);

        gain.gain.setValueAtTime(1.0, hitTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.075);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(hitTime);
        osc.stop(hitTime + 0.08);
      }
    } catch (e) {}
  }

  // Determination / Save Point Fanfare (Ultra Amplified Resonant Crystal Arpeggio)
  playSavePoint() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.085;
        
        // Sine fundamental
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.90, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + 0.48);

        // Triangle octave harmonic
        const overtone = this.ctx.createOscillator();
        const overGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, noteTime);

        overGain.gain.setValueAtTime(0.55, noteTime);
        overGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        overtone.connect(overGain);
        overGain.connect(this.masterGain);

        overtone.start(noteTime);
        overtone.stop(noteTime + 0.38);
      });
    } catch (e) {}
  }

  // Particle Click Pop
  playClickPop() {
    if (this.muted || !this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }
}

window.undertaleAudio = new UndertaleAudioSynth();
