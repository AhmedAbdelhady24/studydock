import { writeFileSync } from 'node:fs';

const SAMPLE_RATE = 48000;
const DURATION = 15.0; // 15.0 seconds
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);
const BPM = 126;
const SECONDS_PER_BEAT = 60 / BPM; // ~0.476s

// Left & Right float audio buffers
const leftBuf = new Float32Array(TOTAL_SAMPLES);
const rightBuf = new Float32Array(TOTAL_SAMPLES);

// -------------------------------------------------------------
// DSP Utilities
// -------------------------------------------------------------
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function softClip(x) {
  return Math.tanh(x * 1.25) * 0.88;
}

// Biquad Filter implementation
class BiquadFilter {
  constructor(type, cutoff, q = 1.0) {
    this.type = type;
    this.cutoff = cutoff;
    this.q = q;
    this.x1 = 0; this.x2 = 0;
    this.y1 = 0; this.y2 = 0;
    this.recompute();
  }

  setParams(cutoff, q) {
    this.cutoff = clamp(cutoff, 20, SAMPLE_RATE * 0.48);
    this.q = Math.max(0.1, q);
    this.recompute();
  }

  recompute() {
    const w0 = 2 * Math.PI * (this.cutoff / SAMPLE_RATE);
    const cosw0 = Math.cos(w0);
    const sinw0 = Math.sin(w0);
    const alpha = sinw0 / (2 * this.q);

    if (this.type === 'lowpass') {
      this.b0 = (1 - cosw0) / 2;
      this.b1 = 1 - cosw0;
      this.b2 = (1 - cosw0) / 2;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    } else if (this.type === 'highpass') {
      this.b0 = (1 + cosw0) / 2;
      this.b1 = -(1 + cosw0);
      this.b2 = (1 + cosw0) / 2;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    } else if (this.type === 'bandpass') {
      this.b0 = alpha;
      this.b1 = 0;
      this.b2 = -alpha;
      this.a0 = 1 + alpha;
      this.a1 = -2 * cosw0;
      this.a2 = 1 - alpha;
    }
  }

  process(sample) {
    const out = (this.b0 / this.a0) * sample +
                (this.b1 / this.a0) * this.x1 +
                (this.b2 / this.a0) * this.x2 -
                (this.a1 / this.a0) * this.y1 -
                (this.a2 / this.a0) * this.y2;
    this.x2 = this.x1;
    this.x1 = sample;
    this.y2 = this.y1;
    this.y1 = out;
    return isNaN(out) ? 0 : out;
  }
}

// -------------------------------------------------------------
// Drum Generators
// -------------------------------------------------------------
function addKick(startTime, velocity = 1.0) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const kickDuration = 0.32;
  const length = Math.floor(kickDuration * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Pitch sweep: 150Hz drop to 45Hz
    const pitch = 45 + 115 * Math.exp(-t * 30);
    const phase = 2 * Math.PI * pitch * t;
    const body = Math.sin(phase);

    // Click transient
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 200) * 0.4;
    // Amp envelope
    const amp = Math.exp(-t * 11) * velocity * 0.95;

    const val = softClip((body + click) * amp);
    leftBuf[idx] += val;
    rightBuf[idx] += val;
  }
}

function addSnare(startTime, velocity = 1.0) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const snareDuration = 0.28;
  const length = Math.floor(snareDuration * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const tone = Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 22);
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 14);
    const val = (tone * 0.4 + noise * 0.6) * velocity * 0.7;

    leftBuf[idx] += val * 0.95;
    rightBuf[idx] += val * 1.05;
  }
}

function addHiHat(startTime, open = false, velocity = 0.8) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const duration = open ? 0.22 : 0.05;
  const length = Math.floor(duration * SAMPLE_RATE);
  const decayRate = open ? 16 : 80;

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const noise = (Math.random() * 2 - 1);
    const env = Math.exp(-t * decayRate) * velocity * 0.35;
    const val = noise * env;

    leftBuf[idx] += val * 0.9;
    rightBuf[idx] += val * 1.1;
  }
}

