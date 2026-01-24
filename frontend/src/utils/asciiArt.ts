/**
 * ASCII Art Library for ASCII Oracle
 * Contains art definitions, animations, and rendering utilities
 */

// Welcome banner for terminal
export const ASCII_WELCOME = `
\x1b[32m╔═══════════════════════════════════════════════════════════╗
║     _    ____   ____ ___ ___    ___  ____      _    ____  ║
║    / \\  / ___| / ___|_ _|_ _|  / _ \\|  _ \\    / \\  / ___| ║
║   / _ \\ \\___ \\| |    | | | |  | | | | |_) |  / _ \\| |     ║
║  / ___ \\ ___) | |___ | | | |  | |_| |  _ <  / ___ \\ |___  ║
║ /_/   \\_\\____/ \\____|___|___|  \\___/|_| \\_\\/_/   \\_\\____| ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[36mWelcome to ASCII Oracle - A retro terminal experience\x1b[0m
Type \x1b[33mhelp\x1b[0m for available commands.

`;

// ASCII Art Collection
export const asciiArtLibrary: Record<string, string[]> = {
  mario: [
    '    ████████    ',
    '   ██████████   ',
    '   ███  █  █    ',
    '  ██ █ ███ ██   ',
    '  ██ █ ███ ██   ',
    '  ██████████    ',
    '    ████████    ',
    '   ██████████   ',
    '  ████████████  ',
    ' ██ ████████ ██ ',
    ' ██ ████████ ██ ',
    ' ██ ██    ██ ██ ',
    '    ██    ██    ',
    '   ████  ████   ',
    '  ██████████████',
  ],
  mushroom: [
    '      ████████      ',
    '    ██████████████    ',
    '  ████  ████  ████  ',
    ' ████  ██████  ████ ',
    ' ██████████████████ ',
    '██████████████████████',
    '██████████████████████',
    ' ████████████████████ ',
    '  ██████████████████  ',
    '    ████████████    ',
    '      ████████      ',
  ],
  star: [
    '        ██        ',
    '       ████       ',
    '      ██████      ',
    '     ████████     ',
    '████████████████████',
    ' ██████████████████ ',
    '  ████████████████  ',
    '   ██████████████   ',
    '  ████████████████  ',
    ' ██████  ██  ██████ ',
    '██████    ██    ██████',
  ],
  coin: [
    '    ██████████    ',
    '  ██          ██  ',
    ' ██    ████    ██ ',
    '██    ██████    ██',
    '██    ██  ██    ██',
    '██    ██████    ██',
    '██    ██  ██    ██',
    '██    ██████    ██',
    ' ██    ████    ██ ',
    '  ██          ██  ',
    '    ██████████    ',
  ],
  ghost: [
    '    ██████████    ',
    '  ██          ██  ',
    ' ██  ██    ██  ██ ',
    ' ██  ██    ██  ██ ',
    '██              ██',
    '██              ██',
    '██   ██████████   ██',
    '██              ██',
    '████████████████████',
    '██  ██  ██  ██  ██',
  ],
  pipe: [
    '████████████████████',
    '██                ██',
    '████████████████████',
    '  ██            ██  ',
    '  ██            ██  ',
    '  ██            ██  ',
    '  ██            ██  ',
    '  ██            ██  ',
    '  ██            ██  ',
    '  ████████████████  ',
  ],
  heart: [
    '  ████    ████  ',
    ' ██████  ██████ ',
    '████████████████',
    '████████████████',
    '████████████████',
    ' ██████████████ ',
    '  ████████████  ',
    '    ████████    ',
    '      ████      ',
    '       ██       ',
  ],
  fire: [
    '      ██      ',
    '     ████     ',
    '    ██████    ',
    '   ████████   ',
    '  ██████████  ',
    '  ██  ████  ██  ',
    ' ████ ████ ████ ',
    ' ██████████████ ',
    '  ████████████  ',
    '   ██████████   ',
    '    ████████    ',
  ],
  sword: [
    '          ██',
    '        ████',
    '      ████  ',
    '    ████    ',
    '  ████      ',
    '████        ',
    '██          ',
    '████        ',
    '  ██        ',
  ],
  shield: [
    '████████████████████',
    '██                ██',
    '██  ████████████  ██',
    '██  ██        ██  ██',
    '██  ██  ████  ██  ██',
    '██  ██  ████  ██  ██',
    ' ██ ██        ██ ██ ',
    ' ██ ████████████ ██ ',
    '  ██            ██  ',
    '   ██          ██   ',
    '    ████████████    ',
    '      ████████      ',
  ],
  rocket: [
    '      ██      ',
    '    ██████    ',
    '   ████████   ',
    '  ██████████  ',
    '  ██████████  ',
    '  ██████████  ',
    ' ████████████ ',
    ' ██ ██████ ██ ',
    '██  ██████  ██',
    '    ██  ██    ',
    '   ██    ██   ',
    '  ██      ██  ',
  ],
  alien: [
    '    ████████████    ',
    '  ██            ██  ',
    ' ██  ██      ██  ██ ',
    ' ██  ██      ██  ██ ',
    '██    ████████    ██',
    '██  ██        ██  ██',
    '██  ██  ████  ██  ██',
    ' ██    ████    ██ ',
    '  ████████████████  ',
    '    ██  ██  ██    ',
  ],
  pacman: [
    '    ████████    ',
    '  ████████████  ',
    ' ██████████████ ',
    '████████████    ',
    '██████████      ',
    '████████        ',
    '██████████      ',
    '████████████    ',
    ' ██████████████ ',
    '  ████████████  ',
    '    ████████    ',
  ],
  invader: [
    '    ██      ██    ',
    '      ██  ██      ',
    '    ██████████    ',
    '  ████  ████  ████  ',
    '████████████████████',
    '██  ██████████  ██',
    '██  ██      ██  ██',
    '      ████████      ',
  ],
  tree: [
    '        ██        ',
    '       ████       ',
    '      ██████      ',
    '     ████████     ',
    '    ██████████    ',
    '   ████████████   ',
    '  ██████████████  ',
    ' ████████████████ ',
    '██████████████████',
    '        ██        ',
    '        ██        ',
    '       ████       ',
  ],
  cat: [
    '  ██          ██  ',
    ' ████        ████ ',
    '██████████████████',
    '██  ██    ██  ██',
    '██  ██    ██  ██',
    '██████████████████',
    '██    ████    ██',
    '██      ██      ██',
    '  ██████████████  ',
    '    ██      ██    ',
  ],
  dog: [
    '████              ',
    '██████            ',
    '████████████████████',
    '██  ██        ██  ██',
    '██  ██        ██  ██',
    '██████████████████████',
    '██                  ██',
    '██    ██████████    ██',
    '  ████        ████  ',
    '    ██        ██    ',
  ],
  skull: [
    '    ████████████    ',
    '  ██            ██  ',
    ' ██  ████  ████  ██ ',
    ' ██  ████  ████  ██ ',
    '██                ██',
    '██      ████      ██',
    ' ██              ██ ',
    '  ██  ██  ██  ██  ',
    '   ██████████████   ',
  ],
  crown: [
    '██      ██      ██',
    '████  ██████  ████',
    '████████████████████',
    ' ██████████████████ ',
    '  ████████████████  ',
    '   ██████████████   ',
  ],
  diamond: [
    '        ██        ',
    '      ██████      ',
    '    ██████████    ',
    '  ██████████████  ',
    '████████████████████',
    '  ██████████████  ',
    '    ██████████    ',
    '      ██████      ',
    '        ██        ',
  ],
};

