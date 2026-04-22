
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, ChevronRight, Ruler, CheckCircle, AlertTriangle } from 'lucide-react';
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

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream;
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        setVideoStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera access denied', err);
      }
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
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    if (videoStream) videoStream.getTracks().forEach(t => t.stop());
    setVideoStream(null);
    setStep('reference');
  }, [videoStream]);

  const runAnalysis = useCallback(async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setStep('analyzing');
    try {
      // Wait for dramatic effect
      await new Promise(r => setTimeout(r, 800));
      const analysis = await analyzeTreadCanvas(capturedImage, 24.26); // Quarter diameter in mm
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
    } finally {
      setAnalyzing(false);
    }
  }, [capturedImage, selectedVehicle, selectedTire]);

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setStep('scan');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Vehicle selector */}
      <div className="card-white mx-4">
        <label className="text-xs font-semibold text-avis-gray uppercase tracking-wider">Vehicle</label>
        <select
          className="mt-2 w-full rounded border border-avis-border px-3 py-2.5 text-sm outline-none focus:border-avis-red bg-white"
          value={selectedVehicle}
          onChange={e => { setSelectedVehicle(e.target.value); setSelectedTire(''); }}
        >
          <option value="">Select vehicle...</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} {v.licensePlate ? `- ${v.licensePlate}` : ''}</option>)}
        </select>

        {activeVehicle && (
          <>
            <label className="mt-3 block text-xs font-semibold text-avis-gray uppercase tracking-wider">Tire Position</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {activeVehicle.tires.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTire(t.id)}
                  className={`py-2.5 rounded text-sm font-semibold transition-all border ${
                    selectedTire === t.id
                      ? 'bg-avis-red text-white border-avis-red'
                      : 'bg-white text-avis-dark border-avis-border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Camera / Preview */}
      <div className="mx-4">
        {step === 'scan' && (
          <div className="relative rounded-xl overflow-hidden bg-avis-dark aspect-[4/5]">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {/* SVG Overlay Guide */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500">
              {/* Corner guides */}
              <path d="M20 80 L20 20 L80 20" stroke="white" strokeWidth="3" fill="none" opacity="0.9"/>
              <path d="M320 20 L380 20 L380 80" stroke="white" strokeWidth="3" fill="none" opacity="0.9"/>
              <path d="M20 420 L20 480 L80 480" stroke="white" strokeWidth="3" fill="none" opacity="0.9"/>
              <path d="M380 480 L320 480 L320 420" stroke="white" strokeWidth="3" fill="none" opacity="0.9"/>
              {/* Center circle for coin */}
              <circle cx="200" cy="200" r="40" stroke="white" strokeWidth="2" fill="none" strokeDasharray="8 4" opacity="0.8"/>
              {/* Scan line */}
              <rect x="0" y="0" width="400" height="2" fill="#d4002a" className="animate-scan-line" opacity="0.8"/>
              {/* Labels */}
              <text x="200" y="280" textAnchor="middle" fill="white" fontSize="12" fontFamily="sans-serif" opacity="0.9" letterSpacing="1">ALIGN COIN IN CENTER</text>
              <text x="200" y="300" textAnchor="middle" fill="white" fontSize="10" fontFamily="sans-serif" opacity="0.7">Press shutter to capture</text>
              {/* Side arrows indicating tire groove */}
              <path d="M120 200 L100 190 M120 200 L100 210" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
              <path d="M280 200 L300 190 M280 200 L300 210" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
            </svg>
            <button
              onClick={capturePhoto}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-avis-red animate-pulse" />
            </button>
          </div>
        )}

        {(step === 'reference' || step === 'analyzing') && capturedImage && (
          <div className="relative rounded-xl overflow-hidden">
            <img src={capturedImage} alt="Captured tire" className="w-full" />
            {step === 'reference' && (
              <div className="absolute inset-0 flex items-end pb-8 justify-center bg-black/20">
                <div className="space-y-2 text-center">
                  <p className="text-white text-sm font-medium drop-shadow-lg">Place quarter visible in tread groove</p>
                  <button onClick={runAnalysis} className="btn-avis px-8">
                    <div className="flex items-center gap-2">
                      <Ruler size={18} />
                      <span>Analyze Tread</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {step === 'analyzing' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-white border-t-avis-red animate-spin mx-auto" />
                  <p className="text-white font-semibold">Analyzing...</p>
                  <p className="text-white/70 text-sm">Processing depth measurements</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {step === 'result' && result && (
          <div className="space-y-4">
            <HealthGauge depthMm={result.depthMm} wearPercentage={result.wearPercentage} status={result.status} />
            <WearHeatmap analysis={result} />

            <div className="card-white space-y-4">
              <h3 className="font-bold text-lg">Measurement Results</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-avis-surface/30 rounded-lg p-3">
                  <p className="text-xs text-avis-gray uppercase tracking-wider">Tread Depth</p>
                  <p className="text-2xl font-bold">{result.depthMm}<span className="text-sm font-normal text-avis-gray">mm</span></p>
                </div>
                <div className="bg-avis-surface/30 rounded-lg p-3">
                  <p className="text-xs text-avis-gray uppercase tracking-wider">Inches</p>
                  <p className="text-2xl font-bold">{result.depthInches}"</p>
                </div>
                <div className="bg-avis-surface/30 rounded-lg p-3">
                  <p className="text-xs text-avis-gray uppercase tracking-wider">Wear Level</p>
                  <p className={`text-2xl font-bold ${result.status === 'replace' ? 'text-avis-red' : result.status === 'caution' ? 'text-amber-600' : 'text-green-700'}`}>{result.wearPercentage}%</p>
                </div>
                <div className="bg-avis-surface/30 rounded-lg p-3">
                  <p className="text-xs text-avis-gray uppercase tracking-wider">Confidence</p>
                  <p className="text-2xl font-bold">{Math.round(result.confidence * 100)}%</p>
                </div>
              </div>

              <button onClick={reset} className="btn-avis w-full py-3">Scan Another Tire</button>
            </div>
          </div>
        )}
      </div>

      {!vehicles.length && step === 'scan' && (
        <div className="card-white mx-4 text-center py-8 space-y-3">
          <p className="text-avis-gray text-sm">Add vehicles in Fleet to start tracking</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
