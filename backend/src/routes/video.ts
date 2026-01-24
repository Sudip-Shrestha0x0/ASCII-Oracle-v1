/**
 * Video Routes
 * Handles video uploads and frame-by-frame ASCII conversion
 * Note: Requires FFmpeg to be installed on the system
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: MP4, WebM, MOV, AVI, MPEG'));
    }
  },
});

// Convert video to ASCII frames
router.post('/to-ascii', upload.single('video'), async (req: Request, res: Response) => {
  let tempPath: string | undefined;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    tempPath = req.file.path;

    // For now, return a message that video processing requires FFmpeg
    // In a full deployment, FFmpeg would process the video
    const asciiMessage = [
      '╔════════════════════════════════════════╗',
      '║      VIDEO PROCESSING                  ║',
      '╠════════════════════════════════════════╣',
      '║  Video to ASCII requires FFmpeg.       ║',
      '║                                        ║',
      `║  File: ${req.file.originalname.slice(0, 25).padEnd(25)}║`,
      `║  Size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB                      ║`,
      '║                                        ║',
      '║  Install FFmpeg to enable video        ║',
      '║  processing functionality.             ║',
      '╚════════════════════════════════════════╝',
    ].join('\n');

    // Cleanup temp file
    await fs.unlink(tempPath);

    res.json({
      success: true,
      frames: [asciiMessage],
      frameCount: 1,
      message: 'Video processing requires FFmpeg installation',
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('Video to ASCII error:', error);
    
    if (tempPath) {
      try { await fs.unlink(tempPath); } catch {}
    }
    
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// Get video metadata
router.post('/metadata', upload.single('video'), async (req: Request, res: Response) => {
  let tempPath: string | undefined;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    tempPath = req.file.path;
    
    // Return basic file info without FFprobe
    const metadata = {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      message: 'Full metadata requires FFprobe'
    };
    
    await fs.unlink(tempPath);

    res.json({
      success: true,
      metadata,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Video metadata error:', error);
    
    if (tempPath) {
      try { await fs.unlink(tempPath); } catch {}
    }
    
    res.status(500).json({ error: 'Failed to get video metadata' });
  }
});

export default router;