// Animation frames for specific art
export const animationFrames: Record<string, string[][]> = {
  coin: [
    asciiArtLibrary.coin,
    [
      '     ████████     ',
      '    ██      ██    ',
      '   ██  ████  ██   ',
      '   ██ ██████ ██   ',
      '   ██ ██  ██ ██   ',
      '   ██ ██████ ██   ',
      '   ██ ██  ██ ██   ',
      '   ██ ██████ ██   ',
      '    ██  ████  ██    ',
      '     ██      ██     ',
      '      ████████      ',
    ],
    [
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
      '       ████       ',
    ],
    [
      '     ████████     ',
      '    ██      ██    ',
      '   ██  ████  ██   ',
      '   ██ ██████ ██   ',
      '   ██ ██  ██ ██   ',
      '   ██ ██████ ██   ',
      '   ██ ██  ██ ██   ',
      '   ██ ██████ ██   ',
      '    ██  ████  ██    ',
      '     ██      ██     ',
      '      ████████      ',
    ],
  ],
  star: [
    asciiArtLibrary.star,
    [
      '        ████        ',
      '       ██████       ',
      '      ████████      ',
      '     ██████████     ',
      '██████████████████████',
      ' ████████████████████ ',
      '  ██████████████████  ',
      '   ████████████████   ',
      '  ██████████████████  ',
      ' ████████  ████████ ',
      '████████    ████████',
    ],
  ],
  ghost: [
    asciiArtLibrary.ghost,
    [
      '    ██████████    ',
      '  ██          ██  ',
      ' ██    ██  ██  ██ ',
      ' ██    ██  ██  ██ ',
      '██              ██',
      '██              ██',
      '██   ██████████   ██',
      '██              ██',
      '████████████████████',
      '  ██  ██  ██  ██  ',
    ],
  ],
  fire: [
    asciiArtLibrary.fire,
    [
      '       ██       ',
      '      ████      ',
      '     ██████     ',
      '    ████████    ',
      '   ██████████   ',
      '   ██  ████  ██   ',
      '  ████ ████ ████  ',
      '  ████████████████  ',
      '   ██████████████   ',
      '    ████████████    ',
      '     ██████████     ',
    ],
    [
      '     ██     ',
      '    ████    ',
      '   ██████   ',
      '  ████████  ',
      ' ██████████ ',
      ' ██  ████ ██ ',
      '████ ████ ████',
      '██████████████',
      ' ████████████ ',
      '  ██████████  ',
      '   ████████   ',
    ],
  ],
};

