// Background music (HTMLAudioElement — plays even when iOS silent switch is on
// for media) + tiny synthesised sound effects via Web Audio (no audio files).
import musicSrc from '../assets/canon-in-d.mp3';

let audio;
let ctx;
let listeners = new Set();
let musicOn = false;

function emit() { listeners.forEach((fn) => fn(musicOn)); }
export function subscribeMusic(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const isMusicOn = () => musicOn;

function getAudio() {
  if (!audio) {
    audio = new Audio(musicSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('play', () => { musicOn = true; emit(); });
    audio.addEventListener('pause', () => { musicOn = false; emit(); });
  }
  return audio;
}

function fade(to, ms = 1600) {
  const a = getAudio();
  const from = a.volume;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    try { a.volume = from + (to - from) * k; } catch { /* iOS: volume is read-only */ }
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Must be called from a user gesture (tap) to satisfy autoplay policies.
export function unlockAudio() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch { /* noop */ }
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

export function playMusic() {
  const a = getAudio();
  try { a.volume = 0; } catch { /* noop */ }
  const p = a.play();
  if (p && p.catch) p.catch(() => { musicOn = false; emit(); });
  fade(0.7);
}

export function toggleMusic() {
  const a = getAudio();
  if (a.paused) playMusic();
  else a.pause();
}

function noiseBuffer(sec) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

export function sfx(kind) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.5;
  out.connect(ctx.destination);
  if (kind === 'seal') {
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(0.12);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.9;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    n.connect(bp).connect(g).connect(out); n.start(t);
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.6, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g2).connect(out); o.start(t); o.stop(t + 0.2);
  } else if (kind === 'paper') {
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer(1.0);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(600, t); bp.frequency.exponentialRampToValueAtTime(3200, t + 0.8);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.25); g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
    n.connect(bp).connect(g).connect(out); n.start(t);
  } else if (kind === 'chime') {
    [1318.5, 1975.5, 2637].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); const s = t + i * 0.09;
      g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.12 / (i + 1), s + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, s + 1.6);
      o.connect(g).connect(out); o.start(s); o.stop(s + 1.7);
    });
  }
}
