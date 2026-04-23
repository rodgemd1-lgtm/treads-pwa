'use client';

import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Vehicle, TreadMeasurement } from '@/types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function WearDashboard() {
  const [vehicles] = useLocalStorage<Vehicle[]>('treads_vehicles', []);
  const [measurements] = useLocalStorage<TreadMeasurement[]>('treads_measurements', []);

  const latestByTire = useMemo(() => {
    const map = new Map<string, TreadMeasurement>();
    for (const m of [...measurements].reverse()) {
      const key = `${m.vehicleId}-${m.tirePositionId}`;
      if (!map.has(key)) map.set(key, m);
    }
    return map;
  }, [measurements]);

  const stats = useMemo(() => {
    let healthy = 0, caution = 0, replace = 0;
    for (const m of latestByTire.values()) {
      if (m.status === 'new' || m.status === 'good') healthy++;
      else if (m.status === 'caution') caution++;
      else replace++;
    }
    return { total: latestByTire.size, healthy, caution, replace };
  }, [latestByTire]);

  const tireDot = (status: string) => {
    const map: Record<string, string> = { new: '#3860be', good: '#1a7a3a', caution: '#b47d00', replace: '#d4002a' };
    return map[status] || '#767676';
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = { new: 'New', good: 'Good', caution: 'Caution', replace: 'Replace' };
    return map[status] || status;
  };

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-lg font-bold mx-4">Fleet Health</h2>

      <div className="grid grid-cols-3 gap-2 mx-4" role="group" aria-label="Fleet health summary">
        <div className="card-white p-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-[#1a7a3a]" aria-hidden="true" />
          <div><p className="text-xl font-bold">{stats.healthy}</p><p className="text-[10px] text-[#767676] uppercase">Pass</p></div>
        </div>
        <div className="card-white p-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#b47d00]" aria-hidden="true" />
          <div><p className="text-xl font-bold">{stats.caution}</p><p className="text-[10px] text-[#767676] uppercase">Watch</p></div>
        </div>
        <div className="card-white p-3 flex items-center gap-2">
          <XCircle size={18} className="text-[#d4002a]" aria-hidden="true" />
          <div><p className="text-xl font-bold">{stats.replace}</p><p className="text-[10px] text-[#767676] uppercase">Fail</p></div>
        </div>
      </div>

      {vehicles.map(v => {
        const tires = (v.tires || []).map(t => ({ tire: t, measure: latestByTire.get(`${v.id}-${t.id}`) }));
        return (
          <div key={v.id} className="card-white mx-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{v.name}</p>
              {v.licensePlate && <span className="text-[10px] bg-[#f4f4f4] px-2 py-0.5 rounded text-[#767676]">{v.licensePlate}</span>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tires.map(({ tire, measure }) => (
                <div key={tire.id} className="bg-[#f4f4f4] rounded-lg p-3 text-center">
                  <span className="text-[9px] text-[#767676] block mb-1">{tire.position}</span>
                  {measure ? (
                    <>
                      <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: tireDot(measure.status) }} role="img" aria-label={`Status: ${statusLabel(measure.status)}`} />
                      <p className="text-sm font-bold">{measure.depthMm}mm</p>
                    </>
                  ) : (
                    <p className="text-[10px] text-[#c7c5c5]">No data</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}