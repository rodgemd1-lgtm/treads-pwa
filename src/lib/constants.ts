export const TREAD_THRESHOLDS = {
  NEW: { minMm: 10, label: 'New', color: '#00D9FF' },
  GOOD: { minMm: 6, label: 'Good', color: '#4CAF50' },
  CAUTION: { minMm: 3, label: 'Caution', color: '#F9A825' },
  REPLACE: { minMm: 0, label: 'Replace', color: '#FF1744' },
} as const;

export const REFERENCE_OBJECTS = {
  quarter: { mm: 1.75, label: 'Quarter (1.75mm)' },
  penny: { mm: 1.5, label: 'Penny (1.5mm)' },
  gauge: { mm: 0, label: 'Manual Gauge' },
} as const;

export const TIRE_COSTS = {
  economy: { perTire: 75, labor: 25 },
  midRange: { perTire: 145, labor: 35 },
  premium: { perTire: 250, labor: 45 },
  suvTruck: { perTire: 200, labor: 40 },
} as const;

export function getTreadStatus(depthMm: number) {
  if (depthMm >= TREAD_THRESHOLDS.NEW.minMm) return { ...TREAD_THRESHOLDS.NEW, status: 'new' as const };
  if (depthMm >= TREAD_THRESHOLDS.GOOD.minMm) return { ...TREAD_THRESHOLDS.GOOD, status: 'good' as const };
  if (depthMm >= TREAD_THRESHOLDS.CAUTION.minMm) return { ...TREAD_THRESHOLDS.CAUTION, status: 'caution' as const };
  return { ...TREAD_THRESHOLDS.REPLACE, status: 'replace' as const };
}

export function getWearPercentage(depthMm: number) {
  const maxDepth = 11; // new tire depth in mm
  return Math.max(0, Math.min(100, ((maxDepth - depthMm) / maxDepth) * 100));
}

export function estimateCost(tireCount: number, grade: keyof typeof TIRE_COSTS, taxRate = 0.08) {
  const tc = TIRE_COSTS[grade];
  const perTire = tc.perTire;
  const laborCost = tc.labor * tireCount;
  const subtotal = perTire * tireCount + laborCost;
  const tax = subtotal * taxRate;
  return {
    perTire,
    total: perTire * tireCount,
    laborCost,
    taxEstimate: tax,
    grandTotal: subtotal + tax,
    currency: 'USD',
  };
}

export function generateUUID() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
