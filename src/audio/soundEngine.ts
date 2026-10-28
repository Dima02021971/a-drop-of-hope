// Web Audio API Synthesizer for A Drop of Hope
// Completely self-contained, zero external asset dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
    const savedMute = typeof localStorage !== 'undefined' ? localStorage.getItem('drop_of_hope_muted') : null;
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('drop_of_hope_muted', String(this.isMuted));
    }
    if (this.isMuted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!this.isMuted && this.ambientGain && this.ctx && this.isAmbientPlaying) {
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public playButtonClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWaterCollect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.12);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });
  }

  public playWaterDeliver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Trickling water sound using frequency modulated noise & sine
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playFlowerBloom() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Magical twinkling arpeggio (C major pentatonic sparkle)
    const freqs = [587.33, 659.25, 880, 1174.66, 1318.51, 1760];

    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playPumpStroke() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Mechanical clunk / squeak
    const squeak = this.ctx.createOscillator();
    const squeakGain = this.ctx.createGain();
    squeak.type = 'sawtooth';
    squeak.frequency.setValueAtTime(320, now);
    squeak.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    squeakGain.gain.setValueAtTime(0.06, now);
    squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    squeak.connect(squeakGain);
    squeakGain.connect(this.ctx.destination);
    squeak.start(now);
    squeak.stop(now + 0.13);

    // 2. Water rush gush
    const gush = this.ctx.createOscillator();
    const gushGain = this.ctx.createGain();
    gush.type = 'triangle';
    gush.frequency.setValueAtTime(240, now + 0.08);
    gush.frequency.exponentialRampToValueAtTime(480, now + 0.25);

    gushGain.gain.setValueAtTime(0.1, now + 0.08);
    gushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    gush.connect(gushGain);
    gushGain.connect(this.ctx.destination);
    gush.start(now + 0.08);
    gush.stop(now + 0.26);
  }

  public playTriviaSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C major triumph

    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playTriviaIncorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(240, now + 0.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.5, d: 0.35, t: 0.36 },
      { f: 880.0, d: 0.14, t: 0.72 },
      { f: 1046.5, d: 0.6, t: 0.88 },
    ];

    melody.forEach(({ f, d, t }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + d + 0.05);
    });
  }

  public playWaterPickup() {
    this.playWaterCollect();
  }

  public playLevelComplete() {
    this.playVictoryFanfare();
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4 descending mournful
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + i * 0.14;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, st);
      osc.frequency.linearRampToValueAtTime(f * 0.95, st + 0.22);

      gain.gain.setValueAtTime(0.1, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + 0.24);
    });
  }

  public startRiverAmbience() {
    if (this.isAmbientPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink noise generation for natural water flow
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter: gentle bandpass for bubbling river sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.ambientGain = gain;
      this.ambientSource = whiteNoise;
      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public stopRiverAmbience() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
      } catch {
        // Ignored
      }
      this.ambientSource = null;
    }
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }
}

export const sound = new SoundEngine();
