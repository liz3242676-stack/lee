export interface SimState {
  targetQuantity: number;
  deadlineDays: number;
  contractAmount: number; // in 100M KRW (억원)

  // Operating variables
  overtimeHours: number; // 0 or 2
  weekendDays: number; // 0 to 10
  isTwoShift: boolean;

  extraWorkers: number; // 0 to 20
  extraWorkerSkill: number; // 1 (기존), 0.85 (타부서), 0.7 (신규)

  extraMachines: number; // 0 to 2
  defectRate: number; // 0 to 10%
}

export interface SimResult {
  dailyProduction: number;
  totalProduction: number;
  daysToComplete: number;
  delayDays: number;

  totalLaborCost: number; // 만원 (10k KRW)
  penaltyCost: number;
  totalCost: number;

  bottleneckRate: number;
  utilizationRate: number;
  roi: number;

  // Chart data
  timeline: { day: number; cumulative: number; target: number }[];
  costComparison: { name: string; cost: number; fill: string }[];
  bottleneckData: { process: string; waitTime: number }[];
}