// -------------------------------------------------------------
// Synth & Bass Sound Generators
// -------------------------------------------------------------
function addFMBass(startTime, noteFreq, duration, velocity = 0.85) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const filter = new BiquadFilter('lowpass', 1200, 1.2);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Modulator & Carrier
    const modFreq = noteFreq * 2;
    const modEnv = Math.exp(-t * 9) * 2.5;
    const mod = Math.sin(2 * Math.PI * modFreq * t) * modEnv;

    const carrier = Math.sin(2 * Math.PI * noteFreq * t + mod);
    const sub = Math.sin(2 * Math.PI * (noteFreq * 0.5) * t) * 0.5;

    const env = Math.exp(-t * 4.5) * velocity * 0.75;
    const filtered = filter.process((carrier + sub) * env);

    leftBuf[idx] += softClip(filtered);
    rightBuf[idx] += softClip(filtered);
  }
}

function addPluckArp(startTime, noteFreq, duration = 0.25, pan = 0.0, velocity = 0.6) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const osc1 = Math.sin(2 * Math.PI * noteFreq * t);
    const osc2 = (2 * ((noteFreq * 2 * t) % 1) - 1) * 0.3; // Saw octave
    const env = Math.exp(-t * 14) * velocity * 0.5;
    const val = (osc1 + osc2) * env;

    // Stereo panning
    const leftGain = Math.cos((pan + 1) * Math.PI * 0.25);
    const rightGain = Math.sin((pan + 1) * Math.PI * 0.25);

    leftBuf[idx] += val * leftGain;
    rightBuf[idx] += val * rightGain;
  }
}

function addPadChord(startTime, freqs, duration, velocity = 0.4) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const filter = new BiquadFilter('lowpass', 2400, 0.7);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Attack - Sustain - Release Envelope
    let env = 1.0;
    if (t < 0.3) env = t / 0.3;
    else if (t > duration - 0.5) env = Math.max(0, (duration - t) / 0.5);

    let chordSum = 0;
    for (let f of freqs) {
      chordSum += Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * (f * 1.004) * t);
    }
    chordSum /= freqs.length;

    const val = filter.process(chordSum * env * velocity * 0.55);
    leftBuf[idx] += val * 0.95;
    rightBuf[idx] += val * 1.05;
  }
}

// -------------------------------------------------------------
// Dedicated StudyDock UI Sound Effects (SFX)
// -------------------------------------------------------------
function addWhoosh(startTime, duration = 0.5, sweepUp = true, gain = 0.6) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const filter = new BiquadFilter('bandpass', sweepUp ? 300 : 2500, 2.0);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / length;

    // Frequency cutoff sweep
    const cutoff = sweepUp
      ? 200 + 3600 * Math.pow(t, 2)
      : 3800 - 3400 * Math.pow(t, 2);
    filter.setParams(cutoff, 2.2);

    const noise = (Math.random() * 2 - 1);
    const env = Math.sin(Math.PI * t) * gain;
    const val = filter.process(noise) * env;

    leftBuf[idx] += val * (1 - t * 0.4);
    rightBuf[idx] += val * (0.6 + t * 0.4);
  }
}

function addUIClick(startTime, gain = 0.7) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(0.04 * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const pulse = Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 160);
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 220);
    const val = (pulse * 0.6 + click * 0.4) * gain;

    leftBuf[idx] += val;
    rightBuf[idx] += val;
  }
}

function addCheckmarkChime(startTime, gain = 0.65) {
  // Dual high-frequency crystal chime for verified milestone
  const chimeFreqs = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(0.6 * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    let chimeSum = 0;
    for (let f of chimeFreqs) {
      chimeSum += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 7);
    }
    const val = (chimeSum / chimeFreqs.length) * gain;

    leftBuf[idx] += val * 1.1;
    rightBuf[idx] += val * 0.9;
  }
}

