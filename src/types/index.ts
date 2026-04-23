export interface TirePosition {
  id: string;
  position: 'FL' | 'FR' | 'RL' | 'RR' | 'Spare';
  label: string;
}

export interface TreadMeasurement {
  id: string;
  tirePositionId: string;
  vehicleId: string;
  depthMm: number;
  depthInches: number;
  timestamp: string;
  imageUrl?: string;
  notes?: string;
  wearPercentage: number;
  status: 'new' | 'good' | 'caution' | 'replace';
  referenceObject: 'quarter' | 'penny' | 'gauge';
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate?: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  tires: TirePosition[];
  createdAt?: string;
}

export interface WearAlert {
  id: string;
  vehicleId: string;
  tirePositionId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  resolved: boolean;
}

export interface TireCostEstimate {
  perTire: number;
  total: number;
  laborCost: number;
  taxEstimate: number;
  grandTotal: number;
  currency: string;
}