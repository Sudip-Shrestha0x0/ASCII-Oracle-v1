/**
 * Gemini AI Service
 * Provides AI-powered search with web grounding using Google AI Studio
 */

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

// Types for Gemini responses
interface GeminiSearchResult {
  success: boolean;
  query: string;
  response: string;
  asciiArt?: string;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  error?: string;
}

interface GenerateAsciiResult {
  success: boolean;
  art: string;
  description: string;
  error?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private isConfigured: boolean = false;
  private initialized: boolean = false;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 1000; // 1 second between requests

  // Lazy initialization - only init when first used
  private ensureInitialized(): void {
    if (this.initialized) return;
    this.initialized = true;

    const apiKey = process.env.GEMINI_API_KEY;

    console.log(
      'Checking GEMINI_API_KEY:',
      apiKey ? 'Found (length: ' + apiKey.length + ')' : 'Not found'
    );

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️  GEMINI_API_KEY not configured. AI search features will be limited.');
      this.isConfigured = false;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-flash - stable and widely available
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      this.isConfigured = true;
      console.log('✅ Gemini AI service initialized with gemini-1.5-flash');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini:', error);
      this.isConfigured = false;
    }
  }

  // Rate limiting helper
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Check if Gemini is properly configured
   */
  isReady(): boolean {
    this.ensureInitialized();
    return this.isConfigured && this.model !== null;
  }

  /**
   * Search for ASCII art with AI-powered web grounding
   */
  async searchAsciiArt(query: string): Promise<GeminiSearchResult> {
    this.ensureInitialized();
    if (!this.isConfigured) {
      return {
        success: false,
        query,
        response: '',
        error: 'Gemini API not configured. Please set GEMINI_API_KEY in your .env file.',
      };
    }

    try {
      await this.waitForRateLimit();

      const prompt = `You are an ASCII art expert. Create or find ASCII art related to "${query}".

Your task:
1. Create a simple ASCII art of "${query}" (keep it under 12 lines, max 50 chars wide)
2. Provide a brief description (1-2 sentences)

Use only these characters: @ # $ % & * + = - _ . : ; ' " \` ~ ^ | / \\ ( ) [ ] { } < >

Output format:
DESCRIPTION: [brief description]
ASCII_ART:
[your ASCII art here]`;

      const result = await this.model!.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract ASCII art from response
      const artMatch = text.match(/ASCII_ART:\s*([\s\S]*?)(?:$|DESCRIPTION:|---)/i);
      const descMatch = text.match(/DESCRIPTION:\s*([^\n]+)/i);

      const asciiArt = artMatch ? artMatch[1].trim() : undefined;

      return {
        success: true,
        query,
        response: descMatch ? descMatch[1].trim() : text.substring(0, 200),
        asciiArt,
        sources: [],
      };
    } catch (error: unknown) {
      console.error('Gemini search error:', error);

      // Handle rate limit errors gracefully
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 429
      ) {
        return {
          success: false,
          query,
          response: '',
          error: 'Rate limit reached. Please wait a moment and try again.',
        };
      }

      return {
        success: false,
        query,
        response: '',
        error: error instanceof Error ? error.message : 'Search failed',
      };
    }
  }

  /**
   * Generate ASCII art from a description
   */
  async generateAsciiArt(description: string, style?: string): Promise<GenerateAsciiResult> {
    if (!this.isReady()) {
      return {
        success: false,
        art: '',
        description: '',
        error: 'Gemini API not configured. Please set GEMINI_API_KEY in your .env file.',
      };
    }

    try {
      await this.waitForRateLimit();

      const styleGuide =
        style === 'pixel'
          ? 'Use block characters (█ ▓ ░) for a pixel art style.'
          : style === 'line'
            ? 'Use line characters (- | / \\ + _) for a line art style.'
            : 'Use a mix of ASCII characters for best visual effect.';

      const prompt = `Create ASCII art of: ${description}

Requirements:
- Maximum 15 lines tall, 50 characters wide
- Use only printable ASCII characters
- ${styleGuide}
- Make it recognizable and visually appealing
- Output ONLY the ASCII art, nothing else - no explanations, no markdown

ASCII art:`;

      const result = await this.model!.generateContent(prompt);
      const text = result.response.text().trim();

      // Clean up the response - remove any markdown or explanations
      const lines = text.split('\n');
      const artLines = lines.filter(
        (line) =>
          !line.toLowerCase().includes('here') &&
          !line.toLowerCase().startsWith('ascii') &&
          !line.startsWith('#') &&
          !line.startsWith('```')
      );

      return {
        success: true,
        art: artLines.join('\n'),
        description: `ASCII art of ${description}`,
      };
    } catch (error: unknown) {
      console.error('Gemini generate error:', error);

      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 429
      ) {
        return {
          success: false,
          art: '',
          description: '',
          error: 'Rate limit reached. Please wait a moment and try again.',
        };
      }

      return {
        success: false,
        art: '',
        description: '',
        error: error instanceof Error ? error.message : 'Generation failed',
      };
    }
  }

  /**
   * Get AI explanation for topics
   */
  async explainTopic(topic: string, context: string = 'general'): Promise<string> {
    if (!this.isReady()) {
      return 'Gemini not configured';
    }

    try {
      await this.waitForRateLimit();

      const prompt = `Explain "${topic}" in the context of ${context}.
      
Be concise but thorough. Use simple language. 
If relevant, include formulas or key concepts.
Keep the explanation under 150 words.`;

      const result = await this.model!.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error('Gemini explain error:', error);

      if (error.status === 429) {
        return 'Rate limit reached. Please wait a moment and try again.';
      }

      return 'Failed to generate explanation';
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();
export default geminiService;
