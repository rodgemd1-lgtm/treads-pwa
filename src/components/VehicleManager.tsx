
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { Plus, Trash2, Car } from 'lucide-react';
import { useState } from 'react';
import type { Vehicle } from '@/types';
import { generateUUID } from '@/lib/constants';

function defaultTires() {
  return [
    { id: generateUUID(), position: 'FL' as const, label: 'Front Left' },
    { id: generateUUID(), position: 'FR' as const, label: 'Front Right' },
    { id: generateUUID(), position: 'RL' as const, label: 'Rear Left' },
    { id: generateUUID(), position: 'RR' as const, label: 'Rear Right' },
  ];
}

export function VehicleManager() {
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('treads_vehicles', []);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const addVehicle = () => {
    if (!name.trim()) return;
    const v: Vehicle = {
      id: generateUUID(),
      name: name.trim(),
      licensePlate: plate.trim() || undefined,
      make: make.trim() || undefined,
      model: model.trim() || undefined,
      tires: defaultTires(),
      createdAt: new Date().toISOString(),
    };
    setVehicles(prev => [...prev, v]);
    setName(''); setPlate(''); setMake(''); setModel('');
    setShowAdd(false);
  };

  const removeVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between mx-4">
        <h2 className="text-lg font-bold">Fleet Vehicles</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-ghost px-3 py-1.5 text-sm">
          <Plus size={16} className="inline mr-1" />Add
        </button>
      </div>

      {showAdd && (
        <div className="card-white mx-4 space-y-3">
          <input className="w-full rounded border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#d4002a]" placeholder="Vehicle name (e.g. Camry #12)" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full rounded border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#d4002a]" placeholder="License plate" value={plate} onChange={e => setPlate(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#d4002a]" placeholder="Make" value={make} onChange={e => setMake(e.target.value)} />
            <input className="rounded border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#d4002a]" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={addVehicle} className="btn-avis flex-1">Add Vehicle</button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </div>
      )}

      {!vehicles.length ? (
        <div className="card-white mx-4 text-center py-12">
          <Car className="mx-auto mb-3 text-[#767676]" size={40} />
          <p className="text-sm text-[#767676]">No vehicles in fleet yet</p>
          <p className="text-xs text-[#c7c5c5] mt-1">Add vehicles to start tracking tire health</p>
        </div>
      ) : (
        <div className="space-y-2 mx-4">
          {vehicles.map(v => (
            <div key={v.id} className="card-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#d4002a]/10 flex items-center justify-center">
                    <Car size={18} className="text-[#d4002a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{v.name}</p>
                    <p className="text-xs text-[#767676]">
                      {[v.make, v.model].filter(Boolean).join(' ')}
                      {v.licensePlate ? ` - ${v.licensePlate}` : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeVehicle(v.id)} className="p-2 text-[#c7c5c5] hover:text-[#d4002a] transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {v.tires?.map(t => (
                  <div key={t.id} className="bg-[#f4f4f4] rounded p-1.5 text-center">
                    <span className="text-[9px] text-[#767676]">{t.position}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
