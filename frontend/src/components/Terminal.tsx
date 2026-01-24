/**
 * ASCII Oracle - Terminal Component
 * Full-featured terminal with math, physics, chemistry, search
 */

import { FitAddon } from '@xterm/addon-fit';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { asciiArtLibrary } from '../utils/asciiArt';

interface TerminalProps {
  onUploadRequest: (type: 'image' | 'video') => void;
  onSound: (sound: string) => void;
}

// Math evaluation with proper parsing
const evaluateMath = (expr: string): string => {
  try {
    // Clean the expression
    let cleaned = expr.trim().toLowerCase();

    // Handle special functions
    cleaned = cleaned
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
      .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
      .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-z])/g, 'Math.E')
      .replace(/\^/g, '**');

    // Only allow safe characters
    if (
      !/^[0-9+\-*/().Math,\s]+$/.test(
        cleaned.replace(/Math\.(sqrt|sin|cos|tan|log10|log|abs|pow|PI|E)/g, '')
      )
    ) {
      return 'Invalid expression';
    }

    const result = Function('"use strict"; return (' + cleaned + ')')();

    if (typeof result === 'number') {
      // Format nicely
      if (Number.isInteger(result)) {
        return result.toString();
      }
      return result.toFixed(6).replace(/\.?0+$/, '');
    }
    return String(result);
  } catch (e) {
    return 'Error: Could not evaluate';
  }
};

// Physics formulas database
const PHYSICS_FORMULAS: Record<
  string,
  { name: string; formula: string; calc: (args: number[]) => string }
> = {
  velocity: {
    name: 'Velocity',
    formula: 'v = d / t',
    calc: ([d, t]) => `Velocity = ${(d / t).toFixed(2)} m/s`,
  },
  acceleration: {
    name: 'Acceleration',
    formula: 'a = (v - u) / t',
    calc: ([v, u, t]) => `Acceleration = ${((v - u) / t).toFixed(2)} m/s²`,
  },
  force: {
    name: "Force (Newton's 2nd Law)",
    formula: 'F = m × a',
    calc: ([m, a]) => `Force = ${(m * a).toFixed(2)} N`,
  },
  momentum: {
    name: 'Momentum',
    formula: 'p = m × v',
    calc: ([m, v]) => `Momentum = ${(m * v).toFixed(2)} kg·m/s`,
  },
  kinetic: {
    name: 'Kinetic Energy',
    formula: 'KE = ½mv²',
    calc: ([m, v]) => `Kinetic Energy = ${(0.5 * m * v * v).toFixed(2)} J`,
  },
  potential: {
    name: 'Potential Energy',
    formula: 'PE = mgh',
    calc: ([m, h]) => `Potential Energy = ${(m * 9.81 * h).toFixed(2)} J`,
  },
  work: {
    name: 'Work',
    formula: 'W = F × d × cos(θ)',
    calc: ([f, d, theta = 0]) =>
      `Work = ${(f * d * Math.cos((theta * Math.PI) / 180)).toFixed(2)} J`,
  },
  power: {
    name: 'Power',
    formula: 'P = W / t',
    calc: ([w, t]) => `Power = ${(w / t).toFixed(2)} W`,
  },
  projectile: {
    name: 'Projectile Motion',
    formula: 'R = v²sin(2θ)/g, H = v²sin²(θ)/2g',
    calc: ([v, angle]) => {
      const theta = (angle * Math.PI) / 180;
      const g = 9.81;
      const range = (v * v * Math.sin(2 * theta)) / g;
      const maxH = (v * v * Math.sin(theta) * Math.sin(theta)) / (2 * g);
      const time = (2 * v * Math.sin(theta)) / g;
      return `Range: ${range.toFixed(2)}m | Max Height: ${maxH.toFixed(2)}m | Time: ${time.toFixed(2)}s`;
    },
  },
  freefall: {
    name: 'Free Fall',
    formula: 'v = √(2gh), t = √(2h/g)',
    calc: ([h]) => {
      const g = 9.81;
      const v = Math.sqrt(2 * g * h);
      const t = Math.sqrt((2 * h) / g);
      return `Final velocity: ${v.toFixed(2)} m/s | Time: ${t.toFixed(2)} s`;
    },
  },
  ohm: {
    name: "Ohm's Law",
    formula: 'V = I × R',
    calc: ([i, r]) => `Voltage = ${(i * r).toFixed(2)} V`,
  },
  frequency: {
    name: 'Wave Frequency',
    formula: 'f = v / λ',
    calc: ([v, lambda]) => `Frequency = ${(v / lambda).toFixed(2)} Hz`,
  },
  gravity: {
    name: 'Gravitational Force',
    formula: 'F = G(m₁m₂)/r²',
    calc: ([m1, m2, r]) => {
      const G = 6.674e-11;
      return `Force = ${((G * m1 * m2) / (r * r)).toExponential(3)} N`;
    },
  },
  escape: {
    name: 'Escape Velocity',
    formula: 'v = √(2GM/r)',
    calc: ([m, r]) => {
      const G = 6.674e-11;
      return `Escape velocity = ${Math.sqrt((2 * G * m) / r).toFixed(2)} m/s`;
    },
  },
  centripetal: {
    name: 'Centripetal Force',
    formula: 'F = mv²/r',
    calc: ([m, v, r]) => `Centripetal Force = ${((m * v * v) / r).toFixed(2)} N`,
  },
  pendulum: {
    name: 'Pendulum Period',
    formula: 'T = 2π√(L/g)',
    calc: ([l]) => `Period = ${(2 * Math.PI * Math.sqrt(l / 9.81)).toFixed(3)} s`,
  },
};

