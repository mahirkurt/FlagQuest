import { useSettingsStore } from '../store/useSettingsStore';

let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

const playTone = (frequency: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  if (!useSettingsStore.getState().soundEnabled) return;
  
  const ctx = getContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio playback errors
  }
};

export const playCorrectSound = () => {
  if (!useSettingsStore.getState().soundEnabled) return;
  playTone(523.25, 'sine', 0.1, 0.1); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
};

export const playComboSound = (streak: number) => {
  if (!useSettingsStore.getState().soundEnabled) return;
  const baseFreq = Math.min(523.25 + streak * 60, 1100);
  playTone(baseFreq, 'triangle', 0.12, 0.12);
  setTimeout(() => playTone(baseFreq * 1.25, 'triangle', 0.18, 0.12), 80);
};

export const playStampSound = () => {
  if (!useSettingsStore.getState().soundEnabled) return;
  playTone(220, 'triangle', 0.08, 0.15);
  setTimeout(() => playTone(440, 'sine', 0.15, 0.1), 60);
};

export const playLifelineSound = () => {
  if (!useSettingsStore.getState().soundEnabled) return;
  playTone(392, 'sine', 0.08, 0.1);
  setTimeout(() => playTone(587.33, 'sine', 0.12, 0.1), 80);
  setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 160);
};

export const playWrongSound = () => {
  if (!useSettingsStore.getState().soundEnabled) return;
  playTone(150, 'sawtooth', 0.3, 0.2); // Low buzz
};

export const playMatchStartSound = () => {
  if (!useSettingsStore.getState().soundEnabled) return;
  playTone(440, 'square', 0.1, 0.05);
  setTimeout(() => playTone(440, 'square', 0.1, 0.05), 200);
  setTimeout(() => playTone(880, 'square', 0.4, 0.05), 400);
};
