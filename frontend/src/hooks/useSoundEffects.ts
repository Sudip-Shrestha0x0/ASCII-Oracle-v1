/**
 * ASCII Oracle - Sound Effects Hook
 * Uses Web Audio API with proper gesture handling
 */

import { useCallback, useRef } from 'react';
import { useAppStore } from './useAppStore';

// Extend Window interface for webkit audio context
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Audio context singleton - only created on user gesture
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    try {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioContextConstructor) {
        audioContext = new AudioContextConstructor();
      }
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }

  // Resume if suspended (browser autoplay policy)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
};

// Sound configurations
const SOUNDS: Record<
  string,
  { freq: number; duration: number; type: OscillatorType; gain: number }
> = {
  type: { freq: 800, duration: 0.03, type: 'square', gain: 0.1 },
  click: { freq: 600, duration: 0.05, type: 'square', gain: 0.15 },
  execute: { freq: 440, duration: 0.1, type: 'triangle', gain: 0.2 },
  powerup: { freq: 880, duration: 0.2, type: 'square', gain: 0.2 },
  error: { freq: 200, duration: 0.15, type: 'sawtooth', gain: 0.15 },
  coin: { freq: 988, duration: 0.08, type: 'square', gain: 0.2 },
};

// Play a simple beep using Web Audio API
const playBeep = (config: (typeof SOUNDS)[string]) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + config.duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration + 0.01);
  } catch (e) {
    // Silently fail if audio can't play
  }
};

// Special coin sound (two tones)
const playCoinSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'square';
    osc1.frequency.value = 988;
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.07);

    // Second tone (higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'square';
    osc2.frequency.value = 1319;
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.07);
    gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.08);
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime + 0.07);
    osc2.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Silently fail
  }
};

export const useSoundEffects = () => {
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const hasInteractedRef = useRef(false);

  const playSound = useCallback(
    (name: string) => {
      if (!soundEnabled) return;

      // Mark that user has interacted (allows audio context to work)
      hasInteractedRef.current = true;

      if (name === 'coin') {
        playCoinSound();
      } else if (SOUNDS[name]) {
        playBeep(SOUNDS[name]);
      }
    },
    [soundEnabled]
  );

  return { playSound };
};
