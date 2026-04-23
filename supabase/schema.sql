-- AVIS Treads - Supabase Schema
-- Created: 2026-04-22

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  license_plate TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  mileage INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tire positions per vehicle
CREATE TABLE IF NOT EXISTS tire_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  position TEXT NOT NULL CHECK (position IN ('FL', 'FR', 'RL', 'RR', 'Spare')),
  label TEXT NOT NULL,
  UNIQUE(vehicle_id, position)
);

-- Tread measurements
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  tire_position_id UUID NOT NULL REFERENCES tire_positions(id) ON DELETE CASCADE,
  depth_mm NUMERIC(5,2) NOT NULL,
  depth_inches NUMERIC(5,3) NOT NULL,
  wear_percentage NUMERIC(5,1) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'good', 'caution', 'replace')),
  reference_object TEXT NOT NULL CHECK (reference_object IN ('quarter', 'penny', 'gauge')),
  image_url TEXT,
  annotated_image_url TEXT,
  confidence NUMERIC(3,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wear alerts
CREATE TABLE IF NOT EXISTS wear_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  tire_position_id UUID NOT NULL REFERENCES tire_positions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tire_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wear_alerts ENABLE ROW LEVEL SECURITY;

-- Public read/write policy (for MVP - no auth required)
CREATE POLICY "Public full access" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON tire_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON measurements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON wear_alerts FOR ALL USING (true) WITH CHECK (true);

-- Seed data: 8 typical Avis fleet vehicles
INSERT INTO vehicles (id, name, license_plate, make, model, year) VALUES
  ('v1', 'Toyota Camry #1207', 'CO-AVS-1207', 'Toyota', 'Camry', 2024),
  ('v2', 'Chevrolet Equinox #0893', 'CO-AVS-0893', 'Chevrolet', 'Equinox', 2025),
  ('v3', 'Ford Explorer #1456', 'CO-AVS-1456', 'Ford', 'Explorer', 2024),
  ('v4', 'Hyundai Venue #2034', 'CO-AVS-2034', 'Hyundai', 'Venue', 2025),
  ('v5', 'Toyota Corolla #0678', 'CO-AVS-0678', 'Toyota', 'Corolla', 2024),
  ('v6', 'Cadillac XT6 #3012', 'CO-AVS-3012', 'Cadillac', 'XT6', 2025),
  ('v7', 'Chrysler Pacifica #0567', 'CO-AVS-0567', 'Chrysler', 'Pacifica', 2024),
  ('v8', 'Tesla Model 3 #1789', 'CO-AVS-1789', 'Tesla', 'Model 3', 2025);

-- Tire positions for each vehicle
INSERT INTO tire_positions (id, vehicle_id, position, label) VALUES
  ('v1-FL', 'v1', 'FL', 'Front Left'),
  ('v1-FR', 'v1', 'FR', 'Front Right'),
  ('v1-RL', 'v1', 'RL', 'Rear Left'),
  ('v1-RR', 'v1', 'RR', 'Rear Right'),
  ('v2-FL', 'v2', 'FL', 'Front Left'),
  ('v2-FR', 'v2', 'FR', 'Front Right'),
  ('v2-RL', 'v2', 'RL', 'Rear Left'),
  ('v2-RR', 'v2', 'RR', 'Rear Right'),
  ('v3-FL', 'v3', 'FL', 'Front Left'),
  ('v3-FR', 'v3', 'FR', 'Front Right'),
  ('v3-RL', 'v3', 'RL', 'Rear Left'),
  ('v3-RR', 'v3', 'RR', 'Rear Right'),
  ('v4-FL', 'v4', 'FL', 'Front Left'),
  ('v4-FR', 'v4', 'FR', 'Front Right'),
  ('v4-RL', 'v4', 'RL', 'Rear Left'),
  ('v4-RR', 'v4', 'RR', 'Rear Right'),
  ('v5-FL', 'v5', 'FL', 'Front Left'),
  ('v5-FR', 'v5', 'FR', 'Front Right'),
  ('v5-RL', 'v5', 'RL', 'Rear Left'),
  ('v5-RR', 'v5', 'RR', 'Rear Right'),
  ('v6-FL', 'v6', 'FL', 'Front Left'),
  ('v6-FR', 'v6', 'FR', 'Front Right'),
  ('v6-RL', 'v6', 'RL', 'Rear Left'),
  ('v6-RR', 'v6', 'RR', 'Rear Right'),
  ('v7-FL', 'v7', 'FL', 'Front Left'),
  ('v7-FR', 'v7', 'FR', 'Front Right'),
  ('v7-RL', 'v7', 'RL', 'Rear Left'),
  ('v7-RR', 'v7', 'RR', 'Rear Right'),
  ('v8-FL', 'v8', 'FL', 'Front Left'),
  ('v8-FR', 'v8', 'FR', 'Front Right'),
  ('v8-RL', 'v8', 'RL', 'Rear Left'),
  ('v8-RR', 'v8', 'RR', 'Rear Right');

-- Seed measurements representing real-world Avis fleet data
INSERT INTO measurements (id, vehicle_id, tire_position_id, depth_mm, depth_inches, wear_percentage, status, reference_object, confidence, created_at) VALUES
  ('m1', 'v1', 'v1-FL', 7.2, 0.28, 34.5, 'good', 'quarter', 0.85, '2026-04-20T08:30:00Z'),
  ('m2', 'v1', 'v1-FR', 6.8, 0.27, 38.2, 'good', 'quarter', 0.82, '2026-04-20T08:35:00Z'),
  ('m3', 'v1', 'v1-RL', 5.1, 0.20, 53.6, 'caution', 'quarter', 0.79, '2026-04-20T08:40:00Z'),
  ('m4', 'v1', 'v1-RR', 2.8, 0.11, 74.5, 'replace', 'quarter', 0.88, '2026-04-20T08:45:00Z'),
  ('m5', 'v2', 'v2-FL', 9.1, 0.36, 17.3, 'new', 'quarter', 0.91, '2026-04-18T10:15:00Z'),
  ('m6', 'v2', 'v2-FR', 8.8, 0.35, 20.0, 'new', 'quarter', 0.87, '2026-04-18T10:20:00Z'),
  ('m7', 'v2', 'v2-RL', 7.5, 0.30, 31.8, 'good', 'quarter', 0.83, '2026-04-18T10:25:00Z'),
  ('m8', 'v2', 'v2-RR', 7.3, 0.29, 33.6, 'good', 'quarter', 0.80, '2026-04-18T10:30:00Z'),
  ('m9', 'v3', 'v3-FL', 5.4, 0.21, 50.9, 'caution', 'quarter', 0.76, '2026-04-15T14:10:00Z'),
  ('m10', 'v3', 'v3-RR', 3.2, 0.13, 70.9, 'replace', 'quarter', 0.90, '2026-04-15T14:20:00Z'),
  ('m11', 'v6', 'v6-FL', 8.5, 0.33, 22.7, 'new', 'quarter', 0.88, '2026-04-08T08:30:00Z'),
  ('m12', 'v6', 'v6-FR', 6.1, 0.24, 44.5, 'good', 'quarter', 0.81, '2026-04-08T08:35:00Z');

-- Alerts for critical tires
INSERT INTO wear_alerts (id, vehicle_id, tire_position_id, message, severity, created_at) VALUES
  ('a1', 'v1', 'v1-RR', 'Toyota Camry #1207 RR tire at 2.8mm - below 3mm safe threshold. Schedule replacement immediately.', 'critical', '2026-04-20T08:45:00Z'),
  ('a2', 'v3', 'v3-RR', 'Ford Explorer #1456 RR tire at 3.2mm - approaching wear bar. Plan replacement within 1,000 miles.', 'warning', '2026-04-15T14:20:00Z'),
  ('a3', 'v1', 'v1-RL', 'Toyota Camry #1207 RL tire at 5.1mm - moderate wear. Monitor at next service.', 'info', '2026-04-20T08:40:00Z');