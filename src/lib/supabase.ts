import { SEED_VEHICLES, SEED_MEASUREMENTS } from './constants';

interface TirePosition { id: string; position: string; label: string; }
interface Vehicle { id: string; name: string; licensePlate?: string; make?: string; model?: string; year?: number; tires: TirePosition[]; createdAt?: string; }
interface TreadMeasurement { id: string; vehicleId: string; tirePositionId: string; depthMm: number; depthInches: number; wearPercentage: number; status: string; referenceObject: string; timestamp?: string; }

const SUPABASE_ENABLED = process.env.NEXT_PUBLIC_SUPABASE_ENABLED === 'true';

// Lazy-load Supabase only when enabled to avoid ~48KB bundle bloat
let supabasePromise: Promise<any> | null = null;
function getSupabase() {
  if (!SUPABASE_ENABLED) return null;
  if (!supabasePromise) {
    supabasePromise = import('@supabase/supabase-js').then(({ createClient }) => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!url || !key || key.startsWith('placeholder')) return null;
      try { return createClient(url, key); } catch { return null; }
    }).catch(() => null);
  }
  return supabasePromise;
}

// Ensure seed data exists in localStorage
function ensureSeedData() {
  if (typeof window === 'undefined') return;
  const hasV = localStorage.getItem('treads_vehicles');
  if (!hasV || JSON.parse(hasV).length === 0) {
    localStorage.setItem('treads_vehicles', JSON.stringify(SEED_VEHICLES));
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
    } catch {}
  }
  return JSON.parse(localStorage.getItem('treads_vehicles') || '[]');
}

export async function getMeasurements(): Promise<TreadMeasurement[]> {
  ensureSeedData();
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('measurements').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as TreadMeasurement[];
    } catch {}
  }
  return JSON.parse(localStorage.getItem('treads_measurements') || '[]');
}

export async function addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> {
  const db = await getSupabase();
  if (db) {
    try {
      const { data, error } = await db.from('vehicles').insert({
        name: vehicle.name, license_plate: vehicle.licensePlate,
        make: vehicle.make, model: vehicle.model, year: vehicle.year,
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
    } catch {}
  }
  const id = crypto.randomUUID?.() || `${Date.now()}`;
  const newVehicle: Vehicle = {
    id, name: vehicle.name, licensePlate: vehicle.licensePlate,
    make: vehicle.make, model: vehicle.model, year: vehicle.year,
    tires: [
      { id: `${id}-FL`, position: 'FL', label: 'Front Left' },
      { id: `${id}-FR`, position: 'FR', label: 'Front Right' },
      { id: `${id}-RL`, position: 'RL', label: 'Rear Left' },
      { id: `${id}-RR`, position: 'RR', label: 'Rear Right' },
    ],
    createdAt: new Date().toISOString(),
  };
  const existing = JSON.parse(localStorage.getItem('treads_vehicles') || '[]');
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
    } catch {}
  }
  const newMeasurement: TreadMeasurement = { ...measurement, id: crypto.randomUUID?.() || `${Date.now()}` };
  const existing = JSON.parse(localStorage.getItem('treads_measurements') || '[]');
  localStorage.setItem('treads_measurements', JSON.stringify([newMeasurement, ...existing]));
  return newMeasurement;
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await getSupabase();
  if (db) { try { await db.from('vehicles').delete().eq('id', id); } catch {} }
  const existing = JSON.parse(localStorage.getItem('treads_vehicles') || '[]');
  localStorage.setItem('treads_vehicles', JSON.stringify(existing.filter((v: Vehicle) => v.id !== id)));
}

export async function uploadImage(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise<string>((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}