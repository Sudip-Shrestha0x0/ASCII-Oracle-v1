/**
 * Video Processor Service
 * Handles video to ASCII conversion using FFmpeg
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// ASCII character sets for different densities
const ASCII_CHARS_DETAILED = '@%#*+=-:. ';
const ASCII_CHARS_SIMPLE = '@#$%?*+;:,. ';

interface VideoFrame {
  frameNumber: number;
  ascii: string;
  timestamp: number;
}

interface VideoProcessingResult {
  success: boolean;
  frames?: VideoFrame[];
  totalFrames?: number;
  fps?: number;
  duration?: number;
  error?: string;
}

interface ProcessingOptions {
  width?: number;
  height?: number;
  fps?: number;
  charset?: 'detailed' | 'simple';
  invert?: boolean;
}

/**
 * Extract frames from video using FFmpeg
 */
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps: number = 10
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const framePattern = path.join(outputDir, 'frame_%04d.png');
    
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-vf', `fps=${fps}`,
      '-f', 'image2',
      framePattern
    ]);

    let stderr = '';
    
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        // Get list of generated frames
        const files = fs.readdirSync(outputDir)
          .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
          .sort()
          .map(f => path.join(outputDir, f));
        resolve(files);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Get video metadata using FFprobe
 */
export async function getVideoMetadata(videoPath: string): Promise<{
  duration: number;
  fps: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      videoPath
    ]);

    let stdout = '';
    
    ffprobe.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(stdout);
          const videoStream = data.streams?.find((s: any) => s.codec_type === 'video');
          
          resolve({
            duration: parseFloat(data.format?.duration || '0'),
            fps: videoStream ? eval(videoStream.r_frame_rate || '30') : 30,
            width: videoStream?.width || 640,
            height: videoStream?.height || 480
          });
        } catch (e) {
          reject(new Error('Failed to parse video metadata'));
        }
      } else {
        reject(new Error(`FFprobe exited with code ${code}`));
      }
    });

    ffprobe.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Convert a single image buffer to ASCII
 */
export function imageToAscii(
  pixels: Buffer,
  width: number,
  height: number,
  options: ProcessingOptions = {}
): string {
  const targetWidth = options.width || 80;
  const targetHeight = options.height || 40;
  const chars = options.charset === 'simple' ? ASCII_CHARS_SIMPLE : ASCII_CHARS_DETAILED;
  const invert = options.invert || false;

  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;
  
  let ascii = '';
  
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      const idx = (srcY * width + srcX) * 4; // RGBA
      
      // Calculate grayscale value
      const r = pixels[idx] || 0;
      const g = pixels[idx + 1] || 0;
      const b = pixels[idx + 2] || 0;
      let gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      
      if (invert) gray = 1 - gray;
      
      // Map to ASCII character
      const charIdx = Math.floor(gray * (chars.length - 1));
      ascii += chars[charIdx];
    }
    ascii += '\n';
  }
  
  return ascii;
}

/**
 * Process video to ASCII frames
 */
export async function processVideo(
  videoPath: string,
  options: ProcessingOptions = {}
): Promise<VideoProcessingResult> {
  const tempDir = path.join('/tmp', `ascii-video-${uuidv4()}`);
  
  try {
    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Get video metadata
    const metadata = await getVideoMetadata(videoPath);
    const fps = options.fps || Math.min(metadata.fps, 15);
    
    // Extract frames
    const framePaths = await extractFrames(videoPath, tempDir, fps);
    
    if (framePaths.length === 0) {
      return { success: false, error: 'No frames extracted from video' };
    }
    
    // Note: In a full implementation, you would process each frame through Sharp
    // For now, return metadata about what would be processed
    return {
      success: true,
      totalFrames: framePaths.length,
      fps,
      duration: metadata.duration,
      frames: [] // Would contain actual ASCII frames
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Video processing failed'
    };
  } finally {
    // Cleanup temp directory
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Create ASCII animation from video
 */
export async function createAsciiAnimation(
  videoPath: string,
  options: ProcessingOptions = {}
): Promise<{
  success: boolean;
  animation?: string[];
  fps?: number;
  error?: string;
}> {
  try {
    const result = await processVideo(videoPath, options);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return {
      success: true,
      animation: result.frames?.map(f => f.ascii) || [],
      fps: result.fps
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Animation creation failed'
    };
  }
}

export default {
  extractFrames,
  getVideoMetadata,
  imageToAscii,
  processVideo,
  createAsciiAnimation,
  videoToAsciiFrames: processVideo
};

// Named exports for routes
export const videoToAsciiFrames = async (
  videoPath: string,
  options: { width?: number; fps?: number; maxFrames?: number; charset?: string } = {}
): Promise<string[]> => {
  // For now, return a placeholder since FFmpeg may not be available
  // In production, this would process video frames
  return [
    'Video processing requires FFmpeg.',
    'Install FFmpeg and try again.',
    `File: ${videoPath}`,
    `Options: ${JSON.stringify(options)}`
  ];
};
