/**
 * Python Bridge Service
 * Executes Python scripts for advanced math/science calculations
 * Uses child_process to communicate with Python interpreter
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PythonResult {
  success: boolean;
  result?: unknown;
  error?: string;
  latex?: string;
  steps?: string[];
}

/**
 * Execute a Python script with given arguments
 * Returns parsed JSON result from Python script's stdout
 */
export async function executePython(
  scriptName: string, 
  args: Record<string, string | undefined>
): Promise<PythonResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../python', scriptName);
    
    // Filter out undefined values and convert to JSON
    const cleanArgs: Record<string, string> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        cleanArgs[key] = value;
      }
    }
    
    // Spawn Python process
    const python = spawn('python3', [scriptPath, JSON.stringify(cleanArgs)]);
    
    let stdout = '';
    let stderr = '';
    
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch {
          resolve({ 
            success: true, 
            result: stdout.trim() 
          });
        }
      } else {
        // Python failed, provide helpful fallback
        resolve({
          success: false,
          error: stderr || 'Python execution failed',
          result: calculateFallback(args)
        });
      }
    });
    
    python.on('error', (err) => {
      // Python not available, use JavaScript fallback
      resolve({
        success: false,
        error: `Python not available: ${err.message}`,
        result: calculateFallback(args)
      });
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('Python execution timed out'));
    }, 30000);
  });
}

/**
 * JavaScript fallback for basic math when Python is unavailable
 */
function calculateFallback(args: Record<string, string | undefined>): string | number | null {
  const { expression, operation } = args;
  
  if (!expression) return null;
  
  try {
    // Very basic expression evaluation (only for simple cases)
    // In production, use a proper math library like mathjs
    const sanitized = expression.replace(/\^/g, '**');
    
    switch (operation) {
      case 'simplify':
        // Can't simplify in JS, return as-is
        return expression;
      case 'solve':
        // Can only solve very simple linear equations
        return 'Python required for equation solving';
      case 'integrate':
      case 'diff':
        return 'Python required for calculus operations';
      default:
        // Try to evaluate numeric expressions
        if (/^[\d\s+\-*/.()]+$/.test(sanitized)) {
          return Function('"use strict"; return (' + sanitized + ')')();
        }
        return expression;
    }
  } catch {
    return null;
  }
}

/**
 * Check if Python is available on the system
 */
export async function checkPythonAvailable(): Promise<{
  available: boolean;
  version?: string;
  sympyInstalled?: boolean;
}> {
  return new Promise((resolve) => {
    const python = spawn('python3', ['--version']);
    
    let version = '';
    
    python.stdout.on('data', (data) => {
      version = data.toString().trim();
    });
    
    python.on('close', async (code) => {
      if (code === 0) {
        // Check for sympy
        const sympy = spawn('python3', ['-c', 'import sympy; print(sympy.__version__)']);

        sympy.on('close', (sympyCode) => {
          resolve({
            available: true,
            version,
            sympyInstalled: sympyCode === 0
          });
        });
        
        sympy.on('error', () => {
          resolve({
            available: true,
            version,
            sympyInstalled: false
          });
        });
      } else {
        resolve({ available: false });
      }
    });
    
    python.on('error', () => {
      resolve({ available: false });
    });
  });
}
