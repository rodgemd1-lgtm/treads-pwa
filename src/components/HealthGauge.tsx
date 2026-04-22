
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

function getStatusInfo(status: string) {
  switch (status) {
    case 'new': return { label: 'EXCELLENT', color: '#3860be', bgColor: '#e3f2fd', subtext: 'Tread in peak condition' };
    case 'good': return { label: 'GOOD', color: '#1a7a3a', bgColor: '#e8f5e9', subtext: 'Meets safety standards' };
    case 'caution': return { label: 'CAUTION', color: '#b47d00', bgColor: '#fffbe6', subtext: 'Plan replacement' };
    case 'replace': return { label: 'REPLACE', color: '#d4002a', bgColor: '#ffebee', subtext: 'Safety critical - replace now' };
    default: return { label: 'UNKNOWN', color: '#767676', bgColor: '#f4f4f4', subtext: '' };
  }
}

export function HealthGauge({ depthMm, wearPercentage, status }: { depthMm: number; wearPercentage: number; status: string }) {
  const info = getStatusInfo(status);
  const [animatedWear, setAnimatedWear] = useState(0);
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (animatedWear / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWear(wearPercentage), 100);
    return () => clearTimeout(timer);
  }, [wearPercentage]);

  return (
    <div className="card-white mx-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Health Status</h3>
        <span className="text-xs font-semibold text-avis-gray uppercase tracking-wider">2/32" remaining</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-36 h-36 shrink-0">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="58" fill="none" stroke="#e0e0e0" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="58"
              fill="none"
              stroke={info.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: info.color }}>{Math.round(animatedWear)}%</span>
            <span className="text-[10px] text-avis-gray uppercase tracking-wider">Wear</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {status === 'new' && <CheckCircle size={20} className="text-green-700" />}
            {status === 'good' && <CheckCircle size={20} className="text-green-700" />}
            {status === 'caution' && <AlertTriangle size={20} className="text-amber-600" />}
            {status === 'replace' && <XCircle size={20} className="text-avis-red" />}
            <span className="font-bold text-sm" style={{ color: info.color }}>{info.label}</span>
          </div>
          <p className="text-xs text-avis-gray">{info.subtext}</p>
          <p className="text-xs text-avis-dark font-medium">{depthMm}mm remaining</p>
        </div>
      </div>
    </div>
  );
}
