export const TREAD_THRESHOLDS = {
  NEW: { minMm: 10, label: 'Excellent', color: '#3860be' },
  GOOD: { minMm: 6, label: 'Good', color: '#1a7a3a' },
  CAUTION: { minMm: 3, label: 'Caution', color: '#b47d00' },
  REPLACE: { minMm: 0, label: 'Replace', color: '#d4002a' },
} as const;

export const REFERENCE_OBJECTS = {
  quarter: { mm: 24.26, diameterMm: 24.26, label: 'US Quarter (24.26mm)' },
  penny: { mm: 19.05, diameterMm: 19.05, label: 'US Penny (19.05mm)' },
  gauge: { mm: 0, diameterMm: 0, label: 'Manual Gauge' },
} as const;

export const TIRE_COSTS = {
  economy: { perTire: 85, labor: 20, label: 'Economy (Sedans)', examples: 'Hyundai Venue, Kia Soul, Toyota Corolla' },
  midRange: { perTire: 145, labor: 30, label: 'Mid-Range (Full-Size)', examples: 'Toyota Camry, VW Jetta, Chevrolet Malibu' },
  premium: { perTire: 220, labor: 40, label: 'Premium (Luxury/SUV)', examples: 'Cadillac CT5, Lincoln Navigator, Mercedes C300' },
  suvTruck: { perTire: 185, labor: 35, label: 'SUV & Truck', examples: 'Ford Explorer, GMC Yukon, Chevy Equinox' },
} as const;

export function getTreadStatus(depthMm: number) {
  if (depthMm >= TREAD_THRESHOLDS.NEW.minMm) return { ...TREAD_THRESHOLDS.NEW, status: 'new' as const };
  if (depthMm >= TREAD_THRESHOLDS.GOOD.minMm) return { ...TREAD_THRESHOLDS.GOOD, status: 'good' as const };
  if (depthMm >= TREAD_THRESHOLDS.CAUTION.minMm) return { ...TREAD_THRESHOLDS.CAUTION, status: 'caution' as const };
  return { ...TREAD_THRESHOLDS.REPLACE, status: 'replace' as const };
}

