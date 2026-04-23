'use client';

import { useEffect, useState } from 'react';
import { SEED_VEHICLES, SEED_MEASUREMENTS } from '@/lib/constants';

interface TirePosition { id: string; position: string; label: string; }
interface Vehicle { id: string; name: string; licensePlate?: string; make?: string; model?: string; year?: number; tires: TirePosition[]; createdAt?: string; }
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
    createdAt: '2026-04-20T00:00:00Z',
  };
}

export function useSeedData() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [measurements, setMeasurements] = useState<TreadMeasurement[]>([]);

  useEffect(() => {
    const storedV = localStorage.getItem('treads_vehicles');
    if (!storedV || JSON.parse(storedV).length === 0) {
      const seeded = SEED_VEHICLES.map(addTires);
      localStorage.setItem('treads_vehicles', JSON.stringify(seeded));
      setVehicles(seeded);
    } else {
      setVehicles(JSON.parse(storedV));
    }

    const storedM = localStorage.getItem('treads_measurements');
    if (!storedM || JSON.parse(storedM).length === 0) {
      localStorage.setItem('treads_measurements', JSON.stringify(SEED_MEASUREMENTS));
      setMeasurements(SEED_MEASUREMENTS);
    } else {
      setMeasurements(JSON.parse(storedM));
    }
  }, []);

  return { vehicles, measurements };
}