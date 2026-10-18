import { writeFileSync } from 'node:fs';

const SAMPLE_RATE = 48000;
const DURATION = 15.0; // 15.0 seconds
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);
const BPM = 135;
const SECONDS_PER_BEAT = 60 / BPM; // ~0.4444s

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
  return Math.tanh(x * 1.2) * 0.85;
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
  const kickDuration = 0.35; // 350ms
  const length = Math.floor(kickDuration * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Pitch sweep: 160Hz drop exponentially to 42Hz
    const pitch = 42 + 120 * Math.exp(-t * 28);
    const phase = 2 * Math.PI * pitch * t;
    
    // Amp envelope: punchy initial spike + body
    const env = Math.exp(-t * 9);
    // Click transient
    const click = Math.exp(-t * 120) * (Math.random() * 2 - 1) * 0.4;
    
    // Sine + harmonic saturation
    const raw = Math.sin(phase) + 0.3 * Math.sin(phase * 2);
    const sample = softClip((raw * env + click) * 1.3 * velocity);

    leftBuf[idx] += sample * 0.95;
    rightBuf[idx] += sample * 0.95;
  }
}

function addSnare(startTime, velocity = 0.9) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const snareDuration = 0.28;
  const length = Math.floor(snareDuration * SAMPLE_RATE);
  const hpFilter = new BiquadFilter('highpass', 450, 1.2);
  const bpFilter = new BiquadFilter('bandpass', 2200, 2.0);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Body sine tone: 220Hz to 130Hz
    const bodyFreq = 130 + 90 * Math.exp(-t * 22);
    const bodyPhase = 2 * Math.PI * bodyFreq * t;
    const body = Math.sin(bodyPhase) * Math.exp(-t * 16) * 0.7;

    // Noise wires
    const noise = (Math.random() * 2 - 1);
    const filteredNoise = hpFilter.process(noise) * 0.7 + bpFilter.process(noise) * 0.8;
    const noiseEnv = Math.exp(-t * 12);

    const raw = (body + filteredNoise * noiseEnv * 1.4) * velocity;
    const sample = softClip(raw * 1.2);

    // Slight stereo spread
    leftBuf[idx] += sample * 0.85;
    rightBuf[idx] += sample * 0.90;
  }
}

function addHiHat(startTime, open = false, velocity = 0.6) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const duration = open ? 0.22 : 0.055;
  const length = Math.floor(duration * SAMPLE_RATE);
  const hpFilter = new BiquadFilter('highpass', 7500, 1.8);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    // Inharmonic square waves mix + noise
    const m1 = Math.sin(2 * Math.PI * 3420 * t) > 0 ? 1 : -1;
    const m2 = Math.sin(2 * Math.PI * 4830 * t) > 0 ? 1 : -1;
    const m3 = Math.sin(2 * Math.PI * 6270 * t) > 0 ? 1 : -1;
    const noise = (Math.random() * 2 - 1) * 1.2;
    const rawHat = (m1 + m2 + m3) * 0.25 + noise * 0.75;

    const filtered = hpFilter.process(rawHat);
    const env = Math.exp(-t * (open ? 16 : 65));
    const sample = filtered * env * velocity;

    // Stereo panning
    leftBuf[idx] += sample * 0.7;
    rightBuf[idx] += sample * 0.5;
  }
}

function addCrash(startTime, velocity = 0.8) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const duration = 2.4;
  const length = Math.floor(duration * SAMPLE_RATE);
  const hp = new BiquadFilter('highpass', 4200, 1.0);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const noise = (Math.random() * 2 - 1);
    const filtered = hp.process(noise);
    const env = Math.exp(-t * 2.2);
    const sample = softClip(filtered * env * velocity * 0.9);

    leftBuf[idx] += sample * 0.75;
    rightBuf[idx] += sample * 0.85;
  }
}

