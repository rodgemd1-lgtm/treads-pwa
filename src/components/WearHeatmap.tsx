'use client';

import { useMemo } from 'react';

export function WearHeatmap({ analysis }: { analysis: any }) {
  const blocks = useMemo(() => {
    const count = 12;
    const baseDepth = analysis?.depthMm || 6;
    return Array.from({ length: count }, (_, i) => {
      const outerFactor = i < 3 || i > 8 ? 0.85 : 1;
      const noise = 0.9 + Math.random() * 0.2;
      const depth = Math.max(2, (baseDepth * outerFactor * noise));
      const wear = Math.min(100, ((10 - depth) / 10) * 100);
      return { id: i, depth, wear };
    });
  }, [analysis]);

  const getBlockColor = (wear: number) => {
    if (wear < 30) return '#3860be';
    if (wear < 50) return '#1a7a3a';
    if (wear < 75) return '#b47d00';
    return '#d4002a';
  };

  return (
    <div className="card-white mx-4 space-y-3">
      <h3 className="font-bold">Tread Profile</h3>
      <div className="flex items-center gap-1">
        {blocks.map(b => (
          <div key={b.id} className="flex flex-col items-center gap-0.5">
            <div
              className="w-6 rounded-sm transition-all tread-block"
              style={{
                height: `${Math.max(12, 40 - b.wear * 0.35)}px`,
                background: getBlockColor(b.wear),
                opacity: 0.85,
              }}
            />
            <span className="text-[8px] text-avis-gray">{Math.round(b.depth * 10) / 10}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-avis-gray">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#3860be'}} /><span>{'Excellent <30%'}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#1a7a3a'}} /><span>Good 30-50%</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#b47d00'}} /><span>Caution 50-75%</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{background:'#d4002a'}} /><span>{'Replace >75%'}</span></div>
      </div>
    </div>
  );
}