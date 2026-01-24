/**
 * ASCII Oracle - Command Executor
 */

import { asciiArtLibrary } from './asciiArt';
import { CommandResult, isValidCommand, ParsedCommand } from './commandParser';

interface ExecutorContext {
  setHologramMode: (mode: boolean) => void;
  setHologramData: (data: unknown) => void;
  triggerPowerUp: (type: string, message: string) => void;
}

// Main executor function
export const executeCommand = async (
  parsed: ParsedCommand,
  context: ExecutorContext
): Promise<CommandResult> => {
  const { command, args, flags } = parsed;

  if (!command) {
    return { success: true, output: '', type: 'info' };
  }

  if (!isValidCommand(command)) {
    return {
      success: false,
      output: `Unknown command: ${command}\nType "help" for available commands.`,
      type: 'error',
    };
  }

  switch (command) {
    case 'help':
      return executeHelp(args);
    case 'draw':
      return executeDraw(args, flags);
    case 'upload':
      return executeUpload(args);
    case 'hologram':
      return executeHologram(args, context);
    case 'solve':
      return executeSolve(args);
    case 'physics':
      return executePhysics(args);
    case 'chemistry':
      return executeChemistry(args);
    case 'search':
      return executeSearch(args);
    case 'clear':
      return { success: true, output: '', type: 'info', clear: true };
    case 'exit':
      context.setHologramMode(false);
      return { success: true, output: 'Exited 3D mode', type: 'info' };
    case 'about':
      return executeAbout();
    case 'version':
      return { success: true, output: 'ASCII Oracle v1.0.0', type: 'info' };
    default:
      return { success: false, output: 'Command not implemented', type: 'error' };
  }
};

// Help command
const executeHelp = (args: string[]): CommandResult => {
  if (args.length > 0) {
    const cmd = args[0].toLowerCase();
    const helpTexts: Record<string, string> = {
      draw: `DRAW - Display ASCII art

Usage: draw <name> [--animate] [--list]

Examples:
  draw cat          Show cat art
  draw mario        Show Mario art
  draw --list       List all available art

Available: cat, dog, mario, mushroom, star, heart, ghost, skull, tree, rocket`,

      upload: `UPLOAD - Convert image to ASCII

Usage: upload image

This will open a file picker to select an image.`,

      hologram: `HOLOGRAM - 3D visualizations

Usage: hologram <type>

Types: cube, sphere, text, particles, wave`,

      solve: `SOLVE - Math solver

Usage: solve <expression>

Examples:
  solve 2+2
  solve sqrt(16)
  solve 5*5`,

      search: `SEARCH - Search for ASCII art

Usage: search <query>

Examples:
  search dragon
  search space ship`,
    };

    return {
      success: true,
      output: helpTexts[cmd] || `No help available for: ${cmd}`,
      type: 'info',
    };
  }

  return {
    success: true,
    output: `ASCII ORACLE - Available Commands

  help [cmd]     Show help
  draw <name>    Display ASCII art (try: draw cat)
  draw --list    List all ASCII art
  upload image   Convert image to ASCII
  hologram cube  3D visualization
  solve <expr>   Math calculations
  search <query> Search ASCII art online
  clear          Clear screen
  about          About this app
  version        Show version

Type "help <command>" for more details.`,
    type: 'info',
  };
};

