'use client';

import { Camera, Clock, Gauge, Car, DollarSign } from 'lucide-react';

const tabs = [
  { key: 'capture', label: 'Scan', icon: Camera },
  { key: 'history', label: 'History', icon: Clock },
  { key: 'dashboard', label: 'Fleet', icon: Gauge },
  { key: 'vehicles', label: 'Vehicles', icon: Car },
  { key: 'costs', label: 'Costs', icon: DollarSign },
] as const;

export function Navbar({ active, onChange }: { active: string; onChange: (t: typeof tabs[number]['key']) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0e0e0]" role="tablist" aria-label="App navigation">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map(tab => {
          const isActive = active === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onChange(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all ${
                isActive ? 'text-[#d4002a] scale-105' : 'text-[#767676]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} aria-hidden="true" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}