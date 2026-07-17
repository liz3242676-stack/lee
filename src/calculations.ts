import { SimState, SimResult } from './types';

export function runSimulation(state: SimState): SimResult {
  const BASE_WORKERS = 20;
  const BASE_WAGE = 15; // 15만원/일
  const BASE_MACHINES = 2;
  
  // 1. Calculate Daily Capacity
  const normalHours = 8;
  const totalDailyHours = normalHours + state.overtimeHours + (state.isTwoShift ? 8 : 0);
  
  const workerEfficiency = (BASE_WORKERS * 1 + state.extraWorkers * state.extraWorkerSkill) / BASE_WORKERS;
  
  let assemblyProd = 18 * (totalDailyHours / 8) * workerEfficiency;
  assemblyProd = assemblyProd * (1 - state.defectRate / 100);
  
  const machineCapacity = (BASE_MACHINES + state.extraMachines) * 12 * (totalDailyHours / 24);
  
  const dailyProduction = Math.min(assemblyProd, machineCapacity);
  
  // 2. Schedule & Production
  const totalAvailableDays = state.deadlineDays + state.weekendDays;
  const totalProduction = dailyProduction * totalAvailableDays;
  
  const daysToComplete = Math.ceil(state.targetQuantity / dailyProduction);
  const delayDays = Math.max(0, daysToComplete - totalAvailableDays);
  
  // 3. Costs
  let laborCost = BASE_WORKERS * BASE_WAGE * state.deadlineDays;
  
  if (state.overtimeHours > 0) {
    laborCost += BASE_WORKERS * (BASE_WAGE / 8) * state.overtimeHours * 1.5 * state.deadlineDays;
  }
  
  if (state.isTwoShift) {
    laborCost += BASE_WORKERS * BASE_WAGE * 1.5 * state.deadlineDays;
  }
  
  if (state.weekendDays > 0) {
    laborCost += BASE_WORKERS * BASE_WAGE * 2.0 * state.weekendDays;
  }
  
  if (state.extraWorkers > 0) {
    let extraWorkerDaily = BASE_WAGE;
    if (state.overtimeHours > 0) extraWorkerDaily += (BASE_WAGE / 8) * state.overtimeHours * 1.5;
    if (state.isTwoShift) extraWorkerDaily += BASE_WAGE * 1.5;
    
    laborCost += state.extraWorkers * extraWorkerDaily * state.deadlineDays;
    if (state.weekendDays > 0) {
       laborCost += state.extraWorkers * BASE_WAGE * 2.0 * state.weekendDays;
    }
  }
  
  const penaltyPerDay = state.contractAmount * 10000 * 0.0005; 
  const penaltyCost = delayDays * penaltyPerDay;
  
  // 4. Metrics
  const bottleneckRate = Math.min(100, (dailyProduction / machineCapacity) * 100);
  const utilizationRate = Math.min(100, (totalDailyHours / 24) * 100);
  
  const baseDaily = 18;
  const baseDaysToComplete = Math.ceil(state.targetQuantity / baseDaily);
  const baseDelay = Math.max(0, baseDaysToComplete - state.deadlineDays);
  const basePenalty = baseDelay * penaltyPerDay;
  const baseLabor = BASE_WORKERS * BASE_WAGE * state.deadlineDays;
  
  const additionalLabor = laborCost - baseLabor;
  const penaltySaved = basePenalty - penaltyCost;
  const roi = additionalLabor > 0 ? (penaltySaved / additionalLabor) * 100 : 0;
  
  // 5. Chart Data
  const timeline = [];
  let currentProd = 0;
  for (let i = 1; i <= Math.max(state.deadlineDays, daysToComplete); i++) {
    const target = Math.min(state.targetQuantity, (state.targetQuantity / state.deadlineDays) * i);
    currentProd += dailyProduction;
    if (currentProd > state.targetQuantity) currentProd = state.targetQuantity;
    
    timeline.push({
      day: i,
      cumulative: Math.round(currentProd),
      target: Math.round(target)
    });
  }
  
  const costComparison = [
    { name: '기본 (페널티 포함)', cost: Math.round((baseLabor + basePenalty)/100), fill: '#cbd5e1' },
    { name: '시뮬레이션', cost: Math.round((laborCost + penaltyCost)/100), fill: '#f97316' },
  ];
  
  const bottleneckData = [
    { process: '조립 (Assembly)', waitTime: 1.2 },
    { process: '기능시험 (Test)', waitTime: (bottleneckRate > 90) ? 3.5 : 2.1 },
    { process: '품질검사 (QA)', waitTime: 0.8 },
  ];
  
  return {
    dailyProduction,
    totalProduction,
    daysToComplete,
    delayDays,
    totalLaborCost: Math.round(laborCost),
    penaltyCost: Math.round(penaltyCost),
    totalCost: Math.round(laborCost + penaltyCost),
    bottleneckRate,
    utilizationRate,
    roi,
    timeline,
    costComparison,
    bottleneckData
  };
}
