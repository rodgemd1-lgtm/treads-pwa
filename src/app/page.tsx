'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { useSeedData } from '@/hooks/use-seed-data';

// Code-split tabs for faster initial load
const TireCapture = dynamic(() => import('@/components/TireCapture').then(m => ({ default: m.TireCapture })));
const MeasurementHistory = dynamic(() => import('@/components/MeasurementHistory').then(m => ({ default: m.MeasurementHistory })));
const WearDashboard = dynamic(() => import('@/components/WearDashboard').then(m => ({ default: m.WearDashboard })));
const VehicleManager = dynamic(() => import('@/components/VehicleManager').then(m => ({ default: m.VehicleManager })));
const CostCalculator = dynamic(() => import('@/components/CostCalculator').then(m => ({ default: m.CostCalculator })));

export default function Home() {
  const [tab, setTab] = useState<'capture' | 'history' | 'dashboard' | 'vehicles' | 'costs'>('capture');
  useSeedData();

  return (
    <main className="min-h-screen bg-[#f4f4f4] pt-2 pb-20">
      <div className="max-w-lg mx-auto" role="tabpanel">
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