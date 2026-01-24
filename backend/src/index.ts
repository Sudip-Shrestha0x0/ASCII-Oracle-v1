/**
 * ASCII Oracle Backend Server
 */

// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (one level up from src)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routes AFTER dotenv is loaded
import mathRoutes from './routes/math.js';
import imageRoutes from './routes/image.js';
import videoRoutes from './routes/video.js';
import searchRoutes from './routes/search.js';
import scienceRoutes from './routes/science.js';
import asciiRoutes from './routes/ascii.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "api.duckduckgo.com", "*.wikipedia.org"],
    },
  },
}));

// CORS config for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/math', mathRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/science', scienceRoutes);
app.use('/api/ascii', asciiRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    name: 'ASCII Oracle API'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     ___   _____ _____ _____  _____        ║
║    / _ \\ /  ___|  __ \\_   _||_   _|       ║
║   / /_\\ \\\\ \`--.| /  \\/ | |    | |         ║
║   |  _  | \`--. \\ |     | |    | |         ║
║   | | | |/\\__/ / \\__/\\_| |_  _| |_        ║
║   \\_| |_/\\____/ \\____/\\___/  \\___/        ║
║                                           ║
║   ╔═════════════════════════════════╗     ║
║   ║      ORACLE SERVER ONLINE       ║     ║
║   ╚═════════════════════════════════╝     ║
║                                           ║
║   Port: ${String(PORT).padEnd(5)}                           ║
║   Mode: ${(process.env.NODE_ENV || 'development').padEnd(12)}                  ║
║   Created by: Light                       ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