// Get ASCII art by name
export function getAsciiArt(name: string): string[] | null {
  const lowerName = name.toLowerCase();
  return asciiArtLibrary[lowerName] || null;
}

// Get list of available art
export function getArtList(): string[] {
  return Object.keys(asciiArtLibrary);
}

// Format art for terminal display
export function formatArtForTerminal(art: string[], color?: string): string {
  const colorCode = color ? getColorCode(color) : '\x1b[32m'; // Default green
  const reset = '\x1b[0m';
  return art.map(line => `${colorCode}${line}${reset}`).join('\r\n');
}

// Get ANSI color code
function getColorCode(color: string): string {
  const colors: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bright_red: '\x1b[91m',
    bright_green: '\x1b[92m',
    bright_yellow: '\x1b[93m',
    bright_blue: '\x1b[94m',
    bright_magenta: '\x1b[95m',
    bright_cyan: '\x1b[96m',
    bright_white: '\x1b[97m',
  };
  return colors[color.toLowerCase()] || colors.green;
}

// Animation controller class
export class AsciiAnimator {
  private frames: string[][];
  private currentFrame: number = 0;
  private intervalId: number | null = null;
  private onFrame: (frame: string[]) => void;

  constructor(artName: string, onFrame: (frame: string[]) => void) {
    this.frames = animationFrames[artName] || [asciiArtLibrary[artName] || []];
    this.onFrame = onFrame;
  }