// Draw command - FIXED to join array
const executeDraw = (args: string[], flags: Record<string, string | boolean>): CommandResult => {
  // List all available art
  if (flags.list || flags.l) {
    const available = Object.keys(asciiArtLibrary);
    return {
      success: true,
      output: `Available ASCII art (${available.length}):\n\n${available.join(', ')}`,
      type: 'info',
    };
  }

  if (args.length === 0) {
    return {
      success: false,
      output: 'Usage: draw <name>\nExample: draw cat\nUse "draw --list" to see all available art.',
      type: 'error',
    };
  }

  const artName = args[0].toLowerCase();
  const artLines = asciiArtLibrary[artName];

  if (!artLines) {
    const available = Object.keys(asciiArtLibrary).slice(0, 10).join(', ');
    return {
      success: false,
      output: `Art "${artName}" not found.\n\nAvailable: ${available}...\n\nUse "draw --list" for full list.`,
      type: 'error',
    };
  }

  // Join array into string with newlines
  const artString = artLines.join('\n');

  return {
    success: true,
    output: `\n${artString}\n`,
    type: 'ascii',
    powerUp: 'star',
    powerUpMessage: `Drew ${artName}!`,
  };
};

// Upload command
const executeUpload = (args: string[]): CommandResult => {
  const type = args[0] || 'image';

  if (type !== 'image' && type !== 'video') {
    return {
      success: false,
      output: 'Usage: upload image\n       upload video',
      type: 'error',
    };
  }

  // Return special flag to trigger file picker
  return {
    success: true,
    output: `Opening ${type} picker... Select a file to convert to ASCII.`,
    type: 'info',
    triggerUpload: type as 'image' | 'video',
  };
};

// Hologram command
const executeHologram = (args: string[], context: ExecutorContext): CommandResult => {
  const type = args[0] || 'cube';
  const validTypes = ['cube', 'sphere', 'text', 'particles', 'wave', 'dna'];

  if (!validTypes.includes(type)) {
    return {
      success: false,
      output: `Invalid hologram type: ${type}\n\nAvailable: ${validTypes.join(', ')}`,
      type: 'error',
    };
  }

  context.setHologramData({ type, text: args[1] || 'HELLO' });
  context.setHologramMode(true);

  return {
    success: true,
    output: `Entering 3D mode: ${type}\nPress ESC or type "exit" to return.`,
    type: 'info',
    powerUp: 'mushroom',
    powerUpMessage: '3D Mode Activated!',
  };
};

// Solve command - basic math
const executeSolve = async (args: string[]): Promise<CommandResult> => {
  if (args.length === 0) {
    return {
      success: false,
      output: 'Usage: solve <expression>\nExample: solve 2+2',
      type: 'error',
    };
  }

  const expression = args.join(' ');

  try {
    // Try backend first
    const response = await fetch('/api/math/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        output: `Expression: ${expression}\nResult: ${data.result}`,
        type: 'info',
      };
    }
  } catch (e) {
    // Backend not available, try basic eval
  }

  // Fallback: basic math evaluation
  try {
    // Only allow safe math characters
    const sanitized = expression.replace(/[^0-9+\-*/().sqrt\s]/g, '');
    const result = Function('"use strict"; return (' + sanitized + ')')();
    return {
      success: true,
      output: `${expression} = ${result}`,
      type: 'info',
    };
  } catch (e) {
    return {
      success: false,
      output: `Could not evaluate: ${expression}`,
      type: 'error',
    };
  }
};

// Physics command
const executePhysics = async (args: string[]): Promise<CommandResult> => {
  if (args.length === 0) {
    return {
      success: true,
      output: `PHYSICS Calculator

Available calculations:
  physics projectile <velocity> <angle>
  physics freefall <height>
  physics momentum <mass> <velocity>

Example: physics projectile 20 45`,
      type: 'info',
    };
  }

  const calcType = args[0].toLowerCase();

  if (calcType === 'projectile' && args.length >= 3) {
    const v = parseFloat(args[1]);
    const angle = parseFloat(args[2]) * (Math.PI / 180);
    const g = 9.81;
    const range = (v * v * Math.sin(2 * angle)) / g;
    const maxHeight = (v * v * Math.sin(angle) * Math.sin(angle)) / (2 * g);
    const time = (2 * v * Math.sin(angle)) / g;

    return {
      success: true,
      output: `Projectile Motion (v=${args[1]}m/s, θ=${args[2]}°)

Range: ${range.toFixed(2)} m
Max Height: ${maxHeight.toFixed(2)} m
Flight Time: ${time.toFixed(2)} s`,
      type: 'info',
    };
  }

  if (calcType === 'freefall' && args.length >= 2) {
    const h = parseFloat(args[1]);
    const g = 9.81;
    const time = Math.sqrt((2 * h) / g);
    const velocity = g * time;

    return {
      success: true,
      output: `Free Fall (h=${h}m)

Time to ground: ${time.toFixed(2)} s
Final velocity: ${velocity.toFixed(2)} m/s`,
      type: 'info',
    };
  }

  return {
    success: false,
    output: 'Invalid physics calculation. Type "physics" for help.',
    type: 'error',
  };
};

