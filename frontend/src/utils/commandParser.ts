/**
 * ASCII Oracle - Command Parser
 * Created by Light
 * Parses terminal input into structured commands using commander-like logic
 */

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
}

export interface CommandResult {
  success: boolean;
  output?: string | string[];
  type: 'info' | 'success' | 'error' | 'warning' | 'ascii' | 'math';
  clear?: boolean;
  powerUp?: string;
  powerUpMessage?: string;
  triggerUpload?: 'image' | 'video';
}

// Parse input string into command structure
export const parseCommand = (input: string): ParsedCommand => {
  const raw = input.trim();
  const parts = tokenize(raw);
  
  if (parts.length === 0) {
    return { command: '', args: [], flags: {}, raw };
  }

  const command = parts[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 1;
  while (i < parts.length) {
    const part = parts[i];
    
    // Long flag (--flag or --flag=value)
    if (part.startsWith('--')) {
      const flagPart = part.slice(2);
      
      if (flagPart.includes('=')) {
        const [key, value] = flagPart.split('=');
        flags[key] = value;
      } else if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        // Next part is the value
        flags[flagPart] = parts[i + 1];
        i++;
      } else {
        // Boolean flag
        flags[flagPart] = true;
      }
    }
    // Short flag (-f or -f value)
    else if (part.startsWith('-') && part.length === 2) {
      const flag = part.slice(1);
      
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        flags[flag] = parts[i + 1];
        i++;
      } else {
        flags[flag] = true;
      }
    }
    // Regular argument
    else {
      args.push(part);
    }
    
    i++;
  }

  return { command, args, flags, raw };
};

// Tokenize input respecting quotes
const tokenize = (input: string): string[] => {
  const tokens: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuote) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
};

// Validate command exists
export const isValidCommand = (command: string): boolean => {
  const validCommands = [
    'help',
    'draw',
    'upload',
    'hologram',
    'solve',
    'physics',
    'chemistry',
    'search',
    'clear',
    'exit',
    'about',
    'version',
  ];
  
  return validCommands.includes(command.toLowerCase());
};

// Get command suggestions for autocomplete
export const getSuggestions = (partial: string): string[] => {
  const commands = [
    'help',
    'draw cat',
    'draw heart --animate',
    'draw rainbow',
    'upload image',
    'upload video',
    'hologram cube',
    'hologram sphere',
    'hologram text "HELLO"',
    'solve integral x^2 dx',
    'solve equation x^2+5x+6=0',
    'physics projectile --velocity 20 --angle 45',
    'chemistry balance H2+O2->H2O',
    'search mario ascii art',
    'clear',
    'exit',
  ];

  return commands.filter((cmd) => 
    cmd.toLowerCase().startsWith(partial.toLowerCase())
  );
};