export function getWearPercentage(depthMm: number) {
  const maxDepth = 11;
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

// Avis fleet seed data — Denver Metro Region
// Managed by: James Loehr (Fleet Operations)
export const SEED_VEHICLES = [
  { id: 'v1', name: 'Toyota Camry #1207', licensePlate: 'CO-AVS-1207', make: 'Toyota', model: 'Camry', year: 2024, mileage: 28450 },
  { id: 'v2', name: 'Chevrolet Equinox #0893', licensePlate: 'CO-AVS-0893', make: 'Chevrolet', model: 'Equinox', year: 2025, mileage: 3200 },
  { id: 'v3', name: 'Ford Explorer #1456', licensePlate: 'CO-AVS-1456', make: 'Ford', model: 'Explorer', year: 2024, mileage: 41200 },
  { id: 'v4', name: 'Hyundai Venue #2034', licensePlate: 'CO-AVS-2034', make: 'Hyundai', model: 'Venue', year: 2025, mileage: 1850 },
  { id: 'v5', name: 'Toyota Corolla #0678', licensePlate: 'CO-AVS-0678', make: 'Toyota', model: 'Corolla', year: 2024, mileage: 35600 },
  { id: 'v6', name: 'Cadillac XT6 #3012', licensePlate: 'CO-AVS-3012', make: 'Cadillac', model: 'XT6', year: 2025, mileage: 8900 },
  { id: 'v7', name: 'Chrysler Pacifica #0567', licensePlate: 'CO-AVS-0567', make: 'Chrysler', model: 'Pacifica', year: 2024, mileage: 52300 },
  { id: 'v8', name: 'Tesla Model 3 #1789', licensePlate: 'CO-AVS-1789', make: 'Tesla', model: 'Model 3', year: 2025, mileage: 5400 },
  // James Loehr personal vehicle
  { id: 'v9', name: 'Honda CR-V #4401', licensePlate: 'CO-JL-2026', make: 'Honda', model: 'CR-V', year: 2023, mileage: 31200 },
];

export const SEED_MEASUREMENTS = [
  { id: 'm1', vehicleId: 'v1', tirePositionId: 'v1-FL', depthMm: 7.2, depthInches: 0.28, wearPercentage: 34.5, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-20T08:30:00Z' },
  { id: 'm2', vehicleId: 'v1', tirePositionId: 'v1-FR', depthMm: 6.8, depthInches: 0.27, wearPercentage: 38.2, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-20T08:35:00Z' },
  { id: 'm3', vehicleId: 'v1', tirePositionId: 'v1-RL', depthMm: 5.1, depthInches: 0.20, wearPercentage: 53.6, status: 'caution' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-20T08:40:00Z' },
  { id: 'm4', vehicleId: 'v1', tirePositionId: 'v1-RR', depthMm: 2.8, depthInches: 0.11, wearPercentage: 74.5, status: 'replace' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-20T08:45:00Z' },
  { id: 'm5', vehicleId: 'v2', tirePositionId: 'v2-FL', depthMm: 9.1, depthInches: 0.36, wearPercentage: 17.3, status: 'new' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-18T10:15:00Z' },
  { id: 'm6', vehicleId: 'v2', tirePositionId: 'v2-FR', depthMm: 8.8, depthInches: 0.35, wearPercentage: 20.0, status: 'new' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-18T10:20:00Z' },
  { id: 'm7', vehicleId: 'v2', tirePositionId: 'v2-RL', depthMm: 7.5, depthInches: 0.30, wearPercentage: 31.8, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-18T10:25:00Z' },
  { id: 'm8', vehicleId: 'v2', tirePositionId: 'v2-RR', depthMm: 7.3, depthInches: 0.29, wearPercentage: 33.6, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-18T10:30:00Z' },
  { id: 'm9', vehicleId: 'v3', tirePositionId: 'v3-FL', depthMm: 5.4, depthInches: 0.21, wearPercentage: 50.9, status: 'caution' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-15T14:10:00Z' },
  { id: 'm10', vehicleId: 'v3', tirePositionId: 'v3-RR', depthMm: 3.2, depthInches: 0.13, wearPercentage: 70.9, status: 'replace' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-15T14:20:00Z' },
  { id: 'm11', vehicleId: 'v6', tirePositionId: 'v6-FL', depthMm: 8.5, depthInches: 0.33, wearPercentage: 22.7, status: 'new' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-08T08:30:00Z' },
  { id: 'm12', vehicleId: 'v6', tirePositionId: 'v6-FR', depthMm: 6.1, depthInches: 0.24, wearPercentage: 44.5, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-08T08:35:00Z' },
  // James Loehr CR-V — checked before rental return
  { id: 'm13', vehicleId: 'v9', tirePositionId: 'v9-FL', depthMm: 5.8, depthInches: 0.23, wearPercentage: 47.3, status: 'caution' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-22T09:00:00Z' },
  { id: 'm14', vehicleId: 'v9', tirePositionId: 'v9-FR', depthMm: 6.3, depthInches: 0.25, wearPercentage: 42.7, status: 'good' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-22T09:05:00Z' },
  { id: 'm15', vehicleId: 'v9', tirePositionId: 'v9-RL', depthMm: 4.9, depthInches: 0.19, wearPercentage: 55.5, status: 'caution' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-22T09:10:00Z' },
  { id: 'm16', vehicleId: 'v9', tirePositionId: 'v9-RR', depthMm: 4.5, depthInches: 0.18, wearPercentage: 59.1, status: 'caution' as const, referenceObject: 'quarter' as const, timestamp: '2026-04-22T09:15:00Z' },
];