// Chemistry command
const executeChemistry = async (args: string[]): Promise<CommandResult> => {
  if (args.length === 0) {
    return {
      success: true,
      output: `CHEMISTRY Tools

Available commands:
  chemistry element <symbol>   Element info
  chemistry molar <formula>    Molar mass

Example: chemistry element Fe`,
      type: 'info',
    };
  }

  const subCmd = args[0].toLowerCase();

  if (subCmd === 'element' && args[1]) {
    const elements: Record<string, string> = {
      h: 'Hydrogen (H) - Atomic #1, Mass: 1.008',
      he: 'Helium (He) - Atomic #2, Mass: 4.003',
      c: 'Carbon (C) - Atomic #6, Mass: 12.011',
      n: 'Nitrogen (N) - Atomic #7, Mass: 14.007',
      o: 'Oxygen (O) - Atomic #8, Mass: 15.999',
      fe: 'Iron (Fe) - Atomic #26, Mass: 55.845',
      au: 'Gold (Au) - Atomic #79, Mass: 196.967',
      ag: 'Silver (Ag) - Atomic #47, Mass: 107.868',
    };

    const el = args[1].toLowerCase();
    return {
      success: true,
      output: elements[el] || `Element "${args[1]}" not in database.`,
      type: 'info',
    };
  }

  return {
    success: false,
    output: 'Invalid chemistry command. Type "chemistry" for help.',
    type: 'error',
  };
};

// Search command
const executeSearch = async (args: string[]): Promise<CommandResult> => {
  if (args.length === 0) {
    return {
      success: false,
      output: 'Usage: search <query>\nExample: search dragon',
      type: 'error',
    };
  }

  const query = args.join(' ');

  try {
    const response = await fetch(`/api/search/web?q=${encodeURIComponent(query)}`);

    if (response.ok) {
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        let output = `Search: "${query}"\n\n`;

        if (result.asciiArt) {
          output += result.asciiArt + '\n\n';
        }

        output += `Found: ${result.title || result.name}\n`;
        if (result.description) {
          output += result.description;
        }

        return { success: true, output, type: 'info' };
      }
    }
  } catch (e) {
    // Backend not available
  }

  // Fallback: check local library
  const found = Object.keys(asciiArtLibrary).filter((name) => name.includes(query.toLowerCase()));

  if (found.length > 0) {
    return {
      success: true,
      output: `Found in local library: ${found.join(', ')}\n\nUse "draw ${found[0]}" to display.`,
      type: 'info',
    };
  }

  return {
    success: true,
    output: `No results for "${query}". Try "draw --list" for local art.`,
    type: 'info',
  };
};

// About command
const executeAbout = (): CommandResult => {
  return {
    success: true,
    output: `
╔═══════════════════════════════════════╗
║         ASCII ORACLE v1.0.0           ║
╠═══════════════════════════════════════╣
║  A retro terminal for ASCII art,      ║
║  3D visualization, and math/science   ║
║                                       ║
║  Built with:                          ║
║  - React + TypeScript                 ║
║  - xterm.js                           ║
║  - Three.js                           ║
║  - Node.js + Express                  ║
╚═══════════════════════════════════════╝`,
    type: 'info',
  };
};