// Chemistry data
const ELEMENTS: Record<string, { name: string; number: number; mass: number; category: string }> = {
  h: { name: 'Hydrogen', number: 1, mass: 1.008, category: 'Nonmetal' },
  he: { name: 'Helium', number: 2, mass: 4.003, category: 'Noble Gas' },
  li: { name: 'Lithium', number: 3, mass: 6.941, category: 'Alkali Metal' },
  be: { name: 'Beryllium', number: 4, mass: 9.012, category: 'Alkaline Earth' },
  b: { name: 'Boron', number: 5, mass: 10.81, category: 'Metalloid' },
  c: { name: 'Carbon', number: 6, mass: 12.011, category: 'Nonmetal' },
  n: { name: 'Nitrogen', number: 7, mass: 14.007, category: 'Nonmetal' },
  o: { name: 'Oxygen', number: 8, mass: 15.999, category: 'Nonmetal' },
  f: { name: 'Fluorine', number: 9, mass: 18.998, category: 'Halogen' },
  ne: { name: 'Neon', number: 10, mass: 20.18, category: 'Noble Gas' },
  na: { name: 'Sodium', number: 11, mass: 22.99, category: 'Alkali Metal' },
  mg: { name: 'Magnesium', number: 12, mass: 24.305, category: 'Alkaline Earth' },
  al: { name: 'Aluminum', number: 13, mass: 26.982, category: 'Post-transition' },
  si: { name: 'Silicon', number: 14, mass: 28.086, category: 'Metalloid' },
  p: { name: 'Phosphorus', number: 15, mass: 30.974, category: 'Nonmetal' },
  s: { name: 'Sulfur', number: 16, mass: 32.065, category: 'Nonmetal' },
  cl: { name: 'Chlorine', number: 17, mass: 35.453, category: 'Halogen' },
  ar: { name: 'Argon', number: 18, mass: 39.948, category: 'Noble Gas' },
  k: { name: 'Potassium', number: 19, mass: 39.098, category: 'Alkali Metal' },
  ca: { name: 'Calcium', number: 20, mass: 40.078, category: 'Alkaline Earth' },
  fe: { name: 'Iron', number: 26, mass: 55.845, category: 'Transition Metal' },
  cu: { name: 'Copper', number: 29, mass: 63.546, category: 'Transition Metal' },
  zn: { name: 'Zinc', number: 30, mass: 65.38, category: 'Transition Metal' },
  ag: { name: 'Silver', number: 47, mass: 107.868, category: 'Transition Metal' },
  au: { name: 'Gold', number: 79, mass: 196.967, category: 'Transition Metal' },
  pb: { name: 'Lead', number: 82, mass: 207.2, category: 'Post-transition' },
  u: { name: 'Uranium', number: 92, mass: 238.029, category: 'Actinide' },
};

// Calculate molar mass from formula
const calcMolarMass = (formula: string): number => {
  let mass = 0;
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  while ((match = regex.exec(formula)) !== null) {
    const symbol = match[1].toLowerCase();
    const count = match[2] ? parseInt(match[2]) : 1;
    if (ELEMENTS[symbol]) {
      mass += ELEMENTS[symbol].mass * count;
    }
  }
  return mass;
};

