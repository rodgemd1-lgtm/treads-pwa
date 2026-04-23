'use client';

import { useMemo } from 'react';
import type { AnalysisResult } from '@/lib/tread-measure';

export function WearHeatmap({ analysis }: { analysis: AnalysisResult }) {
  const MAX_NEW_TREAD_MM = 11;

  const blocks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const deviation = ((i * 997) % 20) / 100; // deterministic pseudo-noise
      const noise = 0.9 + deviation;
      const baseWear = analysis.wearPercentage / 100;
      const localWear = Math.min(1, Math.max(0, baseWear * noise));
      return { index: i, wear: localWear };
    });
  }, [analysis.wearPercentage]);

  const color = (wear: number) => {
    if (wear < 0.3) return '#1a7a3a';
    if (wear < 0.55) return '#3860be';
    if (wear < 0.65) return '#b47d00';
    if (wear < 0.75) return '#d4002a';
    return '#91001d';
  };

  return (
    <div className="card-white mx-4 space-y-3">
      <h3 className="font-bold text-sm">Tread Profile</h3>
      <div className="grid grid-cols-6 gap-1.5" role="img" aria-label={`Tread wear profile showing ${Math.round(analysis.wearPercentage)}% average wear`}>
        {blocks.map(({ index, wear }) => (
          <div
            key={index}
            className="aspect-square rounded-sm flex items-end justify-center pb-0.5"
            style={{ background: color(wear) }}
            aria-hidden="true"
          >
            <span className="text-[8px] text-white/80 font-medium">{Math.round(wear * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-[#767676]">
        <span>Shoulder</span>
        <span>Center</span>
        <span>Shoulder</span>
      </div>
    </div>
  );
}