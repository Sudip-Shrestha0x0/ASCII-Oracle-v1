/**
 * Science Routes
 * Handles physics and chemistry calculations
 * Uses Python bridge for complex computations
 */

import { Request, Response, Router } from 'express';
import { executePython } from '../services/pythonBridge.js';

const router = Router();

// Periodic table data
const PERIODIC_TABLE: Record<
  string,
  { symbol: string; name: string; atomicNumber: number; atomicMass: number; category: string }
> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicMass: 1.008, category: 'nonmetal' },
  He: { symbol: 'He', name: 'Helium', atomicNumber: 2, atomicMass: 4.003, category: 'noble gas' },
  Li: {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    atomicMass: 6.941,
    category: 'alkali metal',
  },
  Be: {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    atomicMass: 9.012,
    category: 'alkaline earth',
  },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, atomicMass: 10.81, category: 'metalloid' },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicMass: 12.011, category: 'nonmetal' },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicMass: 14.007, category: 'nonmetal' },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicMass: 15.999, category: 'nonmetal' },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, atomicMass: 18.998, category: 'halogen' },
  Ne: { symbol: 'Ne', name: 'Neon', atomicNumber: 10, atomicMass: 20.18, category: 'noble gas' },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicMass: 22.99,
    category: 'alkali metal',
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    atomicMass: 24.305,
    category: 'alkaline earth',
  },
  Al: {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    atomicMass: 26.982,
    category: 'post-transition',
  },
  Si: {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    atomicMass: 28.086,
    category: 'metalloid',
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    atomicMass: 30.974,
    category: 'nonmetal',
  },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, atomicMass: 32.065, category: 'nonmetal' },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, atomicMass: 35.453, category: 'halogen' },
  Ar: { symbol: 'Ar', name: 'Argon', atomicNumber: 18, atomicMass: 39.948, category: 'noble gas' },
  K: {
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    atomicMass: 39.098,
    category: 'alkali metal',
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    atomicMass: 40.078,
    category: 'alkaline earth',
  },
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    atomicMass: 55.845,
    category: 'transition metal',
  },
  Cu: {
    symbol: 'Cu',
    name: 'Copper',
    atomicNumber: 29,
    atomicMass: 63.546,
    category: 'transition metal',
  },
  Zn: {
    symbol: 'Zn',
    name: 'Zinc',
    atomicNumber: 30,
    atomicMass: 65.38,
    category: 'transition metal',
  },
  Ag: {
    symbol: 'Ag',
    name: 'Silver',
    atomicNumber: 47,
    atomicMass: 107.87,
    category: 'transition metal',
  },
  Au: {
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    atomicMass: 196.97,
    category: 'transition metal',
  },
};

// Physics: Projectile motion
router.post('/physics/projectile', async (req: Request, res: Response) => {
  try {
    const { velocity, angle, height = 0, gravity = 9.81 } = req.body;

    if (velocity === undefined || angle === undefined) {
      return res.status(400).json({ error: 'Velocity and angle are required' });
    }

    const v = parseFloat(velocity);
    const theta = parseFloat(angle) * (Math.PI / 180); // Convert to radians
    const h0 = parseFloat(height);
    const g = parseFloat(gravity);

    // Calculate projectile motion parameters
    const vx = v * Math.cos(theta);
    const vy = v * Math.sin(theta);

    // Time of flight (quadratic formula)
    const timeOfFlight = (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g;

    // Maximum height
    const maxHeight = h0 + (vy * vy) / (2 * g);

    // Range
    const range = vx * timeOfFlight;

    res.json({
      success: true,
      results: {
        initialVelocityX: vx.toFixed(3),
        initialVelocityY: vy.toFixed(3),
        timeOfFlight: timeOfFlight.toFixed(3),
        maxHeight: maxHeight.toFixed(3),
        range: range.toFixed(3),
        unit: 'meters (SI units)',
      },
      inputs: { velocity: v, angle: angle, height: h0, gravity: g },
      formulas: {
        vx: 'v₀ × cos(θ)',
        vy: 'v₀ × sin(θ)',
        time: '(vy + √(vy² + 2gh₀)) / g',
        maxHeight: 'h₀ + vy² / (2g)',
        range: 'vx × t',
      },
    });
  } catch (error) {
    console.error('Projectile motion error:', error);
    res.status(500).json({ error: 'Failed to calculate projectile motion' });
  }
});

// Physics: Simple pendulum
router.post('/physics/pendulum', async (req: Request, res: Response) => {
  try {
    const { length, gravity = 9.81 } = req.body;

    if (length === undefined) {
      return res.status(400).json({ error: 'Pendulum length is required' });
    }

    const L = parseFloat(length);
    const g = parseFloat(gravity);

    // Calculate period and frequency
    const period = 2 * Math.PI * Math.sqrt(L / g);
    const frequency = 1 / period;
    const angularFrequency = Math.sqrt(g / L);

    res.json({
      success: true,
      results: {
        period: period.toFixed(4),
        frequency: frequency.toFixed(4),
        angularFrequency: angularFrequency.toFixed(4),
        units: {
          period: 'seconds',
          frequency: 'Hz',
          angularFrequency: 'rad/s',
        },
      },
      inputs: { length: L, gravity: g },
      formulas: {
        period: 'T = 2π√(L/g)',
        frequency: 'f = 1/T',
        angularFrequency: 'ω = √(g/L)',
      },
    });
  } catch (error) {
    console.error('Pendulum error:', error);
    res.status(500).json({ error: 'Failed to calculate pendulum motion' });
  }
});

// Physics: Kinetic/Potential energy
router.post('/physics/energy', async (req: Request, res: Response) => {
  try {
    const { mass, velocity, height, gravity = 9.81 } = req.body;

    if (mass === undefined) {
      return res.status(400).json({ error: 'Mass is required' });
    }

    const m = parseFloat(mass);
    const v = velocity !== undefined ? parseFloat(velocity) : 0;
    const h = height !== undefined ? parseFloat(height) : 0;
    const g = parseFloat(gravity);

    const kineticEnergy = 0.5 * m * v * v;
    const potentialEnergy = m * g * h;
    const totalEnergy = kineticEnergy + potentialEnergy;

    res.json({
      success: true,
      results: {
        kineticEnergy: kineticEnergy.toFixed(3),
        potentialEnergy: potentialEnergy.toFixed(3),
        totalMechanicalEnergy: totalEnergy.toFixed(3),
        unit: 'Joules (J)',
      },
      inputs: { mass: m, velocity: v, height: h, gravity: g },
      formulas: {
        kinetic: 'KE = ½mv²',
        potential: 'PE = mgh',
        total: 'E = KE + PE',
      },
    });
  } catch (error) {
    console.error('Energy calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate energy' });
  }
});

