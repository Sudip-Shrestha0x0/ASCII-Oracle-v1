/**
 * ASCII Oracle - App State Store
 * Created by Light
 * Zustand-powered global state management
 */

import { create } from 'zustand';

interface PowerUp {
  type: string;
  message: string;
}

interface HologramData {
  type: string;
  text?: string;
  content?: string;
  color?: string;
  interactive?: boolean;
  customShape?: string;
}

interface AppState {
  // Terminal state
  commandHistory: string[];
  outputHistory: string[];
  
  // Hologram state
  hologramMode: boolean;
  hologramData: HologramData | null;
  
  // Power-up notifications
  powerUp: PowerUp | null;
  
  // Settings
  soundEnabled: boolean;
  animationsEnabled: boolean;
  
  // Actions
  addCommand: (cmd: string) => void;
  addOutput: (output: string) => void;
  clearHistory: () => void;
  setHologramMode: (mode: boolean) => void;
  setHologramData: (data: HologramData | null) => void;
  triggerPowerUp: (type: string, message: string) => void;
  clearPowerUp: () => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  commandHistory: [],
  outputHistory: [],
  hologramMode: false,
  hologramData: null,
  powerUp: null,
  soundEnabled: true,
  animationsEnabled: true,

  // Command history
  addCommand: (cmd) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, cmd].slice(-100), // Keep last 100
    })),

  // Output history
  addOutput: (output) =>
    set((state) => ({
      outputHistory: [...state.outputHistory, output].slice(-500), // Keep last 500
    })),

  // Clear all history
  clearHistory: () =>
    set({
      commandHistory: [],
      outputHistory: [],
    }),

  // Hologram mode
  setHologramMode: (mode) => set({ hologramMode: mode }),
  
  setHologramData: (data) =>
    set({
      hologramData: data,
      hologramMode: data !== null,
    }),

  // Power-ups
  triggerPowerUp: (type, message) =>
    set({
      powerUp: { type, message },
    }),

  clearPowerUp: () => set({ powerUp: null }),

  // Settings
  toggleSound: () =>
    set((state) => ({ soundEnabled: !state.soundEnabled })),

  toggleAnimations: () =>
    set((state) => ({ animationsEnabled: !state.animationsEnabled })),
}));
