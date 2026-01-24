/**
 * Math Routes
 * Handles mathematical computations via SymPy Python bridge
 * Supports integrals, derivatives, equations, limits, simplification
 */

import { Router, Request, Response } from 'express';
import { executePython } from '../services/pythonBridge.js';

const router = Router();

// Solve mathematical expressions
router.post('/solve', async (req: Request, res: Response) => {
  try {
    const { expression, operation, variable = 'x' } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const validOps = ['simplify', 'expand', 'factor', 'solve', 'integrate', 'diff', 'limit', 'series'];
    if (operation && !validOps.includes(operation)) {
      return res.status(400).json({ error: `Invalid operation. Valid: ${validOps.join(', ')}` });
    }

    const result = await executePython('math_solver.py', {
      expression,
      operation: operation || 'simplify',
      variable
    });

    res.json(result);
  } catch (error) {
    console.error('Math solve error:', error);
    res.status(500).json({ error: 'Failed to solve expression', details: String(error) });
  }
});

// Calculate integral
router.post('/integral', async (req: Request, res: Response) => {
  try {
    const { expression, variable = 'x', lower, upper } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const result = await executePython('math_solver.py', {
      expression,
      operation: 'integrate',
      variable,
      lower: lower !== undefined ? String(lower) : undefined,
      upper: upper !== undefined ? String(upper) : undefined
    });

    res.json(result);
  } catch (error) {
    console.error('Integral error:', error);
    res.status(500).json({ error: 'Failed to calculate integral' });
  }
});

// Calculate derivative
router.post('/derivative', async (req: Request, res: Response) => {
  try {
    const { expression, variable = 'x', order = 1 } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const result = await executePython('math_solver.py', {
      expression,
      operation: 'diff',
      variable,
      order: String(order)
    });

    res.json(result);
  } catch (error) {
    console.error('Derivative error:', error);
    res.status(500).json({ error: 'Failed to calculate derivative' });
  }
});

// Solve equation
router.post('/equation', async (req: Request, res: Response) => {
  try {
    const { equation, variable = 'x' } = req.body;
    
    if (!equation) {
      return res.status(400).json({ error: 'Equation is required' });
    }

    const result = await executePython('math_solver.py', {
      expression: equation,
      operation: 'solve',
      variable
    });

    res.json(result);
  } catch (error) {
    console.error('Equation solve error:', error);
    res.status(500).json({ error: 'Failed to solve equation' });
  }
});

// Calculate limit
router.post('/limit', async (req: Request, res: Response) => {
  try {
    const { expression, variable = 'x', point, direction } = req.body;
    
    if (!expression || point === undefined) {
      return res.status(400).json({ error: 'Expression and point are required' });
    }

    const result = await executePython('math_solver.py', {
      expression,
      operation: 'limit',
      variable,
      point: String(point),
      direction: direction || '+-'
    });

    res.json(result);
  } catch (error) {
    console.error('Limit error:', error);
    res.status(500).json({ error: 'Failed to calculate limit' });
  }
});

// Matrix operations
router.post('/matrix', async (req: Request, res: Response) => {
  try {
    const { matrix, operation } = req.body;
    
    if (!matrix) {
      return res.status(400).json({ error: 'Matrix is required' });
    }

    const validOps = ['det', 'inv', 'eigenvalues', 'eigenvectors', 'rref', 'transpose'];
    if (!validOps.includes(operation)) {
      return res.status(400).json({ error: `Invalid operation. Valid: ${validOps.join(', ')}` });
    }

    const result = await executePython('matrix_ops.py', {
      matrix: JSON.stringify(matrix),
      operation
    });

    res.json(result);
  } catch (error) {
    console.error('Matrix error:', error);
    res.status(500).json({ error: 'Failed to perform matrix operation' });
  }
});

// LaTeX formatting
router.post('/latex', async (req: Request, res: Response) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    const result = await executePython('math_solver.py', {
      expression,
      operation: 'latex'
    });

    res.json(result);
  } catch (error) {
    console.error('LaTeX error:', error);
    res.status(500).json({ error: 'Failed to convert to LaTeX' });
  }
});

export default router;
