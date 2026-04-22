
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState } from 'react';
import type { Vehicle, TreadMeasurement } from '@/types';
import { Trash2, Clock } from 'lucide-react';

export function MeasurementHistory() {
  const [vehicles] = useLocalStorage<Vehicle[]>('treads_vehicles', []);
  const [measurements, setMeasurements] = useLocalStorage<TreadMeasurement[]>('treads_measurements', []);

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      new: { bg: 'bg-[#e3f2fd]', text: 'text-[#3860be]' },
      good: { bg: 'bg-[#e8f5e9]', text: 'text-[#1a7a3a]' },
      caution: { bg: 'bg-[#fffbe6]', text: 'text-[#b47d00]' },
      replace: { bg: 'bg-[#ffebee]', text: 'text-[#d4002a]' },
    };
    const s = map[status] || map.good;
    return <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${s.bg} ${s.text}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-lg font-bold mx-4">Scan History</h2>
      {!measurements.length ? (
        <div className="card-white mx-4 text-center py-12">
          <Clock className="mx-auto mb-3 text-[#c7c5c5]" size={36} />
          <p className="text-sm text-[#767676]">No scans yet</p>
          <p className="text-xs text-[#c7c5c5] mt-1">Take your first tread measurement</p>
        </div>
      ) : (
        <div className="space-y-2 mx-4">
          {measurements.map(m => {
            const vehicle = vehicles.find(v => v.id === m.vehicleId);
            const tire = vehicle?.tires.find(t => t.id === m.tirePositionId);
            return (
              <div key={m.id} className="card-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{vehicle?.name || 'Unknown'}</p>
                    <p className="text-xs text-[#767676]">{tire?.label || m.tirePositionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{m.depthMm}mm</p>
                    <p className="text-xs text-[#767676]">{m.depthInches}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {statusBadge(m.status)}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#767676]">{new Date(m.timestamp).toLocaleDateString()}</span>
                    <button onClick={() => deleteMeasurement(m.id)} className="text-[#c7c5c5] hover:text-[#d4002a] p-1"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
