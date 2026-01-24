/**
 * Search Routes
 * Handles web searches for ASCII art and related content
 * Uses Gemini AI with grounding for intelligent search, with fallback to local database
 */

import { Router, Request, Response } from 'express';
import { geminiService } from '../services/geminiService.js';

const router = Router();

// ASCII art database (curated collection - used as fallback)
const ASCII_ART_DB: Record<string, string> = {
  cat: `
  /\\_/\\  
 ( o.o ) 
  > ^ <
 /|   |\\
(_|   |_)`,
  dog: `
    / \\__
   (    @\\___
   /         O
  /   (_____/
 /_____/   U`,
  heart: `
   ♥♥♥   ♥♥♥
  ♥♥♥♥♥ ♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥
     ♥♥♥♥♥
      ♥♥♥
       ♥`,
  star: `
       *
      ***
     *****
***************
 *************
  ***********
   *********
  ***   ***
 **       **`,
  skull: `
    _____
   /     \\
  | () () |
   \\  ^  /
    |||||
    |||||`,
  robot: `
   [####]
   |o  o|
   | == |
   |____|
  /|    |\\
 (_|    |_)
   ||  ||
   ()  ()`,
  rocket: `
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
  (______)`,
  tree: `
       *
      /|\\
     /*|*\\
    /--|--\\
   /*--|--*\\
  /----+----\\
       |
       |`,
  fish: `
   ><((('>
  ><(((('>
   ><((('>`,
  bird: `
      \\
   ___( o)>
   \\ <_. )
    \`---'`,
  coffee: `
      ) )
     (_(
   c|   |
     \\__/`,
  computer: `
   .--------.
   |.------.|
   ||      ||
   ||      ||
   |'------'|
   '--------'
  / ________ \\
 / |  ____  | \\
(___|______|___)`,
  music: `
   ♪ ♫ ♪
  ♫     ♪
 ♪   ♫   ♫
  ♫ ♪ ♫ ♪
   ♪ ♫ ♪`,
  moon: `
       _..._
     .:::::::.
    :::::::::::
    :::::::::::
    '::::::::'
      '::::'`,
  sun: `
       \\   |   /
        \\  |  /
    --- (  .  ) ---
        /  |  \\
       /   |   \\`,
  ghost: `
     .-.
    (o o)
   |  O  |
   | ' ' |
   |,,,,,|`,
  alien: `
     .--.
    (o  o)
   /|    |\\
  //|    |\\\\
 // |    | \\\\
    '--'`,
  pikachu: `
   /\\  /\\
  /  \\/  \\
 ( ●   ● )
  \\  <>  /
   '----'`,
  mario: `
     ████
    ██████
    ▓▓█▓█
   ▓█▓▓▓█▓▓
   ▓█▓▓█▓▓▓
    ▓▓▓▓▓
     █████
    ██ ██`,
  pacman: `
   ████████
  ██████████
 ██████  ████
 ████████████
 ████████████
 ████████████
  ██████████
   ████████`,
  wizard: `
      /\\
     /  \\
    /____\\
    |o  o|
    | <> |
    |_/\\_|
   /|    |\\
  (_|    |_)`,
  dragon: `
              __                  __
   ______    /\\ \\                /\\ \\
  /\\  _  \\   \\ \\ \\___    ____    \\_\\ \\
  \\ \\ \\_\\ \\   \\ \\  _ \`\\ /  _ \`\\  /  _ \`\\
   \\ \\  __ \\   \\ \\ \\ \\ \\\\/\\ \\_\\ \\/\\ \\_\\ \\
    \\ \\_\\ \\_\\   \\ \\_\\ \\_\\ \\____ \\ \\___,_\\
     \\/_/\\/_/    \\/_/\\/_/\\/___/\\ \\/___/_/
                            \\_\\ \\
                            /\\____/
                            \\_/__/`,
  sword: `
        /\\
       /  \\
      /    \\
     /      \\
    /   ||   \\
        ||
        ||
      [====]
        ||
        ||
       /__\\`,
  shield: `
    .--------.
   /          \\
  /   .-==-.   \\
 |   /      \\   |
 |   | HERO |   |
 |   \\      /   |
  \\   '-==-'   /
   \\          /
    '--------'`,
  crown: `
    .·:*¨¨*:·.
   .: M   M :.
   :  A   A  :
  ·   J   J   ·
  *   E   E   *
  :   S   S   :
  ·   T   T   ·
  *   Y   Y   *
   '-========='-`,
  lightning: `
      __
     / /
    / /
   / /___
  /_____/
    / /
   / /
  /_/`,
  mushroom: `
     .-==-. 
   .'  ()  '.
  /   .''.   \\
 ;   ; ** ;   ;
 |   '.  .'   |
  \\    ''    /
   '.______.'
     |    |
     |    |
    /______\\`,
  diamond: `
     /\\
    /  \\
   /    \\
  /      \\
  \\      /
   \\    /
    \\  /
     \\/`,
  key: `
    .---.
   / o o \\
   |  ^  |
   '-----'
      |
      |
    --|--
      |
      |`,
  trophy: `
    ___________
   '._==_==_=_.'
   .-\\:      /-.
  | (|:.     |) |
   '-|:.     |-'
     \\::.    /
      '::. .'
        ) (
      _.' '._
     '-------'`,
  gameboy: `
   .---------.
   |  .---.  |
   |  |   |  |
   |  '---'  |
   |  o   o  |
   | .-----. |
   | | === | |
   | '-----' |
   '---------'`
};

