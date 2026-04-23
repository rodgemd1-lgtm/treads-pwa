'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Vehicle } from '@/types';
import { Car, Plus, Trash2, Download, FileJson, FileSpreadsheet } from 'lucide-react';

export function VehicleManager() {
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('treads_vehicles', []);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', make: '', model: '', year: '', licensePlate: '', vin: '', mileage: '' });

  const addVehicle = () => {
    if (!form.name.trim()) return;
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    const newVehicle: Vehicle = {
      id,
      name: form.name.trim(),
      make: form.make.trim() || undefined,
      model: form.model.trim() || undefined,
      year: form.year ? parseInt(form.year) : undefined,
      licensePlate: form.licensePlate.trim() || undefined,
      mileage: form.mileage ? parseInt(form.mileage) : undefined,
      tires: [
        { id: `${id}-FL`, position: 'FL', label: 'Front Left' },
        { id: `${id}-FR`, position: 'FR', label: 'Front Right' },
        { id: `${id}-RL`, position: 'RL', label: 'Rear Left' },
        { id: `${id}-RR`, position: 'RR', label: 'Rear Right' },
      ],
      createdAt: new Date().toISOString(),
    };
    setVehicles(prev => [newVehicle, ...prev]);
    setForm({ name: '', make: '', model: '', year: '', licensePlate: '', vin: '', mileage: '' });
    setAdding(false);
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const exportCSV = () => {
    const headers = ['Name', 'Make', 'Model', 'Year', 'License Plate', 'Mileage', 'Created'];
    const rows = vehicles.map(v => [
      v.name, v.make || '', v.model || '', v.year || '', v.licensePlate || '', v.mileage || '', v.createdAt || ''
    ].map(s => `"${s}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    download(csv, 'treads-vehicles.csv', 'text/csv');
  };

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      app: 'AVIS Tread Intel',
      version: '2.0',
      vehicles: vehicles,
      measurements: JSON.parse(localStorage.getItem('treads_measurements') || '[]'),
    };
    download(JSON.stringify(data, null, 2), 'treads-data.json', 'application/json');
  };

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between mx-4">
        <h2 className="text-lg font-bold">Fleet Vehicles</h2>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1 text-[#767676] hover:text-[#0d0d0b] text-xs" aria-label="Export vehicle data as CSV">
            <FileSpreadsheet size={14} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button onClick={exportJSON} className="flex items-center gap-1 text-[#767676] hover:text-[#0d0d0b] text-xs" aria-label="Export all data as JSON for Claude analysis">
            <FileJson size={14} />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button onClick={() => setAdding(true)} className="btn-avis px-3 py-1.5 flex items-center gap-1" aria-label="Add vehicle">
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Export help banner */}
      <div className="card-white mx-4 bg-[#f0f4ff] border border-[#3860be]/20 p-3">
        <div className="flex items-start gap-2">
          <Download size={16} className="text-[#3860be] mt-0.5 shrink-0" />
          <div className="text-[11px] text-[#3860be]">
            <p className="font-semibold">Export for Analysis</p>
            <p className="text-[#767676]">Export JSON to upload into Claude Code for fleet trends, replacement scheduling, and cost forecasting.</p>
          </div>
        </div>
      </div>

      {adding && (
        <div className="card-white mx-4 space-y-3">
          <h3 className="font-semibold text-sm">Add Vehicle</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="v-name" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">Name *</label>
              <input id="v-name" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="Toyota Camry #1207" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="v-make" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">Make</label>
                <input id="v-make" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="Toyota" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} />
              </div>
              <div>
                <label htmlFor="v-model" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">Model</label>
                <input id="v-model" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="Camry" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="v-year" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">Year</label>
                <input id="v-year" type="number" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="2025" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
              </div>
              <div>
                <label htmlFor="v-mileage" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">Mileage</label>
                <input id="v-mileage" type="number" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="32000" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} />
              </div>
            </div>
            <div>
              <label htmlFor="v-plate" className="text-[10px] font-semibold text-[#767676] uppercase tracking-wider">License Plate</label>
              <input id="v-plate" className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#d4002a]" placeholder="CO-AVS-1207" value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value.toUpperCase() })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addVehicle} disabled={!form.name.trim()} className="btn-avis flex-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed">Add Vehicle</button>
            <button onClick={() => { setAdding(false); setForm({ name: '', make: '', model: '', year: '', licensePlate: '', vin: '', mileage: '' }); }} className="px-4 py-2 rounded-lg border border-[#e0e0e0] text-sm">Cancel</button>
          </div>
        </div>
      )}

      {vehicles.map(v => (
        <div key={v.id} className="card-white mx-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{v.name}</p>
              <p className="text-[11px] text-[#767676]">{v.make && v.model ? `${v.make} ${v.model}` : ''} {v.year ? `(${v.year})` : ''} {v.mileage ? `· ${v.mileage.toLocaleString()} mi` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              {v.licensePlate && <span className="text-[10px] bg-[#f4f4f4] px-2 py-0.5 rounded text-[#767676] font-mono">{v.licensePlate}</span>}
              <button onClick={() => deleteVehicle(v.id)} className="text-[#767676] hover:text-[#d4002a] transition-colors" aria-label={`Delete ${v.name}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {['FL', 'FR', 'RL', 'RR'].map(pos => {
              const tire = v.tires?.find(t => t.position === pos);
              return (
                <div key={pos} className="bg-[#f4f4f4] rounded p-2 text-center text-[10px] text-[#767676] font-semibold">
                  {pos}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}