  start(fps: number = 4): void {
    if (this.intervalId) this.stop();
    
    const interval = 1000 / fps;
    this.intervalId = window.setInterval(() => {
      this.onFrame(this.frames[this.currentFrame]);
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, interval);
  }

  stop(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// Generate simple text to ASCII art
export function textToAscii(text: string): string[] {
  const font: Record<string, string[]> = {
    A: ['███', '█ █', '███', '█ █', '█ █'],
    B: ['██ ', '█ █', '██ ', '█ █', '██ '],
    C: ['███', '█  ', '█  ', '█  ', '███'],
    D: ['██ ', '█ █', '█ █', '█ █', '██ '],
    E: ['███', '█  ', '██ ', '█  ', '███'],
    F: ['███', '█  ', '██ ', '█  ', '█  '],
    G: ['███', '█  ', '█ █', '█ █', '███'],
    H: ['█ █', '█ █', '███', '█ █', '█ █'],
    I: ['███', ' █ ', ' █ ', ' █ ', '███'],
    J: ['███', '  █', '  █', '█ █', '███'],
    K: ['█ █', '█ █', '██ ', '█ █', '█ █'],
    L: ['█  ', '█  ', '█  ', '█  ', '███'],
    M: ['█ █', '███', '█ █', '█ █', '█ █'],
    N: ['█ █', '███', '███', '█ █', '█ █'],
    O: ['███', '█ █', '█ █', '█ █', '███'],
    P: ['███', '█ █', '███', '█  ', '█  '],
    Q: ['███', '█ █', '█ █', '███', '  █'],
    R: ['███', '█ █', '██ ', '█ █', '█ █'],
    S: ['███', '█  ', '███', '  █', '███'],
    T: ['███', ' █ ', ' █ ', ' █ ', ' █ '],
    U: ['█ █', '█ █', '█ █', '█ █', '███'],
    V: ['█ █', '█ █', '█ █', '█ █', ' █ '],
    W: ['█ █', '█ █', '█ █', '███', '█ █'],
    X: ['█ █', '█ █', ' █ ', '█ █', '█ █'],
    Y: ['█ █', '█ █', '███', ' █ ', ' █ '],
    Z: ['███', '  █', ' █ ', '█  ', '███'],
    '0': ['███', '█ █', '█ █', '█ █', '███'],
    '1': [' █ ', '██ ', ' █ ', ' █ ', '███'],
    '2': ['███', '  █', '███', '█  ', '███'],
    '3': ['███', '  █', '███', '  █', '███'],
    '4': ['█ █', '█ █', '███', '  █', '  █'],
    '5': ['███', '█  ', '███', '  █', '███'],
    '6': ['███', '█  ', '███', '█ █', '███'],
    '7': ['███', '  █', '  █', '  █', '  █'],
    '8': ['███', '█ █', '███', '█ █', '███'],
    '9': ['███', '█ █', '███', '  █', '███'],
    ' ': ['   ', '   ', '   ', '   ', '   '],
    '!': [' █ ', ' █ ', ' █ ', '   ', ' █ '],
    '?': ['███', '  █', ' █ ', '   ', ' █ '],
  };

  const lines: string[] = ['', '', '', '', ''];
  const upperText = text.toUpperCase();

  for (const char of upperText) {
    const charArt = font[char] || font[' '];
    for (let i = 0; i < 5; i++) {
      lines[i] += charArt[i] + ' ';
    }
  }

  return lines;
}

// Random art for fun
export function getRandomArt(): { name: string; art: string[] } {
  const names = Object.keys(asciiArtLibrary);
  const randomName = names[Math.floor(Math.random() * names.length)];
  return { name: randomName, art: asciiArtLibrary[randomName] };
}

// Alias for backwards compatibility
export const ASCII_LIBRARY = asciiArtLibrary;

// Export for use
export default {
  asciiArtLibrary,
  ASCII_LIBRARY: asciiArtLibrary,
  animationFrames,
  getAsciiArt,
  getArtList,
  formatArtForTerminal,
  textToAscii,
  getRandomArt,
  AsciiAnimator,
};
