'use client';

import { useState } from 'react';
import { TIRE_COSTS, estimateCost } from '@/lib/constants';

export function CostCalculator() {
  const [count, setCount] = useState(4);
  const [grade, setGrade] = useState<keyof typeof TIRE_COSTS>('midRange');
  const tc = TIRE_COSTS[grade];
  const est = estimateCost(count, grade, 0.08);

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-lg font-bold mx-4">Replacement Cost</h2>

      <div className="card-white mx-4 space-y-4">
        <div>
          <label className="text-[10px] font-semibold text-[#767676] uppercase tracking-[0.15em]">Tire Grade</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(TIRE_COSTS).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setGrade(key as keyof typeof TIRE_COSTS)}
                className={`py-3 rounded-lg text-left border transition-all px-3 ${
                  grade === key
                    ? 'bg-[#d4002a] text-white border-[#d4002a]'
                    : 'bg-white text-[#0d0d0b] border-[#e0e0e0] hover:border-[#d4002a]'
                }`}
              >
                <span className="block text-xs font-semibold capitalize">{key === 'suvTruck' ? 'SUV & Truck' : key === 'midRange' ? 'Mid-Range' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="block text-[10px] mt-0.5 opacity-80">${info.perTire}/tire</span>
                <span className="block text-[9px] mt-0.5 opacity-60 leading-tight">{info.examples}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-[#767676] uppercase tracking-[0.15em]">Number of Tires</label>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setCount(Math.max(1, count - 1))} className="w-10 h-10 rounded-lg bg-[#f4f4f4] font-bold text-lg flex items-center justify-center">-</button>
            <span className="text-2xl font-bold w-12 text-center">{count}</span>
            <button onClick={() => setCount(Math.min(12, count + 1))} className="w-10 h-10 rounded-lg bg-[#f4f4f4] font-bold text-lg flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      <div className="card-white mx-4 space-y-3">
        <h3 className="font-bold text-sm">Estimate Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[#767676]">Tires ({count} x ${est.perTire})</span><span>${est.total.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[#767676]">Mounting &amp; Balance ({count} x ${tc.labor})</span><span>${est.laborCost.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[#767676]">Estimated Tax (8%)</span><span>${est.taxEstimate.toFixed(2)}</span></div>
          <div className="h-px bg-[#e0e0e0]" />
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#d4002a]">${est.grandTotal.toFixed(2)}</span></div>
        </div>
        <p className="text-[10px] text-[#767676] leading-relaxed">Estimates based on 2025 national average pricing. Actual costs vary by location, brand, and availability. Includes mounting, balancing, and valve stem.</p>
      </div>
    </div>
  );
}