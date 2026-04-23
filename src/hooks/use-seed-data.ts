'use client';

import { useEffect, useState } from 'react';
import { SEED_VEHICLES, SEED_MEASUREMENTS } from '@/lib/constants';

interface TirePosition { id: string; position: string; label: string; }
interface Vehicle { id: string; name: string; licensePlate?: string; make?: string; model?: string; year?: number; mileage?: number; tires: TirePosition[]; createdAt?: string; }
interface TreadMeasurement { id: string; vehicleId: string; tirePositionId: string; depthMm: number; depthInches: number; wearPercentage: number; status: string; referenceObject: string; timestamp?: string; }

function addTires(v: typeof SEED_VEHICLES[number]): Vehicle {
  return {
    ...v,
    tires: [
      { id: `${v.id}-FL`, position: 'FL', label: 'Front Left' },
      { id: `${v.id}-FR`, position: 'FR', label: 'Front Right' },
      { id: `${v.id}-RL`, position: 'RL', label: 'Rear Left' },
      { id: `${v.id}-RR`, position: 'RR', label: 'Rear Right' },
    ],
    createdAt: '2026-04-22T00:00:00Z',
  };
}

function safeParse<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSeedData() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [measurements, setMeasurements] = useState<TreadMeasurement[]>([]);

  useEffect(() => {
    let parsedV = safeParse<Vehicle>('treads_vehicles');
    let parsedM = safeParse<TreadMeasurement>('treads_measurements');

    if (parsedV.length === 0) {
      const seeded = SEED_VEHICLES.map(addTires);
      localStorage.setItem('treads_vehicles', JSON.stringify(seeded));
      parsedV = seeded;
    }
    setVehicles(parsedV);

    if (parsedM.length === 0) {
      localStorage.setItem('treads_measurements', JSON.stringify(SEED_MEASUREMENTS));
      parsedM = SEED_MEASUREMENTS as TreadMeasurement[];
    }
    setMeasurements(parsedM);
  }, []);

  return { vehicles, measurements };
}