// Search ASCII art database (local)
router.get('/ascii', async (req: Request, res: Response) => {
  try {
    const { query, limit = '10' } = req.query;
    
    if (!query || typeof query !== 'string') {
      // Return all available art
      res.json({
        success: true,
        results: Object.keys(ASCII_ART_DB).map(name => ({
          name,
          preview: ASCII_ART_DB[name].slice(0, 50) + '...',
          art: ASCII_ART_DB[name]
        }))
      });
      return;
    }

    const searchTerm = query.toLowerCase();
    const maxResults = Math.min(parseInt(limit as string, 10) || 10, 50);
    
    // Search in database
    const matches = Object.entries(ASCII_ART_DB)
      .filter(([name]) => name.includes(searchTerm))
      .slice(0, maxResults)
      .map(([name, art]) => ({ name, art }));

    res.json({
      success: true,
      query: searchTerm,
      results: matches,
      totalFound: matches.length
    });
  } catch (error) {
    console.error('ASCII search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// AI-powered web search for ASCII art using Gemini
router.get('/web', async (req: Request, res: Response) => {
  try {
    // Accept both 'q' and 'query' parameters
    const query = (req.query.q || req.query.query) as string;
    const limit = (req.query.limit || '10') as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter (q or query) is required' });
    }

    // Check if Gemini is configured
    if (geminiService.isReady()) {
      // Use Gemini with grounding for intelligent search
      const result = await geminiService.searchAsciiArt(query);
      
      if (result.success) {
        res.json({
          success: true,
          query,
          aiPowered: true,
          response: result.response,
          asciiArt: result.asciiArt,
          sources: result.sources,
          message: '🤖 Powered by Gemini AI with web grounding'
        });
        return;
      }
      
      // If Gemini fails, fall back to local + DuckDuckGo
      console.warn('Gemini search failed, falling back:', result.error);
    }

    // Fallback: Check local database first
    const searchTerm = query.toLowerCase();
    const localMatches = Object.entries(ASCII_ART_DB)
      .filter(([name]) => name.includes(searchTerm))
      .map(([name, art]) => ({ name, art, source: 'local' }));

    if (localMatches.length > 0) {
      res.json({
        success: true,
        query,
        aiPowered: false,
        results: localMatches,
        totalFound: localMatches.length,
        message: 'Found in local ASCII art collection'
      });
      return;
    }

    // Fallback: Use DuckDuckGo instant answer API
    const searchQuery = encodeURIComponent(`${query} ASCII art`);
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_redirect=1`
    );

    if (!response.ok) {
      throw new Error('Search API request failed');
    }

    const data = await response.json() as {
      Abstract?: string;
      AbstractText?: string;
      AbstractURL?: string;
      RelatedTopics?: Array<{
        Text?: string;
        FirstURL?: string;
      }>;
    };

    // Parse results
    const results = [];
    
    if (data.Abstract) {
      results.push({
        title: 'Summary',
        snippet: data.AbstractText || data.Abstract,
        url: data.AbstractURL
      });
    }

    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, parseInt(limit as string, 10))) {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0],
            snippet: topic.Text,
            url: topic.FirstURL
          });
        }
      }
    }

    res.json({
      success: true,
      query,
      aiPowered: false,
      results,
      totalFound: results.length,
      message: geminiService.isReady() 
        ? 'Web search results' 
        : '⚠️ Set GEMINI_API_KEY for AI-powered search'
    });
  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({ error: 'Web search failed' });
  }
});

// AI-powered ASCII art generation
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { description, style } = req.body;
    
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!geminiService.isReady()) {
      return res.status(503).json({ 
        error: 'AI generation requires GEMINI_API_KEY to be configured',
        suggestion: 'Add your Google AI Studio API key to backend/.env'
      });
    }

    const result = await geminiService.generateAsciiArt(description, style);
    
    if (result.success) {
      res.json({
        success: true,
        description: result.description,
        art: result.art,
        message: '🎨 Generated with Gemini AI'
      });
    } else {
      res.status(500).json({ error: result.error || 'Generation failed' });
    }
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// Get specific ASCII art by name
router.get('/art/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const art = ASCII_ART_DB[name.toLowerCase()];
  
  if (art) {
    res.json({
      success: true,
      name,
      art
    });
  } else {
    res.status(404).json({
      error: 'ASCII art not found',
      available: Object.keys(ASCII_ART_DB),
      suggestion: 'Try the /search/generate endpoint for custom ASCII art'
    });
  }
});

// List all available ASCII art
router.get('/list', (_req: Request, res: Response) => {
  res.json({
    success: true,
    art: Object.keys(ASCII_ART_DB),
    count: Object.keys(ASCII_ART_DB).length,
    aiReady: geminiService.isReady(),
    message: geminiService.isReady() 
      ? '✅ AI generation available' 
      : '⚠️ Set GEMINI_API_KEY for AI features'
  });
});

// Health check for search service
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    services: {
      localDatabase: true,
      geminiAI: geminiService.isReady(),
      duckDuckGo: true
    },
    message: geminiService.isReady()
      ? '🚀 All services operational'
      : '⚠️ Running in limited mode - configure GEMINI_API_KEY for full features'
  });
});

// AI-powered topic explanation
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { topic, context = 'general' } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!geminiService.isReady()) {
      return res.status(503).json({ 
        success: false,
        error: 'AI explanation requires GEMINI_API_KEY to be configured',
        suggestion: 'Add your Google AI Studio API key to backend/.env'
      });
    }

    const explanation = await geminiService.explainTopic(topic, context);
    
    res.json({
      success: true,
      topic,
      explanation,
      message: '🤖 Explained by Gemini AI'
    });
  } catch (error) {
    console.error('Explain error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate explanation' 
    });
  }
});

export default router;