function addSubDrop(startTime, gain = 0.8) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(1.2 * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const freq = 110 * Math.exp(-t * 3.8);
    const val = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2.5) * gain;

    leftBuf[idx] += val;
    rightBuf[idx] += val;
  }
}

// -------------------------------------------------------------
// Composition Choreography
// -------------------------------------------------------------
console.log('Composing StudyDock 15-Second Motion Soundtrack...');

// Key notes (D Minor Pentatonic / Aeolian)
// D2=73.42, F2=87.31, G2=98.0, A2=110.0, C3=130.81, D3=146.83
const D2 = 73.42;
const F2 = 87.31;
const G2 = 98.0;
const A2 = 110.0;
const C3 = 130.81;
const D3 = 146.83;
const F3 = 174.61;
const G3 = 196.0;
const A3 = 220.0;
const C4 = 261.63;
const D4 = 293.66;
const F4 = 349.23;
const G4 = 392.0;
const A4 = 440.0;
const Bb4 = 466.16;
const C5 = 523.25;
const D5 = 587.33;

// Intro: Sub drop & crystal chime at 0.0s
addSubDrop(0.05, 0.85);
addCheckmarkChime(0.2, 0.4);

// Beat starts at 1.8s (bar 1 of tempo)
// 126 BPM = ~0.476s per beat
const beatTime = SECONDS_PER_BEAT;

// Add pad chord swells across scenes
addPadChord(0.1, [D3, A3, F4], 2.8, 0.35); // Intro
addPadChord(2.8, [F3, C4, A4], 3.0, 0.4);  // Scene 2: Bento
addPadChord(5.8, [G3, D4, Bb4], 3.0, 0.4); // Scene 3: Roadmap
addPadChord(8.8, [D3, A3, F4], 3.2, 0.45); // Scene 4: Kanban
addPadChord(12.0, [D3, F3, A3, D4, F4], 2.8, 0.55); // Climax

// Drums & Bass groove from 2.8s to 14.5s
const bassPattern = [
  D2, D2, F2, D2, G2, D2, A2, C3,
  D2, D2, F2, D2, C3, A2, G2, F2
];

let currentBeat = 2.8;
let beatIndex = 0;

while (currentBeat < 14.4) {
  // Kick on beats 1 and 3 (or four-on-the-floor during climax)
  const isClimax = currentBeat >= 11.5;
  if (isClimax || (beatIndex % 2 === 0)) {
    addKick(currentBeat, isClimax ? 1.0 : 0.9);
  }

  // Snare on beats 2 and 4
  if (beatIndex % 2 === 1) {
    addSnare(currentBeat, 0.85);
  }

  // Hi-hats every 16th note
  const stepTime = beatTime / 4;
  for (let s = 0; s < 4; s++) {
    const t = currentBeat + s * stepTime;
    if (t < 14.4) {
      const isOpen = s === 2;
      addHiHat(t, isOpen, isOpen ? 0.6 : 0.4);
    }
  }

  // Rolling Bassline (16th notes)
  for (let s = 0; s < 4; s++) {
    const t = currentBeat + s * stepTime;
    if (t < 14.4) {
      const note = bassPattern[(beatIndex * 4 + s) % bassPattern.length];
      addFMBass(t, note, stepTime * 0.9, 0.7);
    }
  }

  // Arp lead notes
  const arpNotes = [D4, F4, A4, C5, D5, C5, A4, F4];
  for (let s = 0; s < 4; s++) {
    const t = currentBeat + s * stepTime;
    if (t < 14.4) {
      const note = arpNotes[(beatIndex * 4 + s) % arpNotes.length];
      const pan = Math.sin((beatIndex * 4 + s) * 0.6);
      addPluckArp(t, note, stepTime * 1.2, pan, 0.45);
    }
  }

  currentBeat += beatTime;
  beatIndex++;
}

// -------------------------------------------------------------
// Visual Event Sync SFX
// -------------------------------------------------------------
// 2.8s: Transition to Bento Dashboard
addWhoosh(2.5, 0.45, true, 0.65);
addUIClick(2.82, 0.8);

