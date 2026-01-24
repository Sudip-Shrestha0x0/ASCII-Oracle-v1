/**
 * ASCII Art Routes
 * Serves pre-built ASCII art and generates custom ASCII patterns
 * Includes animated ASCII sequences
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Large ASCII art collection with animations
const ASCII_LIBRARY: Record<string, { art: string; animated?: string[]; category: string }> = {
  // Animals
  cat: {
    category: 'animals',
    art: `
  /\\_/\\  
 ( o.o ) 
  > ^ <
 /|   |\\
(_|   |_)`,
    animated: [
      `
  /\\_/\\  
 ( o.o ) 
  > ^ <
 /|   |\\
(_|   |_)`,
      `
  /\\_/\\  
 ( -.- ) 
  > ^ <
 /|   |\\
(_|   |_)`,
      `
  /\\_/\\  
 ( o.o ) 
  > ^ <
 /|   |\\
(_|   |_)`
    ]
  },
  dog: {
    category: 'animals',
    art: `
    / \\__
   (    @\\___
   /         O
  /   (_____/
 /_____/   U`
  },
  fish: {
    category: 'animals',
    art: `><((('>`,
    animated: [
      `><((('>`,
      ` ><((('>`,
      `  ><((('>`,
      `   ><((('>`,
      `  ><((('>`,
      ` ><((('>`,
      `><((('>`
    ]
  },
  bird: {
    category: 'animals',
    art: `
      \\
   ___( o)>
   \\ <_. )
    \`---'`
  },
  butterfly: {
    category: 'animals',
    art: `
 ,_  _,
 |\\\\//|
 | || |
 | || |
 |//\\\\|
 '  ' '`
  },
  // Objects
  computer: {
    category: 'objects',
    art: `
   .--------.
   |.------.|
   ||      ||
   ||      ||
   |'------'|
   '--------'
  / ________ \\
 / |  ____  | \\
(___|______|___)`
  },
  coffee: {
    category: 'objects',
    art: `
      ) )
     (_(
   c|   |
     \\__/`,
    animated: [
      `
      ) )
     (_(
   c|   |
     \\__/`,
      `
     ) ) )
     (_(
   c|   |
     \\__/`,
      `
    ) ) ) )
     (_(
   c|   |
     \\__/`,
      `
     ) ) )
     (_(
   c|   |
     \\__/`
    ]
  },
  rocket: {
    category: 'objects',
    art: `
      /\\
     /  \\
    |    |
    |    |
    |NASA|
    |    |
   /|    |\\
  / |    | \\
 /__|    |__\\
    |__|
    /  \\
   /    \\
  (______)`
  },
  tv: {
    category: 'objects',
    art: `
 ___________
|  _______  |
| |       | |
| |       | |
| |_______| |
|___________|
 [_] === [_]`
  },
  // Nature
  tree: {
    category: 'nature',
    art: `
       *
      /|\\
     /*|*\\
    /--|--\\
   /*--|--*\\
  /----+----\\
       |
       |`
  },
  sun: {
    category: 'nature',
    art: `
       \\   |   /
        \\  |  /
    --- (  .  ) ---
        /  |  \\
       /   |   \\`
  },
  moon: {
    category: 'nature',
    art: `
       _..._
     .:::::::.
    :::::::::::
    :::::::::::
    '::::::::'
      '::::'`
  },
  star: {
    category: 'nature',
    art: `
       *
      ***
     *****
***************
 *************
  ***********
   *********
  ***   ***
 **       **`,
    animated: [
      `
       *
      ***
     *****
***************
 *************
  ***********
   *********
  ***   ***
 **       **`,
      `
       .
      .*.
     ..*..
..............
 ............
  ..........
   ........
  ...   ...
 ..       ..`,
      `
       *
      ***
     *****
***************
 *************
  ***********
   *********
  ***   ***
 **       **`
    ]
  },
  flower: {
    category: 'nature',
    art: `
     _(_)_
    (_)@(_)
      (_)
       |
      \\|/
       |`
  },
  // Symbols
  heart: {
    category: 'symbols',
    art: `
   ♥♥♥   ♥♥♥
  ♥♥♥♥♥ ♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥
     ♥♥♥♥♥
      ♥♥♥
       ♥`,
    animated: [
      `
   ♥♥   ♥♥
  ♥♥♥♥ ♥♥♥♥
  ♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥
    ♥♥♥♥♥
     ♥♥♥
      ♥`,
      `
   ♥♥♥   ♥♥♥
  ♥♥♥♥♥ ♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥
     ♥♥♥♥♥
      ♥♥♥
       ♥`,
      `
   ♥♥   ♥♥
  ♥♥♥♥ ♥♥♥♥
  ♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥
    ♥♥♥♥♥
     ♥♥♥
      ♥`
    ]
  },
  music: {
    category: 'symbols',
    art: `
   ♪ ♫ ♪
  ♫     ♪
 ♪   ♫   ♫
  ♫ ♪ ♫ ♪
   ♪ ♫ ♪`
  },
  skull: {
    category: 'symbols',
    art: `
    _____
   /     \\
  | () () |
   \\  ^  /
    |||||
    |||||`
  },
  // Characters
  robot: {
    category: 'characters',
    art: `
   [####]
   |o  o|
   | == |
   |____|
  /|    |\\
 (_|    |_)
   ||  ||
   ()  ()`,
    animated: [
      `
   [####]
   |o  o|
   | == |
   |____|
  /|    |\\
 (_|    |_)
   ||  ||
   ()  ()`,
      `
   [####]
   |O  O|
   | == |
   |____|
  /|    |\\
 (_|    |_)
   ||  ||
   ()  ()`,
      `
   [####]
   |o  o|
   | == |
   |____|
  /|    |\\
 (_|    |_)
   ||  ||
   ()  ()`
    ]
  },
  wizard: {
    category: 'characters',
    art: `
      /\\
     /  \\
    /____\\
    |o  o|
    | <> |
    |_/\\_|
   /|    |\\
  (_|    |_)`
  },
  ghost: {
    category: 'characters',
    art: `
     .-.
    (o o)
   |  O  |
   | ' ' |
   |,,,,,|`,
    animated: [
      `
     .-.
    (o o)
   |  O  |
   | ' ' |
   |,,,,,|`,
      `
     .-.
    (- -)
   |  o  |
   | ' ' |
   |'''''|`,
      `
     .-.
    (o o)
   |  O  |
   | ' ' |
   |,,,,,|`
    ]
  },
  alien: {
    category: 'characters',
    art: `
     .--.
    (o  o)
   /|    |\\
  //|    |\\\\
 // |    | \\\\
    '--'`
  },
  pikachu: {
    category: 'characters',
    art: `
   /\\  /\\
  /  \\/  \\
 ( ●   ● )
  \\  <>  /
   '----'`
  },
  mario: {
    category: 'characters',
    art: `
     ████
    ██████
    ▓▓█▓█
   ▓█▓▓▓█▓▓
   ▓█▓▓█▓▓▓
    ▓▓▓▓▓
     █████
    ██ ██`
  },
  pacman: {
    category: 'characters',
    art: `
 ████████
██████████
██████  ██
████████████
████████████
████████████
 ██████████
  ████████`,
    animated: [
      `████████
██████████
██████  ██
████████████
████████████
████████████
 ██████████
  ████████`,
      `████████
██████████
███████ ██
██████████
██████████
██████████
 ██████████
  ████████`,
      `████████
██████████
██████████
██████████
██████████
██████████
 ██████████
  ████████`,
      `████████
██████████
███████ ██
██████████
██████████
██████████
 ██████████
  ████████`
    ]
  },
  // Text banners
  welcome: {
    category: 'banners',
    art: `
╔═══════════════════════════════════════════╗
║                                           ║
║   █   █ █████ █     █████ █████ █   █ █████║
║   █   █ █     █     █     █   █ ██ ██ █    ║
║   █ █ █ ███   █     █     █   █ █ █ █ ███  ║
║   ██ ██ █     █     █     █   █ █   █ █    ║
║   █   █ █████ █████ █████ █████ █   █ █████║
║                                           ║
╚═══════════════════════════════════════════╝`
  },
  oracle: {
    category: 'banners',
    art: `
   ___   _____ _____ _____  _____   
  / _ \\ /  ___|  __ \\_   _||_   _|  
 / /_\\ \\\\ \`--.| /  \\/ | |    | |    
 |  _  | \`--. \\ |     | |    | |    
 | | | |/\\__/ / \\__/\\_| |_  _| |_   
 \\_| |_/\\____/ \\____/\\___/  \\___/   
                                    
 ╔═════════════════════════════════╗
 ║     O R A C L E  R E A D Y      ║
 ╚═════════════════════════════════╝`
  },
  divider: {
    category: 'banners',
    art: `
════════════════════════════════════════════`
  },
  box: {
    category: 'banners',
    art: `
╔═══════════════════════════════════════════╗
║                                           ║
║                                           ║
║                                           ║
╚═══════════════════════════════════════════╝`
  }
};

// Get ASCII art by name
router.get('/art/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const { animated = 'false' } = req.query;
  
  const art = ASCII_LIBRARY[name.toLowerCase()];
  
  if (art) {
    res.json({
      success: true,
      name,
      category: art.category,
      art: art.art,
      animated: animated === 'true' && art.animated ? art.animated : undefined,
      hasAnimation: !!art.animated
    });
  } else {
    res.status(404).json({
      error: 'ASCII art not found',
      available: Object.keys(ASCII_LIBRARY)
    });
  }
});

// List all ASCII art
router.get('/list', (_req: Request, res: Response) => {
  const grouped: Record<string, string[]> = {};
  
  for (const [name, data] of Object.entries(ASCII_LIBRARY)) {
    if (!grouped[data.category]) {
      grouped[data.category] = [];
    }
    grouped[data.category].push(name);
  }
  
  res.json({
    success: true,
    total: Object.keys(ASCII_LIBRARY).length,
    categories: grouped,
    all: Object.keys(ASCII_LIBRARY)
  });
});

// Get art by category
router.get('/category/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  
  const matches = Object.entries(ASCII_LIBRARY)
    .filter(([_, data]) => data.category === category)
    .map(([name, data]) => ({
      name,
      art: data.art,
      hasAnimation: !!data.animated
    }));
  
  if (matches.length > 0) {
    res.json({
      success: true,
      category,
      count: matches.length,
      art: matches
    });
  } else {
    res.status(404).json({
      error: 'Category not found',
      availableCategories: [...new Set(Object.values(ASCII_LIBRARY).map(a => a.category))]
    });
  }
});

// Generate text banner
router.post('/banner', (req: Request, res: Response) => {
  try {
    const { text, style = 'simple' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const upperText = text.toUpperCase().slice(0, 30);
    let banner: string;
    
    switch (style) {
      case 'box':
        const padding = Math.max(0, 40 - upperText.length) / 2;
        banner = `
╔${'═'.repeat(42)}╗
║${' '.repeat(Math.floor(padding))}${upperText}${' '.repeat(Math.ceil(padding))}║
╚${'═'.repeat(42)}╝`;
        break;
      case 'double':
        banner = `
╔${'═'.repeat(upperText.length + 4)}╗
║  ${upperText}  ║
╠${'═'.repeat(upperText.length + 4)}╣
║  ${upperText}  ║
╚${'═'.repeat(upperText.length + 4)}╝`;
        break;
      case 'simple':
      default:
        banner = `
${'═'.repeat(upperText.length + 4)}
  ${upperText}  
${'═'.repeat(upperText.length + 4)}`;
    }
    
    res.json({
      success: true,
      text: upperText,
      style,
      banner
    });
  } catch (error) {
    console.error('Banner generation error:', error);
    res.status(500).json({ error: 'Failed to generate banner' });
  }
});

// Random ASCII art
router.get('/random', (_req: Request, res: Response) => {
  const names = Object.keys(ASCII_LIBRARY);
  const randomName = names[Math.floor(Math.random() * names.length)];
  const art = ASCII_LIBRARY[randomName];
  
  res.json({
    success: true,
    name: randomName,
    category: art.category,
    art: art.art,
    hasAnimation: !!art.animated
  });
});

export default router;
