/**
 * Romantic Wedding Audio Engine
 * Supports custom audio stream URL + built-in romantic acoustic piano/harp synthesis fallback
 */

class WeddingAudioController {
  private audioCtx: AudioContext | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private isSynthesizing = false;
  private synthInterval: number | null = null;
  private _isPlaying = false;
  private _isMuted = false;
  private listeners: ((playing: boolean) => void)[] = [];

  constructor() {
    // Setup audio element for custom URLs
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.preload = 'none';
      this.audioEl.addEventListener('playing', () => {
        this._isPlaying = true;
        this.notify();
      });
      this.audioEl.addEventListener('pause', () => {
        this._isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this._isPlaying));
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public async play(customUrl?: string): Promise<boolean> {
    if (this._isPlaying) return true;

    if (customUrl && customUrl.trim().length > 0 && this.audioEl) {
      try {
        if (this.audioEl.src !== customUrl) {
          this.audioEl.src = customUrl;
        }
        this.audioEl.muted = this._isMuted;
        await this.audioEl.play();
        this._isPlaying = true;
        this.notify();
        return true;
      } catch (err) {
        console.warn('Audio URL autoplay failed, switching to acoustic synthesis:', err);
      }
    }

    // Fallback to built-in romantic acoustic harp & piano chord synthesizer
    return this.startSynthesis();
  }

  public pause(): void {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    this.stopSynthesis();
    this._isPlaying = false;
    this.notify();
  }

  public toggle(customUrl?: string): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play(customUrl);
    }
  }

  public setMuted(muted: boolean): void {
    this._isMuted = muted;
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
    if (this.audioCtx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.2, this.audioCtx.currentTime);
    }
  }

  // --- Romantic Acoustic Music Synthesis Engine (Pachelbel Canon / Wedding Harmony) ---
  private masterGain: GainNode | null = null;

  private startSynthesis(): boolean {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this._isMuted ? 0 : 0.18, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this.isSynthesizing = true;
      this._isPlaying = true;
      this.notify();

      // Wedding Chord Progression in D/G romantic arpeggios:
      // D -> A/C# -> Bm -> F#m -> G -> D -> G -> A
      const notes = [
        // Chord 1 (D)
        [293.66, 369.99, 440.0, 587.33],
        // Chord 2 (A)
        [220.0, 329.63, 440.0, 554.37],
        // Chord 3 (Bm)
        [246.94, 293.66, 369.99, 493.88],
        // Chord 4 (F#m)
        [185.0, 277.18, 369.99, 440.0],
        // Chord 5 (G)
        [196.0, 293.66, 392.0, 493.88],
        // Chord 6 (D)
        [220.0, 293.66, 369.99, 440.0],
        // Chord 7 (G)
        [196.0, 246.94, 293.66, 392.0],
        // Chord 8 (A)
        [220.0, 277.18, 329.63, 440.0],
      ];

      let chordIdx = 0;
      let noteStep = 0;

      const playNote = (freq: number, duration: number, delay: number, volume = 0.15) => {
        if (!this.audioCtx || !this.masterGain || !this.isSynthesizing) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime + delay;

        // Primary bell/piano tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Warm harmonic overtone
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, now);

        // Acoustic envelope: gentle attack, lingering warm decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        overtoneGain.gain.setValueAtTime(0.001, now);
        overtoneGain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.05);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(this.masterGain);
        overtoneGain.connect(this.masterGain);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + duration);
        overtone.stop(now + duration);
      };

      // Play soft arpeggiated romantic sequence
      const stepInterval = 420; // ms
      this.synthInterval = window.setInterval(() => {
        if (!this.isSynthesizing) return;
        const chord = notes[chordIdx];
        const freq = chord[noteStep % chord.length];

        // Bass root on first beat
        if (noteStep === 0) {
          playNote(chord[0] / 2, 2.2, 0, 0.2);
        }

        // Arpeggiated melody notes
        playNote(freq, 1.4, 0, 0.14);

        noteStep++;
        if (noteStep >= 4) {
          noteStep = 0;
          chordIdx = (chordIdx + 1) % notes.length;
        }
      }, stepInterval);

      return true;
    } catch (e) {
      console.error('Audio synthesizer initialization error:', e);
      return false;
    }
  }

  private stopSynthesis() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const weddingAudio = new WeddingAudioController();

/**
 * Web Audio FX triggers for Cyberpunk / Interactive Template sound effects
 */
export function playCyberClick(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
}

export function playCyberLaser(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

export function playCyberSuccess(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch {}
}

