'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, Ruler, CheckCircle, AlertTriangle, XCircle, Camera } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { analyzeTreadCanvas } from '@/lib/tread-measure';
import { generateUUID } from '@/lib/constants';
import type { Vehicle, TreadMeasurement } from '@/types';
import { HealthGauge } from './HealthGauge';
import { WearHeatmap } from './WearHeatmap';

export function TireCapture() {
  const [vehicles] = useLocalStorage<Vehicle[]>('treads_vehicles', []);
  const [measurements, setMeasurements] = useLocalStorage<TreadMeasurement[]>('treads_measurements', []);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedTire, setSelectedTire] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'scan' | 'reference' | 'analyzing' | 'result'>('scan');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicle);

  useEffect(() => {
    let stream: MediaStream;
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        setVideoStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {}
    }
    if (step === 'scan') initCamera();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [step]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
    if (videoStream) videoStream.getTracks().forEach(t => t.stop());
    setVideoStream(null);
    setStep('reference');
  }, [videoStream]);

  const runAnalysis = useCallback(async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setStep('analyzing');
    try {
      await new Promise(r => setTimeout(r, 800));
      const analysis = await analyzeTreadCanvas(capturedImage, 24.26);
      setResult(analysis);
      if (selectedVehicle && selectedTire) {
        const m: TreadMeasurement = {
          id: generateUUID(),
          vehicleId: selectedVehicle,
          tirePositionId: selectedTire,
          depthMm: analysis.depthMm,
          depthInches: analysis.depthInches,
          timestamp: new Date().toISOString(),
          imageUrl: analysis.annotatedImage,
          referenceObject: 'quarter' as const,
          wearPercentage: analysis.wearPercentage,
          status: analysis.status,
        };
        setMeasurements(prev => [m, ...prev]);
      }
      setStep('result');
    } finally { setAnalyzing(false); }
  }, [capturedImage, selectedVehicle, selectedTire]);

  const reset = () => { setCapturedImage(null); setResult(null); setStep('scan'); };

  const TireButton = ({ pos, label }: { pos: string; label: string }) => {
    const id = activeVehicle?.tires?.find(t => t.position === pos)?.id;
    if (!id) return null;
    return (
      <button
        onClick={() => setSelectedTire(id)}
        className={`py-2.5 rounded text-sm font-semibold border transition-all ${
          selectedTire === id ? 'bg-[#d4002a] text-white border-[#d4002a]' : 'bg-white text-[#0d0d0b] border-[#e0e0e0] hover:border-[#d4002a]'
        }`}
      >{label}</button>
    );
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Vehicle & Tire selector */}
      <div className="card-white mx-4 space-y-3">
        <label className="text-[10px] font-semibold text-[#767676] uppercase tracking-[0.15em]">Vehicle</label>
        <select
          className="w-full rounded-lg border border-[#e0e0e0] px-3 py-2.5 text-sm outline-none focus:border-[#d4002a] bg-white"
          value={selectedVehicle}
          onChange={e => { setSelectedVehicle(e.target.value); setSelectedTire(''); }}
        >
          <option value="">Select vehicle...</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} {v.licensePlate ? `- ${v.licensePlate}` : ''}</option>)}
        </select>

        {activeVehicle && (
          <>
            <label className="text-[10px] font-semibold text-[#767676] uppercase tracking-[0.15em]">Tire Position</label>
            <div className="grid grid-cols-4 gap-2">
              <TireButton pos="FL" label="FL" />
              <TireButton pos="FR" label="FR" />
              <TireButton pos="RL" label="RL" />
              <TireButton pos="RR" label="RR" />
            </div>
          </>
        )}
      </div>

      {/* Camera View */}
      {step === 'scan' && (
        <div className="mx-4 relative rounded-xl overflow-hidden bg-[#0d0d0b] aspect-[3/4]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 400">
            <path d="M20 80 L20 20 L80 20" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9"/>
            <path d="M220 20 L280 20 L280 80" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9"/>
            <path d="M20 320 L20 380 L80 380" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9"/>
            <path d="M280 380 L220 380 L220 320" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9"/>
            <circle cx="150" cy="160" r="35" stroke="#d4002a" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.9"/>
            <text x="150" y="210" textAnchor="middle" fill="white" fontSize="11" fontFamily="Inter, sans-serif" letterSpacing="1.5" opacity="0.95">PLACE QUARTER</text>
            <text x="150" y="228" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.7">IN TREAD GROOVE</text>
            <rect x="0" y="0" width="300" height="2" fill="#d4002a" className="animate-scan-line" opacity="0.7"/>
          </svg>
          <button onClick={capturePhoto} className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#d4002a] text-white px-6 py-3 rounded-full font-semibold shadow-lg active:scale-95 transition-transform">
            <Camera size={18} />
            <span>Capture</span>
          </button>
        </div>
      )}

      {(step === 'reference' || step === 'analyzing') && capturedImage && (
        <div className="mx-4 relative rounded-xl overflow-hidden">
          <img src={capturedImage} alt="Tire photo" className="w-full rounded-xl" />
          {step === 'reference' && (
            <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <button onClick={runAnalysis} className="btn-avis px-8 py-3 flex items-center gap-2">
                <Ruler size={18} />
                <span>Analyze Tread</span>
              </button>
            </div>
          )}
          {step === 'analyzing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-white border-t-[#d4002a] animate-spin mx-auto" />
                <p className="text-white font-semibold">Analyzing...</p>
                <p className="text-white/70 text-sm">Processing depth measurements</p>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'result' && result && (
        <div className="space-y-4">
          <HealthGauge depthMm={result.depthMm} wearPercentage={result.wearPercentage} status={result.status} />
          <WearHeatmap analysis={result} />
          <div className="card-white mx-4 space-y-4">
            <h3 className="font-bold text-lg">Measurement Results</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f4f4] rounded-lg p-3">
                <p className="text-[10px] text-[#767676] uppercase tracking-[0.1em]">Tread Depth</p>
                <p className="text-2xl font-bold">{result.depthMm}<span className="text-sm font-normal text-[#767676]">mm</span></p>
              </div>
              <div className="bg-[#f4f4f4] rounded-lg p-3">
                <p className="text-[10px] text-[#767676] uppercase tracking-[0.1em]">Inches</p>
                <p className="text-2xl font-bold">{result.depthInches}"</p>
              </div>
              <div className="bg-[#f4f4f4] rounded-lg p-3">
                <p className="text-[10px] text-[#767676] uppercase tracking-[0.1em]">Wear Level</p>
                <p className="text-2xl font-bold" style={{ color: result.status === 'replace' ? '#d4002a' : result.status === 'caution' ? '#b47d00' : '#1a7a3a' }}>{result.wearPercentage}%</p>
              </div>
              <div className="bg-[#f4f4f4] rounded-lg p-3">
                <p className="text-[10px] text-[#767676] uppercase tracking-[0.1em]">Confidence</p>
                <p className="text-2xl font-bold">{Math.round(result.confidence * 100)}%</p>
              </div>
            </div>
            <button onClick={reset} className="btn-avis w-full py-3">Scan Another Tire</button>
          </div>
        </div>
      )}

      {!vehicles.length && step === 'scan' && (
        <div className="card-white mx-4 text-center py-6">
          <p className="text-sm text-[#767676]">Add vehicles in the Vehicles tab to start tracking</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}