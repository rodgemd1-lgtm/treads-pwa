'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TireCapture } from '@/components/TireCapture';
import { MeasurementHistory } from '@/components/MeasurementHistory';
import { VehicleManager } from '@/components/VehicleManager';
import { WearDashboard } from '@/components/WearDashboard';
import { CostCalculator } from '@/components/CostCalculator';

export default function Home() {
  const [tab, setTab] = useState<'capture' | 'history' | 'dashboard' | 'vehicles' | 'costs'>('capture');

  return (
    <main className="min-h-screen bg-[#f4f4f4] pt-4 pb-20">
      <div className="max-w-lg mx-auto">
        {tab === 'capture' && <TireCapture />}
        {tab === 'history' && <MeasurementHistory />}
        {tab === 'dashboard' && <WearDashboard />}
        {tab === 'vehicles' && <VehicleManager />}
        {tab === 'costs' && <CostCalculator />}
      </div>
      <Navbar active={tab} onChange={setTab} />
    </main>
  );
}