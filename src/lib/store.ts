import { create } from 'zustand';

export interface WorkerProfile {
  name: string;
  phone: string;
  platform: string;
  city: string;
  weeklyIncome: number;
}

export interface RiskAssessment {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  rainfall: number;
  temperature: number;
  aqi: number;
}

export interface Policy {
  id: string;
  active: boolean;
  premium: number;
  coverage: number;
  activatedAt: string;
  expiresAt: string;
}

export interface Claim {
  id: string;
  trigger: string;
  value: number;
  threshold: number;
  unit: string;
  payout: number;
  timestamp: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface AppState {
  worker: WorkerProfile | null;
  risk: RiskAssessment | null;
  policy: Policy | null;
  claims: Claim[];
  setWorker: (w: WorkerProfile) => void;
  setRisk: (r: RiskAssessment) => void;
  activatePolicy: (premium: number, coverage: number) => void;
  addClaim: (c: Omit<Claim, 'id' | 'timestamp'>) => void;
}

// Simulated AI risk scoring
export function calculateRisk(city: string, weeklyIncome: number): RiskAssessment {
  const cityRisk: Record<string, number> = {
    'Mumbai': 78, 'Delhi': 85, 'Bangalore': 45, 'Chennai': 62,
    'Hyderabad': 55, 'Kolkata': 70, 'Pune': 50, 'Jaipur': 60,
  };
  const base = cityRisk[city] || Math.floor(Math.random() * 40) + 40;
  const noise = Math.floor(Math.random() * 15) - 7;
  const score = Math.max(5, Math.min(100, base + noise));

  const rainfall = score > 60 ? Math.floor(Math.random() * 40) + 30 : Math.floor(Math.random() * 25) + 5;
  const temperature = score > 50 ? Math.floor(Math.random() * 8) + 38 : Math.floor(Math.random() * 10) + 28;
  const aqi = score > 70 ? Math.floor(Math.random() * 200) + 300 : Math.floor(Math.random() * 150) + 80;

  return {
    score,
    level: score < 30 ? 'Low' : score < 70 ? 'Medium' : 'High',
    rainfall, temperature, aqi,
  };
}

export function calculatePremium(weeklyIncome: number, riskScore: number): { premium: number; coverage: number } {
  const factor = riskScore < 30 ? 0.008 : riskScore < 70 ? 0.012 : 0.018;
  const premium = Math.round(weeklyIncome * factor);
  const coverage = Math.round(weeklyIncome * 0.2);
  return { premium, coverage };
}

export const useAppStore = create<AppState>((set) => ({
  worker: null,
  risk: null,
  policy: null,
  claims: [],
  setWorker: (worker) => set({ worker }),
  setRisk: (risk) => set({ risk }),
  activatePolicy: (premium, coverage) => set({
    policy: {
      id: `POL-${Date.now().toString(36).toUpperCase()}`,
      active: true,
      premium,
      coverage,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }),
  addClaim: (claim) => set((state) => ({
    claims: [{
      ...claim,
      id: `CLM-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    }, ...state.claims],
  })),
}));
