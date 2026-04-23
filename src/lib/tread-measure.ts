
import { getTreadStatus } from './constants';

export interface AnalysisResult {
  depthMm: number;
  depthInches: number;
  wearPercentage: number;
  status: 'new' | 'good' | 'caution' | 'replace';
  confidence: number;
  annotatedImage: string;
  grooves: number;
  blocks: number;
}

// Named constants for calibration
const MAX_NEW_TREAD_MM = 11;

/**
 * Detect a circular reference object using Sobel edge detection
 * and centroid-based circle reconstruction.
 * Supports: US Quarter (24.26mm), US Penny (19.05mm), or manual gauge (0mm)
 */
function detectCoin(data: ImageData): { cx: number; cy: number; radius: number; found: boolean } {
  const W = data.width, H = data.height;
  const grey = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) grey[i] = 0.299 * data.data[i * 4] + 0.587 * data.data[i * 4 + 1] + 0.114 * data.data[i * 4 + 2];

  // Edge magnitude using Sobel
  const edgeMag = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -grey[i - W - 1] + grey[i - W + 1] - 2 * grey[i - 1] + 2 * grey[i + 1] - grey[i + W - 1] + grey[i + W + 1];
      const gy = -grey[i - W - 1] - 2 * grey[i - W] - grey[i - W + 1] + grey[i + W - 1] + 2 * grey[i + W] + grey[i + W + 1];
      edgeMag[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // Adaptive threshold: use mean + 1.5 stdev for edge detection
  const edgeMean = edgeMag.reduce((s, v) => s + v, 0) / edgeMag.length;
  const edgeStd = Math.sqrt(edgeMag.reduce((s, v) => s + (v - edgeMean) ** 2, 0) / edgeMag.length);
  const edgeThreshold = Math.max(40, edgeMean + 1.5 * edgeStd);

  const edges: [number, number][] = [];
  for (let i = 0; i < W * H; i++) {
    if (edgeMag[i] > edgeThreshold) {
      edges.push([i % W, Math.floor(i / W)]);
    }
  }

  if (edges.length < 20) return { cx: W / 2, cy: H / 2, radius: Math.max(W, H) * 0.15, found: false };

  // Weighted centroid (edge magnitude as weight)
  let cx = 0, cy = 0, totalWeight = 0;
  for (const [ex, ey] of edges) {
    const w = edgeMag[ey * W + ex];
    cx += ex * w;
    cy += ey * w;
    totalWeight += w;
  }
  cx /= totalWeight;
  cy /= totalWeight;

  // Compute weighted average radius
  let radiusSum = 0, radiusWeight = 0;
  for (const [ex, ey] of edges) {
    const d = Math.sqrt((ex - cx) ** 2 + (ey - cy) ** 2);
    const w = edgeMag[ey * W + ex];
    radiusSum += d * w;
    radiusWeight += w;
  }
  const radius = radiusWeight > 0 ? radiusSum / radiusWeight : Math.max(W, H) * 0.15;

  return { cx, cy, radius, found: edges.length >= 30 };
}

/**
 * Segment tread grooves using adaptive thresholding on vertical bands.
 */
function segmentGrooves(grey: Uint8Array, width: number, height: number) {
  const W = width, H = height;
  // Compute vertical profile in center band
  const bandStart = Math.floor(H * 0.35);
  const bandEnd = Math.floor(H * 0.65);

  const profile: number[] = [];
  for (let x = 0; x < W; x++) {
    let sum = 0, cnt = 0;
    for (let y = bandStart; y < bandEnd; y++) {
      sum += grey[y * W + x];
      cnt++;
    }
    profile.push(sum / cnt);
  }

  // Smooth
  const smooth: number[] = [];
  const win = 5;
  for (let x = 0; x < W; x++) {
    let s = 0, c = 0;
    for (let w = -win; w <= win; w++) {
      const idx = Math.max(0, Math.min(W - 1, x + w));
      s += profile[idx]; c++;
    }
    smooth.push(s / c);
  }

  // Find minima (dark grooves) and maxima (peaks/blocks)
  const grooves: number[] = [];
  const blocks: number[] = [];
  for (let x = 1; x < W - 1; x++) {
    const prev = smooth[x - 1], cur = smooth[x], next = smooth[x + 1];
    if (cur < prev && cur < next && prev - cur > 3) grooves.push(x);
    if (cur > prev && cur > next && cur - next > 3) blocks.push(x);
  }

  return { grooves, blocks, profile: smooth };
}

