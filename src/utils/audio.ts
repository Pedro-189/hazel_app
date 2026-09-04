// Web Audio API Synthesizer for cozy, comforting sounds

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public playPop() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio not permitted yet
    }
  }

  public playHeartCollect() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);

        gain.gain.setValueAtTime(0, now + index * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + 0.25);
      });
    } catch {
      // Audio not permitted yet
    }
  }

  public playHug() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(261.63, now); // C4
      osc1.frequency.exponentialRampToValueAtTime(329.63, now + 0.6); // E4

      osc2.frequency.setValueAtTime(392.00, now); // G4
      osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.6); // C5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch {
      // Audio not permitted yet
    }
  }

  public playKiss() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.07);
      osc.frequency.linearRampToValueAtTime(800, now + 0.14);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio not permitted
    }
  }

  public playReveal() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        [392, 523.25, 659.25], // G4, C5, E5
        [440, 587.33, 698.46], // A4, D5, F5
        [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      ];

      chords.forEach((chord, chordIdx) => {
        const chordTime = now + chordIdx * 0.14;
        chord.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, chordTime);

          gain.gain.setValueAtTime(0, chordTime);
          gain.gain.linearRampToValueAtTime(0.12, chordTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.4);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(chordTime);
          osc.stop(chordTime + 0.4);
        });
      });
    } catch {
      // Audio not permitted
    }
  }

  public playPlaceItem() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio not permitted
    }
  }
}

export const sound = new SoundEngine();
