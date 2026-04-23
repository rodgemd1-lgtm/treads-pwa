import { SEED_VEHICLES, SEED_MEASUREMENTS } from './constants';

interface TirePosition { id: string; position: string; label: string; }
interface Vehicle { id: string; name: string; licensePlate?: string; vin?: string; make?: string; model?: string; year?: number; mileage?: number; tires: TirePosition[]; createdAt?: string; }
interface TreadMeasurement { id: string; vehicleId: string; tirePositionId: string; depthMm: number; depthInches: number; wearPercentage: number; status: string; referenceObject: string; timestamp?: string; }

const SUPABASE_ENABLED = process.env.NEXT_PUBLIC_SUPABASE_ENABLED === 'true';

let supabasePromise: Promise<any> | null = null;
function getSupabase() {
  if (!SUPABASE_ENABLED) return null;
  if (!supabasePromise) {
    supabasePromise = import('@supabase/supabase-js').then(({ createClient }) => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!url || !key || key.startsWith('placeholder')) return null;
      try { return createClient(url, key); } catch (e) { console.error('Supabase init error:', e); return null; }
    }).catch(e => { console.error('Supabase import error:', e); return null; });
  }
  return supabasePromise;
}

function safeParse<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { console.error(`localStorage parse error for "${key}":`, e); return []; }
}

function ensureSeedData() {
  if (typeof window === 'undefined') return;
  const vehicles = safeParse<Vehicle>('treads_vehicles');
  if (vehicles.length === 0) {
    localStorage.setItem('treads_vehicles', JSON.stringify(SEED_VEHICLES));
  }
  const measurements = safeParse<TreadMeasurement>('treads_measurements');
  if (measurements.length === 0) {
    localStorage.setItem('treads_measurements', JSON.stringify(SEED_MEASUREMENTS));
  }
}

if (typeof window !== 'undefined') { ensureSeedData(); }

export async function getVehicles(): Promise<Vehicle[]> {
  ensureSeedData();
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('vehicles').select('*, tires:tire_positions(*)');
      if (!error && data && data.length > 0) return data as Vehicle[];
    } catch (e) { console.error('Supabase getVehicles error:', e); }
  }
  return safeParse<Vehicle>('treads_vehicles');
}

export async function getMeasurements(): Promise<TreadMeasurement[]> {
  ensureSeedData();
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('measurements').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as TreadMeasurement[];
    } catch (e) { console.error('Supabase getMeasurements error:', e); }
  }
  return safeParse<TreadMeasurement>('treads_measurements');
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> {
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('vehicles').insert({
        name: vehicle.name, license_plate: vehicle.licensePlate, vin: vehicle.vin,
        make: vehicle.make, model: vehicle.model, year: vehicle.year, mileage: vehicle.mileage,
      }).select().single();
      if (!error && data) {
        const positions = ['FL', 'FR', 'RL', 'RR'] as const;
        const labels = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'];
        for (let i = 0; i < positions.length; i++) {
          await db.from('tire_positions').insert({ vehicle_id: data.id, position: positions[i], label: labels[i] });
        }
        const allVehicles = await getVehicles();
        localStorage.setItem('treads_vehicles', JSON.stringify(allVehicles));
        return data as Vehicle;
      }
    } catch (e) { console.error('Supabase addVehicle error:', e); }
  }
  const id = crypto.randomUUID?.() || `${Date.now()}`;
  const newVehicle: Vehicle = {
    id, name: vehicle.name, licensePlate: vehicle.licensePlate, vin: vehicle.vin,
    make: vehicle.make, model: vehicle.model, year: vehicle.year, mileage: vehicle.mileage,
    tires: [
      { id: `${id}-FL`, position: 'FL', label: 'Front Left' },
      { id: `${id}-FR`, position: 'FR', label: 'Front Right' },
      { id: `${id}-RL`, position: 'RL', label: 'Rear Left' },
      { id: `${id}-RR`, position: 'RR', label: 'Rear Right' },
    ],
    createdAt: new Date().toISOString(),
  };
  const existing = safeParse<Vehicle>('treads_vehicles');
  localStorage.setItem('treads_vehicles', JSON.stringify([newVehicle, ...existing]));
  return newVehicle;
}

export async function addMeasurement(measurement: Omit<TreadMeasurement, 'id'>): Promise<TreadMeasurement> {
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('measurements').insert({
        vehicle_id: measurement.vehicleId, tire_position_id: measurement.tirePositionId,
        depth_mm: measurement.depthMm, depth_inches: measurement.depthInches,
        wear_percentage: measurement.wearPercentage, status: measurement.status,
        reference_object: measurement.referenceObject, confidence: measurement.wearPercentage > 0 ? 0.8 : 0.5,
      }).select().single();
      if (!error && data) {
        if (measurement.status === 'replace') {
          await db.from('wear_alerts').insert({ vehicle_id: measurement.vehicleId, tire_position_id: measurement.tirePositionId, message: `Tire at ${measurement.depthMm}mm - below safe threshold. Replace immediately.`, severity: 'critical' });
        } else if (measurement.status === 'caution') {
          await db.from('wear_alerts').insert({ vehicle_id: measurement.vehicleId, tire_position_id: measurement.tirePositionId, message: `Tire at ${measurement.depthMm}mm - approaching wear bar.`, severity: 'warning' });
        }
        return data as TreadMeasurement;
      }
    } catch (e) { console.error('Supabase addMeasurement error:', e); }
  }
  const newMeasurement: TreadMeasurement = { ...measurement, id: crypto.randomUUID?.() || `${Date.now()}` };
  const existing = safeParse<TreadMeasurement>('treads_measurements');
  localStorage.setItem('treads_measurements', JSON.stringify([newMeasurement, ...existing]));
  return newMeasurement;
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await getSupabase();
  if (db) { try { await db.from('vehicles').delete().eq('id', id); } catch (e) { console.error('Supabase deleteVehicle error:', e); } }
  const existing = safeParse<Vehicle>('treads_vehicles');
  localStorage.setItem('treads_vehicles', JSON.stringify(existing.filter(v => v.id !== id)));
}

export function exportData(): { vehicles: Vehicle[]; measurements: TreadMeasurement[]; exportedAt: string; app: string } {
  return {
    vehicles: safeParse<Vehicle>('treads_vehicles'),
    measurements: safeParse<TreadMeasurement>('treads_measurements'),
    exportedAt: new Date().toISOString(),
    app: 'AVIS Tread Intel v2.0',
  };
}

export function exportCSV(): string {
  const vehicles = safeParse<Vehicle>('treads_vehicles');
  const measurements = safeParse<TreadMeasurement>('treads_measurements');
  const headers = ['Vehicle', 'License Plate', 'Make', 'Model', 'Year', 'Mileage', 'Tire Position', 'Depth (mm)', 'Depth (in)', 'Wear %', 'Status', 'Date'];
  const rows = [];
  for (const v of vehicles) {
    const vMeasurements = measurements.filter(m => m.vehicleId === v.id);
    if (vMeasurements.length === 0) {
      rows.push([v.name, v.licensePlate || '', v.make || '', v.model || '', v.year || '', v.mileage || '', 'All', 'N/A', 'N/A', 'N/A', 'No data', ''].map(s => `"${s}"`).join(','));
    }
    for (const m of vMeasurements) {
      rows.push([v.name, v.licensePlate || '', v.make || '', v.model || '', v.year || '', v.mileage || '', m.tirePositionId, m.depthMm, m.depthInches, m.wearPercentage, m.status, m.timestamp || ''].map(s => `"${s}"`).join(','));
    }
  }
  return [headers.join(','), ...rows].join('\n');
}