// 4.2s: Bento meter charges to 68%
addUIClick(4.15, 0.5);
addUIClick(4.25, 0.6);
addUIClick(4.35, 0.7);

// 5.8s: Transition to 33-Week Roadmap
addWhoosh(5.5, 0.45, true, 0.7);
addUIClick(5.82, 0.8);

// 7.4s: Milestone Checkpoint Gatekeeper verified!
addCheckmarkChime(7.4, 0.75);

// 8.8s: Transition to Execution Kanban Board
addWhoosh(8.5, 0.45, true, 0.7);
addUIClick(8.82, 0.85);

// 9.4s: Cursor clicks Start -> and card moves to In-Progress
addUIClick(9.4, 0.9);
addWhoosh(9.45, 0.35, false, 0.5);

// 10.2s: TaskDetailDrawer slides in with spring physics
addWhoosh(10.15, 0.4, false, 0.6);
addUIClick(10.3, 0.6);

// 12.0s: Epic Riser into Grand Multi-Screen Climax
addWhoosh(11.4, 0.8, true, 0.85);
addSubDrop(12.05, 0.95);
addCheckmarkChime(12.1, 0.7);

// 14.5s: Soft warm tailout
addSubDrop(14.2, 0.4);

// -------------------------------------------------------------
// Master Limiting, Normalization & WAV Output
// -------------------------------------------------------------
console.log('Mastering 48kHz Stereo WAV file...');

let peak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Subtle stereo widening
  const l = leftBuf[i];
  const r = rightBuf[i];
  const mid = (l + r) * 0.5;
  const side = (l - r) * 0.5 * 1.15;
  leftBuf[i] = softClip(mid + side);
  rightBuf[i] = softClip(mid - side);

  peak = Math.max(peak, Math.abs(leftBuf[i]), Math.abs(rightBuf[i]));
}

// Normalize to -0.3dB peak (~0.96)
const targetPeak = 0.96;
const gainFactor = peak > 0 ? (targetPeak / peak) : 1.0;

const wavHeader = Buffer.alloc(44);
const dataSize = TOTAL_SAMPLES * 2 * 2; // 2 channels, 16-bit (2 bytes)

// RIFF chunk descriptor
wavHeader.write('RIFF', 0);
wavHeader.writeUInt32LE(36 + dataSize, 4);
wavHeader.write('WAVE', 8);

// fmt sub-chunk
wavHeader.write('fmt ', 12);
wavHeader.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
wavHeader.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
wavHeader.writeUInt16LE(2, 22);  // NumChannels (2 for Stereo)
wavHeader.writeUInt32LE(SAMPLE_RATE, 24); // SampleRate (48000)
wavHeader.writeUInt32LE(SAMPLE_RATE * 2 * 2, 28); // ByteRate
wavHeader.writeUInt16LE(4, 32);  // BlockAlign (2 * 2)
wavHeader.writeUInt16LE(16, 34); // BitsPerSample (16)

// data sub-chunk
wavHeader.write('data', 36);
wavHeader.writeUInt32LE(dataSize, 40);

const audioData = Buffer.alloc(dataSize);
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const lSample = clamp(leftBuf[i] * gainFactor, -1, 1);
  const rSample = clamp(rightBuf[i] * gainFactor, -1, 1);

  const lInt16 = Math.floor(lSample < 0 ? lSample * 32768 : lSample * 32767);
  const rInt16 = Math.floor(rSample < 0 ? rSample * 32768 : rSample * 32767);

  audioData.writeInt16LE(lInt16, i * 4);
  audioData.writeInt16LE(rInt16, i * 4 + 2);
}

const finalWav = Buffer.concat([wavHeader, audioData]);
const outputPath = 'videos/showreel-motion/assets/soundtrack.wav';
writeFileSync(outputPath, finalWav);
console.log(`Saved master synthesized audio soundtrack to: ${outputPath} (${finalWav.length} bytes)`);
