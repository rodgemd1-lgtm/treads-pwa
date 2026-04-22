
'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { TIRE_COSTS, estimateCost } from '@/lib/constants';

export function CostCalculator() {
  const [count, setCount] = useState(4);
  const [grade, setGrade] = useState<keyof typeof TIRE_COSTS>('midRange');
  const est = estimateCost(count, grade, 0.08);

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-lg font-bold mx-4">Replacement Cost</h2>

      <div className="card-white mx-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#767676] uppercase tracking-wider">Tire Grade</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(TIRE_COSTS).map(([key, { perTire }]) => (
              <button
                key={key}
                onClick={() => setGrade(key as keyof typeof TIRE_COSTS)}
                className={`py-2.5 rounded text-sm font-semibold border transition-all ${
                  grade === key
                    ? 'bg-[#d4002a] text-white border-[#d4002a]'
                    : 'bg-white text-[#0d0d0b] border-[#e0e0e0]'
                }`}
              >
                <span className="block capitalize text-xs">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-[10px] opacity-70">${perTire}/tire</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#767676] uppercase tracking-wider">Number of Tires</label>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setCount(Math.max(1, count - 1))} className="w-10 h-10 rounded bg-[#f4f4f4] font-bold text-lg flex items-center justify-center">-</button>
            <span className="text-2xl font-bold w-12 text-center">{count}</span>
            <button onClick={() => setCount(Math.min(12, count + 1))} className="w-10 h-10 rounded bg-[#f4f4f4] font-bold text-lg flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      <div className="card-white mx-4 space-y-3">
        <h3 className="font-bold text-sm">Estimate Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[#767676]">Tires ({count} x ${est.perTire})</span><span>${est.total.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[#767676]">Labor & Mounting</span><span>${est.laborCost.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[#767676]">Estimated Tax (8%)</span><span>${est.taxEstimate.toFixed(2)}</span></div>
          <div className="h-px bg-[#e0e0e0]" />
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#d4002a]">${est.grandTotal.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
