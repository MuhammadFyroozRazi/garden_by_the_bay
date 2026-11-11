/**
 * Procedural Web Audio API soundscape generator
 * Zero external audio files / zero 404 dependencies.
 * Synthesizes subtle tropical garden atmosphere: gentle breeze, birds chirping, soft water ripples.
 */

class GardenAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private birdTimer: number | null = null;
  private noiseNode: AudioNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = true;

    // 1. Gentle breeze / foliage noise generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Pink / low-pass filter for soft tropical wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(this.masterGain);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // 2. Periodic gentle tropical bird chirps
    this.scheduleBirdChirp();
  }

  private scheduleBirdChirp() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const delay = 4000 + Math.random() * 6000;
    this.birdTimer = window.setTimeout(() => {
      this.playBirdNote();
      this.scheduleBirdChirp();
    }, delay);
  }

  private playBirdNote() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2200 + Math.random() * 1200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.16);

    chirpGain.gain.setValueAtTime(0.001, now);
    chirpGain.gain.linearRampToValueAtTime(0.035, now + 0.04);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(chirpGain);
    chirpGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playSelectSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Elegant subtle chime on POI selection
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  public stop() {
    this.isPlaying = false;
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }
}

export const gardenAudio = new GardenAudioSynthesizer();