const Terminal: React.FC<TerminalProps> = ({ onUploadRequest: _onUploadRequest, onSound }) => {
  const termRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadType = useRef<'image' | 'video'>('image');

  const { addCommand, setHologramMode, setHologramData, triggerPowerUp } = useAppStore();

  const writeLine = (text: string) => xtermRef.current?.writeln(text);
  const writeLines = (lines: string[]) => lines.forEach((line) => writeLine(line));
  const printPrompt = () => xtermRef.current?.write('\x1b[33m❯\x1b[0m ');
  const clearLine = () => {
    for (let i = 0; i < inputRef.current.length; i++) {
      xtermRef.current?.write('\b \b');
    }
  };

  // File upload handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    writeLine(`\n\x1b[36mProcessing: ${file.name}...\x1b[0m`);

    try {
      const formData = new FormData();
      formData.append(pendingUploadType.current, file);
      formData.append('width', '70');
      formData.append('charset', 'blocks');

      const endpoint =
        pendingUploadType.current === 'image' ? '/api/image/to-ascii' : '/api/video/to-ascii';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ascii) {
          writeLine('\n\x1b[32m════════ ASCII ART RESULT ════════\x1b[0m\n');
          writeLine(data.ascii);
          writeLine('\n\x1b[32m══════════════════════════════════\x1b[0m');
          onSound('powerup');
        } else if (data.frames?.length) {
          writeLine(`\n\x1b[32mConverted ${data.frames.length} frames:\x1b[0m`);
          writeLine(data.frames[0]);
        }
      } else {
        writeLine('\x1b[31mError: Server could not process file\x1b[0m');
      }
    } catch {
      writeLine('\x1b[31mError: Backend not running. Start with "npm run dev"\x1b[0m');
    }

    writeLine('');
    printPrompt();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Main command executor
  const executeCommand = async (cmd: string) => {
    const term = xtermRef.current;
    if (!term) return;

    addCommand(cmd);
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        writeLines([
          '',
          '\x1b[32m╔════════════════════════════════════════════════════════════════╗\x1b[0m',
          '\x1b[32m║                    ASCII ORACLE - COMMANDS                     ║\x1b[0m',
          '\x1b[32m╠════════════════════════════════════════════════════════════════╣\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mGENERAL\x1b[0m                                                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   help                    Show this help menu                  \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   cheatsheet              Quick reference of all commands      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   clear                   Clear the terminal                   \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   about                   About ASCII Oracle                   \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mASCII ART\x1b[0m                                                     \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   draw <name>             Draw ASCII art (e.g., draw cat)      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   draw --list             List all available ASCII art         \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   upload image            Convert image to ASCII               \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   upload video            Convert video to ASCII               \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33m3D HOLOGRAMS\x1b[0m                                                  \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram cube           Rotating 3D cube                     \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram sphere         Wireframe sphere with rings          \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram torus          3D torus/donut                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram pyramid        Golden pyramid                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram dna            DNA helix animation                  \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram galaxy         Spiral galaxy simulation             \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram wave           Multi-layer wave animation           \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram text <msg>     3D floating text                     \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram particles      Particle sphere                      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[35m🔺 SACRED GEOMETRY\x1b[0m                                             \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram illuminati     All-Seeing Eye Pyramid               \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram sacred         Merkaba (Star Tetrahedron)           \x1b[32m║\x1b[0m',
          "\x1b[32m║\x1b[0m   hologram metatron       Metatron's Cube                      \x1b[32m║\x1b[0m",
          '\x1b[32m║\x1b[0m   hologram flower         Flower of Life                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram tesseract      4D Hypercube                         \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   hologram icosahedron    20-sided Platonic solid              \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mMATHEMATICS\x1b[0m                                                   \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   solve <expr>            Calculate expression                 \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   Examples: solve 2+2, solve sqrt(16), solve 5^2              \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m            solve sin(45), solve log(100), solve pi*2          \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mPHYSICS\x1b[0m                                                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   physics                 Show all physics formulas            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   physics <type> <args>   Calculate (e.g., physics force 10 5)\x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mCHEMISTRY\x1b[0m                                                     \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   chemistry               Show chemistry help                  \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   chemistry element <sym> Get element info (e.g., Fe, Au)      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   chemistry molar <form>  Calculate molar mass (e.g., H2O)     \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m \x1b[33mKEYBOARD SHORTCUTS\x1b[0m                                            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   ↑/↓                     Navigate command history             \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m   ESC                     Exit hologram mode                   \x1b[32m║\x1b[0m',
          '\x1b[32m╚════════════════════════════════════════════════════════════════╝\x1b[0m',
          '',
        ]);
        break;

      case 'cheatsheet':
      case 'cheat':
      case 'commands':
        writeLines([
          '',
          '\x1b[36m╔══════════════════════════════════════════════════════════════════╗\x1b[0m',
          '\x1b[36m║                    ⚡ QUICK CHEATSHEET ⚡                         ║\x1b[0m',
          '\x1b[36m╚══════════════════════════════════════════════════════════════════╝\x1b[0m',
          '',
          '\x1b[33m🎨 ASCII ART\x1b[0m',
          '   draw cat | draw mario | draw --list | upload image',
          '',
          // '\x1b[33m🤖 AI (Requires API Key)\x1b[0m',
          // '   search dragon | generate spaceship | ask what is gravity',
          // '',
          '\x1b[33m🔮 3D HOLOGRAMS\x1b[0m',
          '   hologram cube | sphere | torus | pyramid | dna | galaxy',
          '   hologram wave | particles | text HELLO',
          '',
          '\x1b[33m🔺 SACRED GEOMETRY (The Cool Stuff!)\x1b[0m',
          '   hologram illuminati   \x1b[35m← All-Seeing Eye Pyramid\x1b[0m',
          '   hologram sacred       \x1b[35m← Merkaba Star Tetrahedron\x1b[0m',
          "   hologram metatron     \x1b[35m← Metatron's Cube\x1b[0m",
          '   hologram flower       \x1b[35m← Flower of Life\x1b[0m',
          '   hologram tesseract    \x1b[35m← 4D Hypercube\x1b[0m',
          '   hologram icosahedron  \x1b[35m← Platonic Solid\x1b[0m',
          '',
          '\x1b[33m🔢 MATH\x1b[0m',
          '   solve 2+2 | sqrt(144) | 2^10 | sin(45) | pi*2 | log(100)',
          '',
          '\x1b[33m⚛️ PHYSICS\x1b[0m',
          '   physics                \x1b[90m← show all formulas\x1b[0m',
          '   physics force 10 5    \x1b[90m← F=ma → 50N\x1b[0m',
          '   physics velocity 100 10  \x1b[90m← v=d/t → 10m/s\x1b[0m',
          '   physics kinetic 10 5  \x1b[90m← KE=½mv² → 125J\x1b[0m',
          '   physics projectile 20 45  \x1b[90m← range, height, time\x1b[0m',
          '',
          '\x1b[33m🧪 CHEMISTRY\x1b[0m',
          '   chemistry element Fe | Au | H',
          '   chemistry molar H2O | NaCl | C6H12O6',
          '',
          '\x1b[33m⌨️ SHORTCUTS\x1b[0m',
          '   ↑/↓ history | ESC exit hologram | clear screen',
          '',
        ]);
        break;

      case 'draw':
        if (args[0] === '--list' || args[0] === '-l') {
          const artNames = Object.keys(asciiArtLibrary);
          writeLines(
            [
              '',
              `\x1b[36m╔══ AVAILABLE ASCII ART (${artNames.length}) ══╗\x1b[0m`,
              '',
              artNames
                .map((n, i) => `  ${(i + 1).toString().padStart(2)}. ${n}`)
                .join('\n')
                .split('\n')
                .slice(0, 30)
                .join('\n'),
              artNames.length > 30 ? `  ... and ${artNames.length - 30} more` : '',
              '',
              '\x1b[33mUsage: draw <name>  (e.g., draw cat)\x1b[0m',
              '',
            ].filter(Boolean)
          );
        } else if (args[0]) {
          const artName = args[0].toLowerCase();
          const art = asciiArtLibrary[artName];
          if (art) {
            writeLine('');
            art.forEach((line) => writeLine('\x1b[32m' + line + '\x1b[0m'));
            writeLine('');
            triggerPowerUp('star', `Drew ${artName}!`);
            onSound('powerup');
          } else {
            writeLines([
              '',
              `\x1b[31mArt "${artName}" not found.\x1b[0m`,
              '',
              'Available art includes: cat, dog, mario, mushroom, star, heart, ghost, skull',
              'Use \x1b[33mdraw --list\x1b[0m to see all available art.',
              '',
            ]);
            onSound('error');
          }
        } else {
          writeLines([
            '',
            '\x1b[33mUsage:\x1b[0m draw <name>',
            '',
            '\x1b[36mExamples:\x1b[0m',
            '  draw cat        Draw a cat',
            '  draw mario      Draw Mario',
            '  draw --list     List all available art',
            '',
          ]);
        }
        break;

      case 'upload': {
        const uploadType = args[0] === 'video' ? 'video' : 'image';
        pendingUploadType.current = uploadType;
        writeLine(`\n\x1b[36mOpening ${uploadType} picker...\x1b[0m`);
        if (fileInputRef.current) {
          fileInputRef.current.accept = uploadType === 'image' ? 'image/*' : 'video/*';
          fileInputRef.current.click();
        }
        return;
      }

      case 'hologram': {
        const holoType = args[0]?.toLowerCase() || 'cube';
        const holoText = args.slice(1).join(' ') || 'HELLO';
        const validHolos = [
          'cube',
          'sphere',
          'torus',
          'pyramid',
          'dna',
          'galaxy',
          'wave',
          'text',
          'particles',
          'sacred',
          'illuminati',
          'eye',
          'metatron',
          'flower',
          'floweroflife',
          'tesseract',
          'hypercube',
          'icosahedron',
          'geometry',
          'sacredgeometry',
          'allseeingeye',
        ];

        if (validHolos.includes(holoType)) {
          setHologramData({
            type: holoType,
            text: holoText,
          });
          setHologramMode(true);

          // Special messages for sacred geometry
          let typeLabel = holoType;
          if (['illuminati', 'eye', 'allseeingeye'].includes(holoType)) {
            typeLabel = '🔺 ILLUMINATI PYRAMID';
          } else if (['sacred', 'geometry', 'sacredgeometry'].includes(holoType)) {
            typeLabel = '✡ MERKABA';
          } else if (holoType === 'metatron') {
            typeLabel = "⬡ METATRON'S CUBE";
          } else if (['flower', 'floweroflife'].includes(holoType)) {
            typeLabel = '✿ FLOWER OF LIFE';
          } else if (['tesseract', 'hypercube'].includes(holoType)) {
            typeLabel = '◇ 4D TESSERACT';
          }

          writeLines([
            '',
            `\x1b[36m╔═══════════════════════════════════╗\x1b[0m`,
            `\x1b[36m║     ENTERING 3D HOLOGRAM MODE     ║\x1b[0m`,
            `\x1b[36m╠═══════════════════════════════════╣\x1b[0m`,
            `\x1b[36m║\x1b[0m  Type: \x1b[35m${typeLabel.padEnd(24)}\x1b[0m  \x1b[36m║\x1b[0m`,
            `\x1b[36m║\x1b[0m                                   \x1b[36m║\x1b[0m`,
            `\x1b[36m║\x1b[0m  Controls:                        \x1b[36m║\x1b[0m`,
            `\x1b[36m║\x1b[0m  • Mouse drag to rotate           \x1b[36m║\x1b[0m`,
            `\x1b[36m║\x1b[0m  • Scroll to zoom                 \x1b[36m║\x1b[0m`,
            `\x1b[36m║\x1b[0m  • Press ESC to exit              \x1b[36m║\x1b[0m`,
            `\x1b[36m╚═══════════════════════════════════╝\x1b[0m`,
            '',
          ]);
          triggerPowerUp('mushroom', '3D Mode!');
          onSound('powerup');
        } else {
          writeLines([
            '',
            `\x1b[31mUnknown hologram type: ${holoType}\x1b[0m`,
            '',
            '\x1b[36mAvailable types:\x1b[0m',
            '',
            '\x1b[33mBASIC SHAPES:\x1b[0m',
            '  cube, sphere, torus, pyramid, dna, galaxy',
            '  wave, text <MSG>, particles, icosahedron',
            '',
            '\x1b[35mSACRED GEOMETRY:\x1b[0m',
            '  illuminati  - All-Seeing Eye Pyramid 🔺',
            '  sacred      - Merkaba (Star Tetrahedron) ✡',
            "  metatron    - Metatron's Cube ⬡",
            '  flower      - Flower of Life ✿',
            '  tesseract   - 4D Hypercube ◇',
            '',
          ]);
        }
        break;
      }

      case 'search': {
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[36m╔══ AI-POWERED SEARCH ══╗\x1b[0m',
            '',
            '\x1b[33mUsage:\x1b[0m search <query>',
            '',
            '\x1b[36mExamples:\x1b[0m',
            '  search dragon       Search for dragon ASCII art',
            '  search spaceship    Find spaceship designs',
            '  search pokemon      AI will generate Pokemon art',
            '',
            '\x1b[33mNote:\x1b[0m Uses Gemini AI with web grounding for best results.',
            '',
          ]);
          break;
        }

        const searchQuery = args.join(' ');
        writeLine(`\n\x1b[36mSearching for "${searchQuery}"...\x1b[0m`);

        try {
          const searchResponse = await fetch(
            `/api/search/web?q=${encodeURIComponent(searchQuery)}`
          );
          const searchData = await searchResponse.json();

          if (searchData.success) {
            writeLine('');

            // Show if AI-powered
            if (searchData.aiPowered) {
              writeLine('\x1b[35m🤖 AI-Powered Search Results\x1b[0m');
              writeLine('');
            }

            // Show ASCII art if generated
            if (searchData.asciiArt) {
              writeLine('\x1b[32m═══ Generated ASCII Art ═══\x1b[0m');
              searchData.asciiArt.split('\n').forEach((line: string) => {
                writeLine('\x1b[32m' + line + '\x1b[0m');
              });
              writeLine('\x1b[32m════════════════════════════\x1b[0m');
              writeLine('');
            }

            // Show response text
            if (searchData.response) {
              const responseLines = searchData.response.split('\n').slice(0, 15);
              responseLines.forEach((line: string) => {
                // Don't double-print ASCII art
                if (!line.match(/^[\s]*[█▓░#@*.\-_|/\\()[\]{}]+[\s]*$/)) {
                  writeLine(line);
                }
              });
              if (searchData.response.split('\n').length > 15) {
                writeLine('\x1b[33m... (truncated)\x1b[0m');
              }
            }

            // Show local results if available
            if (searchData.results && searchData.results.length > 0) {
              writeLine('\x1b[36mLocal matches:\x1b[0m');
              searchData.results
                .slice(0, 5)
                .forEach((r: { name?: string; title?: string }, i: number) => {
                  writeLine(`  ${i + 1}. ${r.name || r.title}`);
                });
              if (searchData.results[0]?.name) {
                writeLine(`\nUse \x1b[33mdraw ${searchData.results[0].name}\x1b[0m to display`);
              }
            }

            // Show sources if available
            if (searchData.sources && searchData.sources.length > 0) {
              writeLine('');
              writeLine('\x1b[33mSources:\x1b[0m');
              searchData.sources.slice(0, 3).forEach((s: { title: string }) => {
                writeLine(`  • ${s.title}`);
              });
            }

            writeLine('');
            onSound('powerup');
          } else {
            // Fallback to local search
            const localResults = Object.keys(asciiArtLibrary).filter((name) =>
              name.includes(searchQuery.toLowerCase())
            );

            if (localResults.length > 0) {
              writeLines([
                '',
                `\x1b[32mLocal results for "${searchQuery}":\x1b[0m`,
                '',
                ...localResults.slice(0, 10).map((r, i) => `  ${i + 1}. ${r}`),
                '',
                `Use \x1b[33mdraw ${localResults[0]}\x1b[0m to display`,
                '',
              ]);
            } else {
              writeLines(
                [
                  '',
                  `\x1b[31mNo results for "${searchQuery}"\x1b[0m`,
                  searchData.error ? `Error: ${searchData.error}` : '',
                  '',
                  '\x1b[33mTip:\x1b[0m Set GEMINI_API_KEY in backend/.env for AI search',
                  '',
                ].filter(Boolean)
              );
            }
          }
        } catch (searchErr) {
          // Backend not available - local only
          const localResults = Object.keys(asciiArtLibrary).filter((name) =>
            name.includes(searchQuery.toLowerCase())
          );

          if (localResults.length > 0) {
            writeLines([
              '',
              `\x1b[33mBackend offline - local results only:\x1b[0m`,
              '',
              ...localResults.map((r, i) => `  ${i + 1}. ${r}`),
              '',
            ]);
          } else {
            writeLines([
              '',
              '\x1b[31mBackend not running & no local matches.\x1b[0m',
              'Start backend: cd backend && npm run dev',
              '',
            ]);
          }
        }
        break;
      }

      case 'solve':
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[36m╔══ MATH SOLVER ══╗\x1b[0m',
            '',
            '\x1b[33mUsage:\x1b[0m solve <expression>',
            '',
            '\x1b[36mSupported operations:\x1b[0m',
            '  + - * /       Basic arithmetic',
            '  ^             Power (e.g., 2^3 = 8)',
            '  sqrt(x)       Square root',
            '  sin(x)        Sine (degrees)',
            '  cos(x)        Cosine (degrees)',
            '  tan(x)        Tangent (degrees)',
            '  log(x)        Log base 10',
            '  ln(x)         Natural log',
            '  abs(x)        Absolute value',
            '  pi            π = 3.14159...',
            '  e             e = 2.71828...',
            '',
            '\x1b[36mExamples:\x1b[0m',
            '  solve 2+2                → 4',
            '  solve sqrt(144)          → 12',
            '  solve 2^10               → 1024',
            '  solve sin(90)            → 1',
            '  solve pi*2               → 6.28318',
            '  solve (5+3)*2            → 16',
            '',
          ]);
        } else {
          const expr = args.join(' ');
          const result = evaluateMath(expr);
          writeLines([
            '',
            `  \x1b[36m${expr}\x1b[0m`,
            `  \x1b[33m=\x1b[0m \x1b[32m${result}\x1b[0m`,
            '',
          ]);
        }
        break;

      case 'physics':
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[36m╔════════════════════════════════════════════════════════════╗\x1b[0m',
            '\x1b[36m║                    PHYSICS CALCULATOR                      ║\x1b[0m',
            '\x1b[36m╠════════════════════════════════════════════════════════════╣\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mMECHANICS\x1b[0m                                                  \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   velocity <d> <t>         v = d/t                         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   acceleration <v> <u> <t> a = (v-u)/t                     \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   force <m> <a>            F = ma                          \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   momentum <m> <v>         p = mv                          \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   projectile <v> <angle>   Range, Height, Time             \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   freefall <h>             v = √(2gh), t = √(2h/g)         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   centripetal <m> <v> <r>  F = mv²/r                       \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   pendulum <L>             T = 2π√(L/g)                    \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mENERGY\x1b[0m                                                     \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   kinetic <m> <v>          KE = ½mv²                       \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   potential <m> <h>        PE = mgh                        \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   work <F> <d> [θ]         W = Fd·cos(θ)                   \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   power <W> <t>            P = W/t                         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mWAVES & ELECTRICITY\x1b[0m                                        \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   frequency <v> <λ>        f = v/λ                         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   ohm <I> <R>              V = IR                          \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mGRAVITATION\x1b[0m                                                \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   gravity <m1> <m2> <r>    F = Gm₁m₂/r²                    \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   escape <M> <r>           v = √(2GM/r)                    \x1b[36m║\x1b[0m',
            '\x1b[36m╚════════════════════════════════════════════════════════════╝\x1b[0m',
            '',
            '\x1b[33mExample:\x1b[0m physics projectile 20 45',
            '',
          ]);
        } else {
          const physType = args[0].toLowerCase();
          const physArgs = args.slice(1).map(Number);

          if (PHYSICS_FORMULAS[physType]) {
            const formula = PHYSICS_FORMULAS[physType];
            const result = formula.calc(physArgs);
            writeLines([
              '',
              `\x1b[36m${formula.name}\x1b[0m`,
              `Formula: \x1b[33m${formula.formula}\x1b[0m`,
              '',
              `\x1b[32m${result}\x1b[0m`,
              '',
            ]);
          } else {
            writeLine(`\x1b[31mUnknown physics calculation: ${physType}\x1b[0m`);
            writeLine('Type \x1b[33mphysics\x1b[0m to see all available formulas.\n');
          }
        }
        break;

      case 'chemistry':
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[36m╔════════════════════════════════════════════════════════════╗\x1b[0m',
            '\x1b[36m║                    CHEMISTRY TOOLS                         ║\x1b[0m',
            '\x1b[36m╠════════════════════════════════════════════════════════════╣\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mELEMENT LOOKUP\x1b[0m                                             \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   chemistry element <symbol>                               \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   Examples: chemistry element Fe                           \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m             chemistry element Au                           \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mMOLAR MASS\x1b[0m                                                 \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   chemistry molar <formula>                                \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   Examples: chemistry molar H2O     → 18.015 g/mol         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m             chemistry molar NaCl    → 58.44 g/mol          \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m             chemistry molar C6H12O6 → 180.16 g/mol         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m                                                            \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m \x1b[33mAVAILABLE ELEMENTS\x1b[0m                                         \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P,    \x1b[36m║\x1b[0m',
            '\x1b[36m║\x1b[0m   S, Cl, Ar, K, Ca, Fe, Cu, Zn, Ag, Au, Pb, U              \x1b[36m║\x1b[0m',
            '\x1b[36m╚════════════════════════════════════════════════════════════╝\x1b[0m',
            '',
          ]);
        } else if (args[0].toLowerCase() === 'element' && args[1]) {
          const symbol = args[1].toLowerCase();
          const el = ELEMENTS[symbol];
          if (el) {
            writeLines([
              '',
              `\x1b[36m╔══ ${el.name.toUpperCase()} (${args[1].toUpperCase()}) ══╗\x1b[0m`,
              '',
              `  Atomic Number:  \x1b[32m${el.number}\x1b[0m`,
              `  Atomic Mass:    \x1b[32m${el.mass} u\x1b[0m`,
              `  Category:       \x1b[33m${el.category}\x1b[0m`,
              '',
            ]);
          } else {
            writeLine(`\x1b[31mElement "${args[1]}" not found.\x1b[0m\n`);
          }
        } else if (args[0].toLowerCase() === 'molar' && args[1]) {
          const formula = args[1];
          const mass = calcMolarMass(formula);
          if (mass > 0) {
            writeLines([
              '',
              `\x1b[36mMolar Mass of ${formula}\x1b[0m`,
              `  \x1b[32m${mass.toFixed(3)} g/mol\x1b[0m`,
              '',
            ]);
          } else {
            writeLine(`\x1b[31mCould not parse formula: ${formula}\x1b[0m\n`);
          }
        } else {
          writeLine('\x1b[31mInvalid chemistry command. Type "chemistry" for help.\x1b[0m\n');
        }
        break;

      case 'clear':
        term.clear();
        break;

      case 'exit':
        setHologramMode(false);
        writeLine('\n\x1b[36mExited hologram mode.\x1b[0m\n');
        break;

      case 'about':
        writeLines([
          '',
          '\x1b[32m╔════════════════════════════════════════════════════════════╗\x1b[0m',
          '\x1b[32m║                    ASCII ORACLE v1.0.0                      ║\x1b[0m',
          '\x1b[32m╠════════════════════════════════════════════════════════════╣\x1b[0m',
          '\x1b[32m║\x1b[0m                                                            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m  A retro-futuristic terminal for:                         \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • ASCII Art generation & display                       \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • Image/Video to ASCII conversion                      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • Interactive 3D hologram visualization                \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • Mathematical computations                            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • Physics calculations                                 \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    • Chemistry tools                                      \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m  Built with:                                              \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    React 18 • TypeScript • Three.js • xterm.js            \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m    Node.js • Express • Sharp                              \x1b[32m║\x1b[0m',
          '\x1b[32m║\x1b[0m                                                            \x1b[32m║\x1b[0m',
          '\x1b[32m╚════════════════════════════════════════════════════════════╝\x1b[0m',
          '',
        ]);
        break;

      case 'version':
        writeLine('\n\x1b[32mASCII Oracle v1.0.0\x1b[0m\n');
        break;

      case 'generate':
      case 'gen': {
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[35m╔══ AI ASCII ART GENERATOR ══╗\x1b[0m',
            '',
            '\x1b[33mUsage:\x1b[0m generate <description>',
            '',
            '\x1b[36mExamples:\x1b[0m',
            '  generate a cute cat',
            '  generate spaceship',
            '  generate dragon breathing fire',
            '  generate pikachu',
            '',
            '\x1b[33mNote:\x1b[0m Requires GEMINI_API_KEY in backend/.env',
            '',
          ]);
          break;
        }

        const genDescription = args.join(' ');
        writeLine(`\n\x1b[35m🤖 Generating ASCII art for "${genDescription}"...\x1b[0m`);
        writeLine('\x1b[33mThis may take a few seconds...\x1b[0m\n');

        try {
          const genResponse = await fetch('/api/search/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: genDescription }),
          });
          const genData = await genResponse.json();

          if (genData.success && genData.art) {
            writeLine('\x1b[32m═══════ AI Generated Art ═══════\x1b[0m');
            genData.art.split('\n').forEach((line: string) => {
              writeLine('\x1b[32m' + line + '\x1b[0m');
            });
            writeLine('\x1b[32m════════════════════════════════\x1b[0m');
            writeLine('');
            triggerPowerUp('star', 'AI Art Generated!');
            onSound('powerup');
          } else {
            writeLines([
              '',
              '\x1b[31mFailed to generate art.\x1b[0m',
              genData.error || 'Unknown error',
              '',
              '\x1b[33mMake sure:\x1b[0m',
              '  1. Backend is running (npm run dev)',
              '  2. GEMINI_API_KEY is set in backend/.env',
              '',
            ]);
          }
        } catch (genErr) {
          writeLines([
            '',
            '\x1b[31mBackend not available.\x1b[0m',
            'Start the backend: cd backend && npm run dev',
            '',
          ]);
        }
        break;
      }

      case 'ask':
      case 'ai': {
        if (!args[0]) {
          writeLines([
            '',
            '\x1b[35m╔══ AI ASSISTANT ══╗\x1b[0m',
            '',
            '\x1b[33mUsage:\x1b[0m ask <question>',
            '',
            '\x1b[36mExamples:\x1b[0m',
            '  ask what is the speed of light',
            '  ask explain quantum entanglement',
            '  ask how do black holes form',
            '',
          ]);
          break;
        }

        const aiQuestion = args.join(' ');
        writeLine(`\n\x1b[35m🤖 Thinking...\x1b[0m\n`);

        try {
          const aiResponse = await fetch('/api/search/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: aiQuestion, context: 'general science' }),
          });
          const aiData = await aiResponse.json();

          if (aiData.success && aiData.explanation) {
            writeLine('\x1b[36m─────────────────────────────────\x1b[0m');
            aiData.explanation.split('\n').forEach((line: string) => {
              writeLine(line);
            });
            writeLine('\x1b[36m─────────────────────────────────\x1b[0m');
            writeLine('');
          } else {
            writeLine('\x1b[31mCould not get AI response.\x1b[0m');
            writeLine(aiData.error || '');
            writeLine('');
          }
        } catch {
          writeLine('\x1b[31mBackend not available for AI queries.\x1b[0m\n');
        }
        break;
      }

      case '':
        break;

      default:
        writeLines([
          '',
          `\x1b[31mUnknown command: ${command}\x1b[0m`,
          'Type \x1b[33mhelp\x1b[0m for available commands.',
          '',
        ]);
        onSound('error');
    }

    printPrompt();
  };

  useEffect(() => {
    if (!termRef.current || xtermRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#0a0a1a',
        foreground: '#00ff88',
        cursor: '#00ff88',
        cursorAccent: '#0a0a1a',
        black: '#0f0f1a',
        red: '#ff6b6b',
        green: '#00ff88',
        yellow: '#ffd700',
        blue: '#00d4ff',
        magenta: '#ff88ff',
        cyan: '#00ffff',
        white: '#ffffff',
      },
      fontFamily: '"Fira Code", "Cascadia Code", "Consolas", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 2000,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch {
        // Ignore fit errors (terminal may not be visible yet)
      }

      // Epic welcome banner
      term.writeln('\x1b[36m');
      term.writeln('    ╔═══════════════════════════════════════════════════════════════╗');
      term.writeln('    ║                                                               ║');
      term.writeln(
        '    ║   \x1b[32m█████╗ ███████╗ ██████╗██╗██╗     ██████╗ ██████╗  █████╗\x1b[36m  ║'
      );
      term.writeln(
        '    ║  \x1b[32m██╔══██╗██╔════╝██╔════╝██║██║    ██╔═══██╗██╔══██╗██╔══██╗\x1b[36m ║'
      );
      term.writeln(
        '    ║  \x1b[32m███████║███████╗██║     ██║██║    ██║   ██║██████╔╝███████║\x1b[36m ║'
      );
      term.writeln(
        '    ║  \x1b[32m██╔══██║╚════██║██║     ██║██║    ██║   ██║██╔══██╗██╔══██║\x1b[36m ║'
      );
      term.writeln(
        '    ║  \x1b[32m██║  ██║███████║╚██████╗██║██║    ╚██████╔╝██║  ██║██║  ██║\x1b[36m ║'
      );
      term.writeln(
        '    ║  \x1b[32m╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝\x1b[36m ║'
      );
      term.writeln('    ║                                                               ║');
      term.writeln(
        '    ║           \x1b[33m★ ORACLE ★\x1b[36m   \x1b[37mRetro Terminal Experience\x1b[36m            ║'
      );
      term.writeln('    ║                                                               ║');
      term.writeln('    ╚═══════════════════════════════════════════════════════════════╝\x1b[0m');
      term.writeln('');
      term.writeln(
        '  \x1b[37mWelcome to ASCII Oracle - Your portal to retro computing magic!\x1b[0m'
      );
      term.writeln('');
      term.writeln('  \x1b[36mQuick Start:\x1b[0m');
      term.writeln('    • Type \x1b[33mhelp\x1b[0m to see all commands');
      term.writeln('    • Try \x1b[33mdraw mario\x1b[0m for ASCII art');
      term.writeln('    • Try \x1b[33mhologram cube\x1b[0m for 3D visualization');
      term.writeln('    • Try \x1b[33msolve sqrt(144)\x1b[0m for math');
      term.writeln('');
      printPrompt();
      term.focus();
    }, 100);

    // Key handler
    term.onKey(({ key, domEvent }) => {
      const ev = domEvent;

      if (ev.key === 'Enter') {
        term.writeln('');
        const cmd = inputRef.current.trim();
        inputRef.current = '';
        if (cmd) {
          historyRef.current.push(cmd);
          historyIndexRef.current = historyRef.current.length;
          executeCommand(cmd);
        } else {
          printPrompt();
        }
      } else if (ev.key === 'Backspace') {
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (ev.key === 'ArrowUp') {
        if (historyRef.current.length > 0 && historyIndexRef.current > 0) {
          historyIndexRef.current--;
          clearLine();
          inputRef.current = historyRef.current[historyIndexRef.current];
          term.write(inputRef.current);
        }
      } else if (ev.key === 'ArrowDown') {
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current++;
          clearLine();
          inputRef.current = historyRef.current[historyIndexRef.current];
          term.write(inputRef.current);
        } else if (historyIndexRef.current === historyRef.current.length - 1) {
          historyIndexRef.current++;
          clearLine();
          inputRef.current = '';
        }
      } else if (ev.key === 'Escape') {
        setHologramMode(false);
      } else if (!ev.altKey && !ev.ctrlKey && !ev.metaKey && key.length === 1) {
        inputRef.current += key;
        term.write(key);
      }
    });

    // Paste
    term.onData((data) => {
      if (data.length > 1 && !data.includes('\x1b') && !data.includes('\r')) {
        inputRef.current += data;
        term.write(data);
      }
    });

    // Resize
    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch {
        // Ignore fit errors (terminal may not be visible yet)
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '450px',
        backgroundColor: '#0a0a1a',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
      onClick={() => xtermRef.current?.focus()}
    >
      <div
        ref={termRef}
        style={{
          width: '100%',
          height: '100%',
          padding: '8px',
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Terminal;