// Chemistry: Element lookup
router.get('/chemistry/element/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params;
  const element =
    PERIODIC_TABLE[symbol] ||
    PERIODIC_TABLE[symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase()];

  if (element) {
    res.json({ success: true, element });
  } else {
    res.status(404).json({
      error: 'Element not found',
      available: Object.keys(PERIODIC_TABLE).slice(0, 20).join(', ') + '...',
    });
  }
});

// Chemistry: Molar mass calculator
router.post('/chemistry/molar-mass', (req: Request, res: Response) => {
  try {
    const { formula } = req.body;

    if (!formula) {
      return res.status(400).json({ error: 'Chemical formula is required' });
    }

    // Parse chemical formula (simplified parser)
    const elementPattern = /([A-Z][a-z]?)(\d*)/g;
    let match;
    let totalMass = 0;
    const composition: Array<{ element: string; count: number; mass: number }> = [];

    while ((match = elementPattern.exec(formula)) !== null) {
      const element = match[1];
      const count = parseInt(match[2]) || 1;
      const elementData = PERIODIC_TABLE[element];

      if (!elementData) {
        return res.status(400).json({ error: `Unknown element: ${element}` });
      }

      const mass = elementData.atomicMass * count;
      totalMass += mass;
      composition.push({ element, count, mass });
    }

    res.json({
      success: true,
      formula,
      molarMass: totalMass.toFixed(3),
      unit: 'g/mol',
      composition,
    });
  } catch (error) {
    console.error('Molar mass error:', error);
    res.status(500).json({ error: 'Failed to calculate molar mass' });
  }
});

// Chemistry: Balance equation (simplified)
router.post('/chemistry/balance', async (req: Request, res: Response) => {
  try {
    const { equation } = req.body;

    if (!equation) {
      return res.status(400).json({ error: 'Chemical equation is required' });
    }

    // Try to use Python for balancing if available
    try {
      const result = await executePython('chem_balance.py', { equation });
      return res.json(result);
    } catch {
      // Fallback: return simple parsing info
      const [reactants, products] = equation.split('->').map((s: string) => s.trim());

      return res.json({
        success: true,
        original: equation,
        reactants: reactants.split('+').map((r: string) => r.trim()),
        products: products ? products.split('+').map((p: string) => p.trim()) : [],
        note: 'For complex balancing, ensure Python with sympy is installed',
      });
    }
  } catch (error) {
    console.error('Balance equation error:', error);
    res.status(500).json({ error: 'Failed to balance equation' });
  }
});

// Physics: Wave properties
router.post('/physics/wave', (req: Request, res: Response) => {
  try {
    const { frequency, wavelength, velocity } = req.body;

    let f: number, lambda: number, v: number;

    // Calculate missing value from v = fλ
    if (frequency !== undefined && wavelength !== undefined) {
      f = parseFloat(frequency);
      lambda = parseFloat(wavelength);
      v = f * lambda;
    } else if (frequency !== undefined && velocity !== undefined) {
      f = parseFloat(frequency);
      v = parseFloat(velocity);
      lambda = v / f;
    } else if (wavelength !== undefined && velocity !== undefined) {
      lambda = parseFloat(wavelength);
      v = parseFloat(velocity);
      f = v / lambda;
    } else {
      return res.status(400).json({
        error: 'Provide at least two of: frequency, wavelength, velocity',
      });
    }

    const period = 1 / f;
    const angularFrequency = 2 * Math.PI * f;
    const waveNumber = (2 * Math.PI) / lambda;

    res.json({
      success: true,
      results: {
        frequency: f.toExponential(3),
        wavelength: lambda.toExponential(3),
        velocity: v.toExponential(3),
        period: period.toExponential(3),
        angularFrequency: angularFrequency.toExponential(3),
        waveNumber: waveNumber.toExponential(3),
      },
      units: {
        frequency: 'Hz',
        wavelength: 'm',
        velocity: 'm/s',
        period: 's',
        angularFrequency: 'rad/s',
        waveNumber: 'rad/m',
      },
      formula: 'v = f × λ',
    });
  } catch (error) {
    console.error('Wave calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate wave properties' });
  }
});

// Get periodic table
router.get('/chemistry/periodic-table', (_req: Request, res: Response) => {
  res.json({
    success: true,
    elements: PERIODIC_TABLE,
    count: Object.keys(PERIODIC_TABLE).length,
  });
});

export default router;
