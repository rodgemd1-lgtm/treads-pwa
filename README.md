# AVIS Tread Intel PWA

Enterprise tire tread measurement system for Avis fleet management.

**Live:** https://treads-pwa.vercel.app

## Features

- **Scan** — WebRTC camera capture with coin-based calibration (US quarter = 24.26mm)
- **CV Engine** — Sobel edge detection, groove/peak segmentation, mm depth calculation
- **Fleet Health** — Dashboard with pass/watch/fail counts per vehicle
- **Vehicles** — Manage fleet vehicles with FL/FR/RL/RR tire positions
- **Cost Calculator** — 2025 real tire pricing with labor and tax estimates
- **PWA** — Installable, offline-capable, service worker with cache strategy

## Tech Stack

- Next.js 16 (static export)
- React 19 + TypeScript
- Tailwind CSS with Avis brand tokens
- Supabase (optional, with localStorage fallback)
- Vercel deployment

## Development

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
npm run build      # Static export to dist/
```

## Deployment

```bash
vercel deploy --yes --prod --force
```

## Supabase Setup (Optional)

1. Create project at https://supabase.com
2. Run `supabase/schema.sql` against the database
3. Run `supabase/seed.sql` for demo data
4. Update `.env.local` with your URL and anon key
5. Set `NEXT_PUBLIC_SUPABASE_ENABLED=true`

## Tire Cost Data (2025 National Averages)

| Grade | Per Tire | Examples |
|-------|----------|----------|
| Economy | $85 | Hyundai Venue, Kia Soul, Toyota Corolla |
| Mid-Range | $145 | Toyota Camry, VW Jetta, Chevrolet Malibu |
| Premium | $220 | Cadillac CT5, Lincoln Navigator, Mercedes C300 |
| SUV/Truck | $185 | Ford Explorer, GMC Yukon, Chevy Equinox |

Labor: $20-40/tire + mounting + valve stem. Tax: ~8%.

## Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```