/**
 * Image Routes
 * Handles image uploads and conversion to ASCII art
 * Uses Sharp for image processing
 */

import { Request, Response, Router } from 'express';
import multer from 'multer';
import { imageToAscii, processImageBuffer } from '../services/imageProcessor.js';
const router = Router();
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, BMP'));
    }
  },
});

// Convert uploaded image to ASCII
router.post('/to-ascii', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { width = '80', charset = 'standard', invert = 'false', color = 'false' } = req.body;

    const options = {
      width: Math.min(Math.max(parseInt(width, 10) || 80, 10), 300),
      charset: charset as 'standard' | 'blocks' | 'minimal' | 'detailed',
      invert: invert === 'true',
      color: color === 'true',
    };

    const ascii = await imageToAscii(req.file.buffer, options);

    res.json({
      success: true,
      ascii,
      options,
      originalSize: req.file.size,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error('Image to ASCII error:', error);
    res.status(500).json({ error: 'Failed to convert image to ASCII' });
  }
});

// Convert image from URL to ASCII
router.post('/url-to-ascii', async (req: Request, res: Response) => {
  try {
    const { url, width = 80, charset = 'standard', invert = false, color = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch image from URL
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to fetch image from URL' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const options = {
      width: Math.min(Math.max(width, 10), 300),
      charset: charset as 'standard' | 'blocks' | 'minimal' | 'detailed',
      invert,
      color,
    };

    const ascii = await imageToAscii(buffer, options);

    res.json({
      success: true,
      ascii,
      options,
      sourceUrl: url,
    });
  } catch (error) {
    console.error('URL to ASCII error:', error);
    res.status(500).json({ error: 'Failed to convert URL image to ASCII' });
  }
});

// Process image (resize, crop, filter) before ASCII conversion
router.post('/process', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { resize, crop, grayscale = 'false', blur, sharpen, contrast, brightness } = req.body;

    const processedBuffer = await processImageBuffer(req.file.buffer, {
      resize: resize ? JSON.parse(resize) : undefined,
      crop: crop ? JSON.parse(crop) : undefined,
      grayscale: grayscale === 'true',
      blur: blur ? parseFloat(blur) : undefined,
      sharpen: sharpen === 'true',
      contrast: contrast ? parseFloat(contrast) : undefined,
      brightness: brightness ? parseFloat(brightness) : undefined,
    });

    // Return as base64 for preview
    res.json({
      success: true,
      processedImage: `data:image/png;base64,${processedBuffer.toString('base64')}`,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error('Image process error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Get image metadata
router.post('/metadata', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const sharp = (await import('sharp')).default;
    const metadata = await sharp(req.file.buffer).metadata();

    res.json({
      success: true,
      metadata: {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({ error: 'Failed to get image metadata' });
  }
});

export default router;