// -------------------------------------------------------------
// Synth Instruments
// -------------------------------------------------------------
// Note to Frequency helper (MIDI)
function mtof(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Reese Bass note (dual detuned saw + sub sine + filter sweep)
function addBassNote(startTime, duration, midiNote, cutoffStart = 800, cutoffEnd = 250, velocity = 0.85) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const freq = mtof(midiNote);
  const lp = new BiquadFilter('lowpass', cutoffStart, 2.0);

  let phase1 = 0;
  let phase2 = 0;
  let subPhase = 0;

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;
    const progress = i / length;

    // Cutoff decay
    const cutoff = cutoffStart + (cutoffEnd - cutoffStart) * Math.pow(progress, 0.7);
    lp.setParams(cutoff, 2.2);

    // Detuned sawtooths (rich stereo spread)
    const f1 = freq * 0.994;
    const f2 = freq * 1.006;
    phase1 += f1 / SAMPLE_RATE;
    phase2 += f2 / SAMPLE_RATE;
    subPhase += (freq * 0.5) / SAMPLE_RATE;

    const saw1 = 2 * (phase1 - Math.floor(phase1 + 0.5));
    const saw2 = 2 * (phase2 - Math.floor(phase2 + 0.5));
    const sub = Math.sin(2 * Math.PI * subPhase);

    const raw = (saw1 * 0.4 + saw2 * 0.4 + sub * 0.6);
    const filtered = lp.process(raw);
    const env = Math.sin(Math.min(1, t / 0.015) * Math.PI * 0.5) * Math.exp(-progress * 1.2);
    const sample = softClip(filtered * env * velocity * 1.2);

    leftBuf[idx] += sample * 0.92;
    rightBuf[idx] += sample * 0.92;
  }
}

// Cyberpunk Arp Note (16th note plucks with stereo ping-pong delay)
function addArpNote(startTime, midiNote, brightness = 3200, velocity = 0.6) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const noteDuration = 0.22;
  const length = Math.floor(noteDuration * SAMPLE_RATE);
  const freq = mtof(midiNote);
  const lp = new BiquadFilter('lowpass', brightness, 3.2);

  let phase = 0;
  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const currentCutoff = 350 + (brightness - 350) * Math.exp(-t * 24);
    lp.setParams(currentCutoff, 3.0);

    phase += freq / SAMPLE_RATE;
    // Square + Saw hybrid pluck
    const saw = 2 * (phase - Math.floor(phase + 0.5));
    const sqr = Math.sin(2 * Math.PI * phase) > 0 ? 0.7 : -0.7;
    const raw = (saw * 0.6 + sqr * 0.4);

    const filtered = lp.process(raw);
    const env = Math.exp(-t * 18);
    const sample = softClip(filtered * env * velocity);

    // Direct sound
    leftBuf[idx] += sample * 0.75;
    rightBuf[idx] += sample * 0.65;

    // Ping-pong delay tap 1 (110ms left)
    const d1 = idx + Math.floor(0.111 * SAMPLE_RATE);
    if (d1 < TOTAL_SAMPLES) {
      leftBuf[d1] += sample * 0.35;
    }
    // Ping-pong delay tap 2 (222ms right)
    const d2 = idx + Math.floor(0.222 * SAMPLE_RATE);
    if (d2 < TOTAL_SAMPLES) {
      rightBuf[d2] += sample * 0.22;
    }
  }
}

// Riser FX
function addRiser(startTime, duration, velocity = 0.7) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const length = Math.floor(duration * SAMPLE_RATE);
  const bp = new BiquadFilter('bandpass', 300, 3.5);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const progress = i / length;

    // Filter frequency sweeps from 250Hz up to 8000Hz
    const cutoff = 250 * Math.pow(8000 / 250, progress);
    bp.setParams(cutoff, 3.5);

    const noise = (Math.random() * 2 - 1);
    const filtered = bp.process(noise);
    // Pitch riser tone
    const pitch = 150 + 600 * Math.pow(progress, 2);
    const tone = Math.sin(2 * Math.PI * pitch * (i / SAMPLE_RATE)) * 0.4;

    const env = Math.pow(progress, 1.8) * velocity;
    const sample = softClip((filtered * 1.2 + tone) * env);

    leftBuf[idx] += sample * (0.5 + 0.4 * progress);
    rightBuf[idx] += sample * (0.9 - 0.4 * progress);
  }
}

// Cinematic Sub-Boom / Impact
function addSubBoom(startTime, velocity = 1.0) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const duration = 2.5;
  const length = Math.floor(duration * SAMPLE_RATE);

  for (let i = 0; i < length; i++) {
    const idx = startSample + i;
    if (idx >= TOTAL_SAMPLES) break;
    const t = i / SAMPLE_RATE;

    const freq = 65 * Math.exp(-t * 2.5) + 24;
    const phase = 2 * Math.PI * freq * t;
    const sub = Math.sin(phase) + 0.3 * Math.sin(phase * 0.5);

    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 6) * 0.3;
    const env = Math.exp(-t * 1.5);
    const sample = softClip((sub + noise) * env * velocity * 1.4);

    leftBuf[idx] += sample;
    rightBuf[idx] += sample;
  }
}

