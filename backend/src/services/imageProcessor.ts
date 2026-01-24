/**
 * Image Processor Service
 * Converts images to ASCII art using Sharp
 * Supports multiple character sets and color modes
 */

import sharp from 'sharp';

interface AsciiOptions {
  width?: number;
  charset?: 'standard' | 'blocks' | 'minimal' | 'detailed';
  invert?: boolean;
  color?: boolean;
}

interface ProcessOptions {
  resize?: { width?: number; height?: number };
  crop?: { left: number; top: number; width: number; height: number };
  grayscale?: boolean;
  blur?: number;
  sharpen?: boolean;
  contrast?: number;
  brightness?: number;
}

// Character sets for ASCII conversion (ordered dark to light)
const CHARSETS = {
  standard: ' .:-=+*#%@',
  blocks: ' ░▒▓█',
  minimal: ' .*#',
  detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
};

/**
 * Convert image buffer to ASCII art
 */
export async function imageToAscii(buffer: Buffer, options: AsciiOptions = {}): Promise<string> {
  const {
    width = 80,
    charset = 'standard',
    invert = false,
    // color = false
  } = options;

  const chars = CHARSETS[charset] || CHARSETS.standard;

  // Calculate aspect ratio correction (terminal chars are ~2x tall as wide)
  const aspectRatio = 0.45;

  // Process image with Sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  // Calculate height based on width and aspect ratio
  const height = Math.round(((width * metadata.height) / metadata.width) * aspectRatio);

  // Resize and convert to raw pixel data
  const { data, info } = await image
    .resize(width, height, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let ascii = '';

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      let brightness = data[idx]; // Grayscale value

      // Invert if requested
      if (invert) {
        brightness = 255 - brightness;
      }

      // Map brightness to character
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[charIdx];
    }
    ascii += '\n';
  }

  return ascii;
}

/**
 * Convert image to colored ASCII (ANSI escape codes)
 */
export async function imageToColorAscii(
  buffer: Buffer,
  options: AsciiOptions = {}
): Promise<string> {
  const { width = 80, charset = 'blocks', invert = false } = options;

  const chars = CHARSETS[charset] || CHARSETS.blocks;
  const aspectRatio = 0.45;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read image dimensions');
  }

  const height = Math.round(((width * metadata.height) / metadata.width) * aspectRatio);

  // Get RGB data
  const { data, info } = await image
    .resize(width, height, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let ascii = '';

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 3;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      // Calculate brightness for character selection
      const brightness = (r + g + b) / 3;
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));

      // ANSI true color escape sequence
      ascii += `\x1b[38;2;${r};${g};${b}m${chars[charIdx]}\x1b[0m`;
    }
    ascii += '\n';
  }

  return ascii;
}

/**
 * Process image with various transformations
 */
export async function processImageBuffer(buffer: Buffer, options: ProcessOptions): Promise<Buffer> {
  let image = sharp(buffer);

  // Apply transformations in order
  if (options.resize) {
    image = image.resize(options.resize.width, options.resize.height);
  }

  if (options.crop) {
    image = image.extract(options.crop);
  }

  if (options.grayscale) {
    image = image.grayscale();
  }

  if (options.blur && options.blur > 0) {
    image = image.blur(options.blur);
  }

  if (options.sharpen) {
    image = image.sharpen();
  }

  // Apply modulation for contrast and brightness
  if (options.contrast !== undefined || options.brightness !== undefined) {
    image = image.modulate({
      brightness: options.brightness ?? 1,
      saturation: 1,
    });
  }

  return image.png().toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer): Promise<{
  width: number;
  height: number;
  format: string;
  channels: number;
  hasAlpha: boolean;
  size: number;
}> {
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    channels: metadata.channels || 0,
    hasAlpha: metadata.hasAlpha || false,
    size: buffer.length,
  };
}

/**
 * Create ASCII art preview at different sizes
 */
export async function createAsciiPreview(
  buffer: Buffer,
  sizes: number[] = [40, 80, 120]
): Promise<Record<number, string>> {
  const previews: Record<number, string> = {};

  for (const width of sizes) {
    previews[width] = await imageToAscii(buffer, { width });
  }

  return previews;
}