export async function analyzeTreadCanvas(
  imageDataUrl: string,
  coinDiameterMm: number = 24.26
): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        const W = Math.min(img.width, 1280);
        const H = Math.round(W * (img.height / img.width));
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(img, 0, 0, W, H);

        const imgData = ctx.getImageData(0, 0, W, H);
        const grey = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
          grey[i] = 0.299 * imgData.data[i * 4] + 0.587 * imgData.data[i * 4 + 1] + 0.114 * imgData.data[i * 4 + 2];
        }

        // 1. Detect reference coin
        const { cx, cy, radius, found } = detectCoin(imgData);
        let pxPerMm = 1;
        if (found && radius > 5) {
          pxPerMm = (radius * 2) / coinDiameterMm;
        }

        // 2. Segment grooves
        const { grooves, blocks, profile } = segmentGrooves(grey, W, H);

        // 3. Calculate depth from groove spacing
        const grooveDepths: number[] = [];
        for (let i = 0; i < grooves.length; i++) {
          const g1 = grooves[i];
          const nearestBlock = blocks.reduce((best, b) =>
            Math.abs(b - g1) < Math.abs(best - g1) ? b : best,
            blocks[0] ?? g1
          );
          grooveDepths.push(Math.abs(nearestBlock - g1));
        }

        const avgDepthPx = grooveDepths.length > 0
          ? grooveDepths.reduce((a, b) => a + b, 0) / grooveDepths.length
          : Math.max(W * 0.05, 10);

        const depthMm = avgDepthPx / pxPerMm;
        const depthInches = depthMm / 25.4;
        const status = getTreadStatus(depthMm);
        const wearPercentage = Math.max(0, Math.min(100, ((MAX_NEW_TREAD_MM - depthMm) / MAX_NEW_TREAD_MM) * 100));

        // 4. Draw annotations on canvas
        // Draw detected coin circle
        if (found) {
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#00e5ff';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(`Reference: ${coinDiameterMm}mm`, cx - 50, cy - radius - 10);
        }

        // Draw tread bands and groove markers
        const bandStart = Math.floor(H * 0.35);
        const bandEnd = Math.floor(H * 0.65);
        ctx.strokeStyle = 'rgba(212,0,42,0.7)';
        ctx.lineWidth = 2;
        for (const g of grooves) {
          ctx.beginPath();
          ctx.moveTo(g, bandStart);
          ctx.lineTo(g, bandEnd);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(26,122,58,0.7)';
        for (const b of blocks) {
          ctx.beginPath();
          ctx.moveTo(b, bandStart);
          ctx.lineTo(b, bandEnd);
          ctx.stroke();
        }

        // Draw depth measurement line
        if (grooves.length > 0 && blocks.length > 0) {
          const centerY = (bandStart + bandEnd) / 2;
          const showGroove = grooves[Math.floor(grooves.length / 2)];
          const showBlock = blocks.reduce((best, b) => Math.abs(b - showGroove) < Math.abs(best - showGroove) ? b : best, blocks[0]);
          const topY = centerY - 20;
          const bottomY = centerY + 20;

          ctx.strokeStyle = '#d4002a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(showBlock, topY);
          ctx.lineTo(showBlock, bottomY);
          ctx.stroke();

          // Arrow showing depth
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(showBlock + 5, topY + 5);
          ctx.lineTo(showBlock - 5, topY);
          ctx.lineTo(showBlock + 5, topY - 5);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(showBlock + 5, bottomY + 5);
          ctx.lineTo(showBlock - 5, bottomY);
          ctx.lineTo(showBlock + 5, bottomY - 5);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.fillRect(showBlock + 10, centerY - 10, 80, 20);
          ctx.fillStyle = '#d4002a';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(`${depthMm.toFixed(1)}mm`, showBlock + 15, centerY + 4);
        }

        // Confidence based on detection quality
        let confidence = 0.3;
        if (found) confidence += 0.3;
        if (grooves.length >= 3 && blocks.length >= 3) confidence += 0.3;
        if (depthMm > 2 && depthMm < 30) confidence += 0.1;
        confidence = Math.min(1, confidence);

        resolve({
          depthMm: Math.round(depthMm * 10) / 10,
          depthInches: Math.round(depthInches * 100) / 100,
          wearPercentage: Math.round(wearPercentage * 10) / 10,
          status: status.status,
          confidence: +confidence.toFixed(2),
          annotatedImage: canvas.toDataURL('image/jpeg', 0.92),
          grooves: grooves.length,
          blocks: blocks.length,
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
}