// -------------------------------------------------------------
// Musical Composition Architecture
// -------------------------------------------------------------
console.log('Composing and synthesizing 15-second showreel soundtrack...');

// 1. INTRO (0.0s - 2.66s): Tension, Sub-pulse & Riser
addSubBoom(0.05, 1.0);
addRiser(0.8, 1.86, 0.75);

// Intro Countdown Ticks on beats 3, 4, 5, 6
for (let b = 2; b < 6; b++) {
  const t = b * SECONDS_PER_BEAT;
  addHiHat(t, false, 0.7);
  addArpNote(t, 62 + (b - 2) * 3, 2000, 0.5); // D4, F4, G#4, B4
}

// 2. ACT I & II: FULL BEAT DROP (2.66s to 8.0s)
// D Minor Arp Motifs: D4(62), F4(65), A4(69), D5(74), C5(72), Bb4(70), A4(69), G4(67)
const arpNotesPhase1 = [
  62, 65, 69, 74,  65, 69, 74, 76,  62, 65, 69, 72,  70, 69, 67, 65,
  58, 62, 65, 70,  62, 65, 70, 74,  60, 64, 67, 72,  69, 67, 65, 64,
  62, 65, 69, 74,  65, 69, 74, 77,  76, 74, 72, 69,  70, 69, 67, 65,
  58, 62, 65, 70,  67, 70, 74, 77,  69, 72, 76, 81,  79, 77, 76, 74
];

const dropStartBeat = 6; // ~2.66s
addCrash(dropStartBeat * SECONDS_PER_BEAT, 0.9);

// Bassline progression (D1=26, Bb0=22, C1=24, A0=21)
const bassProg = [
  { note: 26, duration: SECONDS_PER_BEAT * 3.8 }, // D
  { note: 22, duration: SECONDS_PER_BEAT * 3.8 }, // Bb
  { note: 24, duration: SECONDS_PER_BEAT * 3.8 }, // C
  { note: 21, duration: SECONDS_PER_BEAT * 3.8 }, // A
];

// Lay down the groove from Beat 6 to 24 (~2.66s to 10.66s)
for (let b = 6; b < 24; b++) {
  const beatTime = b * SECONDS_PER_BEAT;

  // Kick on every beat
  if (b < 18 || b >= 20) { // mini stutter pause at beat 18-19
    addKick(beatTime, 1.0);
  }

  // Snare on beats 2 and 4 of each 4-beat measure
  if ((b - 6) % 2 === 1) {
    addSnare(beatTime, 0.95);
  }

  // Hi-Hats: 16th notes
  for (let s = 0; s < 4; s++) {
    const subTime = beatTime + s * (SECONDS_PER_BEAT / 4);
    const isOpen = s === 2; // offbeat open hat
    addHiHat(subTime, isOpen, isOpen ? 0.7 : 0.45);
  }
}

// Add Bassline
for (let i = 0; i < 4; i++) {
  const barStart = (6 + i * 4) * SECONDS_PER_BEAT;
  if (barStart < DURATION) {
    addBassNote(barStart, bassProg[i].duration, bassProg[i].note, 1200, 350, 0.85);
  }
}

// Add 16th note Arpeggio from Beat 6 to 24
for (let i = 0; i < arpNotesPhase1.length; i++) {
  const arpTime = (6 * SECONDS_PER_BEAT) + i * (SECONDS_PER_BEAT / 4);
  if (arpTime >= DURATION - 1.5) break;
  // Dynamic filter brightness ramp
  const brightness = 2400 + Math.sin(i * 0.4) * 1200;
  addArpNote(arpTime, arpNotesPhase1[i], brightness, 0.65);
}

// 3. ACT III BREAKDOWN & CHARGED RISER (7.5s - 10.66s)
addRiser(7.5, 3.16, 0.85);
// Snare acceleration roll leading into climax
for (let i = 0; i < 16; i++) {
  const rollTime = (20 * SECONDS_PER_BEAT) + i * (SECONDS_PER_BEAT / 4);
  const vel = 0.4 + (i / 16) * 0.6;
  addSnare(rollTime, vel);
}

// 4. ACT IV & CLIMAX: MAXIMUM IMPACT (10.66s - 13.33s)
const climaxStartBeat = 24; // ~10.66s
addCrash(climaxStartBeat * SECONDS_PER_BEAT, 1.0);
addSubBoom(climaxStartBeat * SECONDS_PER_BEAT, 1.0);

// Furious double kick and lead synth blast
for (let b = 24; b < 30; b++) {
  const beatTime = b * SECONDS_PER_BEAT;
  addKick(beatTime, 1.0);
  addKick(beatTime + SECONDS_PER_BEAT * 0.5, 0.85); // Driving double kick

  if ((b - 24) % 2 === 1) {
    addSnare(beatTime, 1.0);
  }
  // High-energy metallic hats
  for (let s = 0; s < 4; s++) {
    addHiHat(beatTime + s * (SECONDS_PER_BEAT / 4), s % 2 === 1, 0.6);
  }
}

// Climax Lead Melody: D5, F5, E5, D5, A5
const climaxMelody = [
  { time: 24 * SECONDS_PER_BEAT, note: 74, dur: SECONDS_PER_BEAT },
  { time: 25 * SECONDS_PER_BEAT, note: 77, dur: SECONDS_PER_BEAT },
  { time: 26 * SECONDS_PER_BEAT, note: 76, dur: SECONDS_PER_BEAT },
  { time: 27 * SECONDS_PER_BEAT, note: 74, dur: SECONDS_PER_BEAT * 0.5 },
  { time: 27.5 * SECONDS_PER_BEAT, note: 81, dur: SECONDS_PER_BEAT * 1.5 },
  { time: 29 * SECONDS_PER_BEAT, note: 86, dur: SECONDS_PER_BEAT }, // High D6 peak!
];
for (const m of climaxMelody) {
  if (m.time < DURATION) {
    addBassNote(m.time, m.dur, m.note - 12, 3500, 1800, 0.8);
    addArpNote(m.time, m.note, 5000, 0.9);
  }
}

// 5. FINALE / OUTRO SIGNATURE STING (13.33s - 15.0s)
const outroTime = 30 * SECONDS_PER_BEAT; // ~13.33s
addSubBoom(outroTime, 1.0);
addCrash(outroTime, 1.0);

// Final resonant chime chord: Dm9 (D4, F4, A4, C5, E5) ringing out into reverb
[62, 65, 69, 72, 76].forEach((note, idx) => {
  addArpNote(outroTime + idx * 0.04, note, 4500, 0.8);
});

// -------------------------------------------------------------
// Mastering & Normalization (Transparent Limiter)
// -------------------------------------------------------------
console.log('Mastering audio buffers with multi-band soft saturation...');
let peak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  // Master stereo width and soft limiter
  leftBuf[i] = softClip(leftBuf[i] * 0.92);
  rightBuf[i] = softClip(rightBuf[i] * 0.92);

  // Fade out smoothly in the last 0.25s
  if (i > TOTAL_SAMPLES - SAMPLE_RATE * 0.25) {
    const fade = (TOTAL_SAMPLES - i) / (SAMPLE_RATE * 0.25);
    leftBuf[i] *= fade;
    rightBuf[i] *= fade;
  }

  peak = Math.max(peak, Math.abs(leftBuf[i]), Math.abs(rightBuf[i]));
}

// Convert to 16-bit PCM WAV Buffer
const wavBuffer = Buffer.alloc(44 + TOTAL_SAMPLES * 4);

// RIFF header
wavBuffer.write('RIFF', 0);
wavBuffer.writeUInt32LE(36 + TOTAL_SAMPLES * 4, 4);
wavBuffer.write('WAVE', 8);
wavBuffer.write('fmt ', 12);
wavBuffer.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
wavBuffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
wavBuffer.writeUInt16LE(2, 22);  // NumChannels (2 for Stereo)
wavBuffer.writeUInt32LE(SAMPLE_RATE, 24); // SampleRate (48000)
wavBuffer.writeUInt32LE(SAMPLE_RATE * 4, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
wavBuffer.writeUInt16LE(4, 32);  // BlockAlign (NumChannels * BitsPerSample/8)
wavBuffer.writeUInt16LE(16, 34); // BitsPerSample (16)
wavBuffer.write('data', 36);
wavBuffer.writeUInt32LE(TOTAL_SAMPLES * 4, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const l = clamp(Math.floor(leftBuf[i] * 32767), -32768, 32767);
  const r = clamp(Math.floor(rightBuf[i] * 32767), -32768, 32767);
  wavBuffer.writeInt16LE(l, offset);
  wavBuffer.writeInt16LE(r, offset + 2);
  offset += 4;
}

const outputPath = 'videos/showreel-motion/assets/soundtrack.wav';
writeFileSync(outputPath, wavBuffer);
console.log(`✓ Synthesized pristine 15.0s soundtrack (peak: ${peak.toFixed(2)}) -> ${outputPath}`);
