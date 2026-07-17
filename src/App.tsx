import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell 
} from 'recharts';
import { 
  Settings, AlertTriangle, Clock, Target, Users, Zap, DollarSign, Activity, AlertCircle
} from 'lucide-react';
import { SimState } from './types';
import { runSimulation } from './calculations';

function formatKRW(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value) + ' 만원';
}

function formatBillion(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value) + ' 억원';
}

const KPICard = ({ title, value, subtext, icon: Icon, alert }: any) => (
  <div className={`p-4 rounded-xl border ${alert ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white shadow-sm'} flex flex-col gap-2 relative overflow-hidden backdrop-blur-sm transition-all`}>
    <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
      {title}
      <Icon className={`w-4 h-4 ${alert ? 'text-red-500' : 'text-orange-500'}`} />
    </div>
    <div className={`text-2xl font-bold ${alert ? 'text-red-900' : 'text-slate-900'}`}>{value}</div>
    {subtext && <div className={`text-xs ${alert ? 'text-red-600' : 'text-slate-500'}`}>{subtext}</div>}
  </div>
);

const ControlGroup = ({ title, children }: any) => (
  <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-slate-200 last:border-0">
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
    {children}
  </div>
);

const RangeSlider = ({ label, value, min, max, step = 1, unit = '', onChange }: any) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-sm">
      <label className="text-slate-700 font-medium">{label}</label>
      <span className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
    />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-700 font-medium">{label}</label>
    <select 
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 block w-full outline-none"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
  <label className="inline-flex items-center cursor-pointer justify-between w-full group">
    <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">{label}</span>
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
    <div className="relative w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
  </label>
);

export default function App() {
  const [state, setState] = useState<SimState>({
    targetQuantity: 400,
    deadlineDays: 20,
    contractAmount: 100, // 100 억원
    
    overtimeHours: 0,
    weekendDays: 0,
    isTwoShift: false,
    
    extraWorkers: 0,
    extraWorkerSkill: 0.85,
    
    extraMachines: 0,
    defectRate: 2,
  });

  const result = useMemo(() => runSimulation(state), [state]);

  const handleChange = (key: keyof SimState, value: number | boolean) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500/30 flex">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-slate-200 bg-white/80 h-screen overflow-y-auto shrink-0 flex flex-col custom-scrollbar">
        <div className="p-6 border-b border-slate-200 bg-white/95 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3 text-orange-500 font-bold text-lg tracking-tight">
            <Zap className="w-5 h-5" />
            HANWHA AEROSPACE
          </div>
          <p className="text-xs text-slate-500 mt-2">PGM 사업부 생산일정 시뮬레이터</p>
        </div>
        
        <div className="p-6">
          <ControlGroup title="기본 목표 및 제약">
            <RangeSlider label="목표 생산량" value={state.targetQuantity} min={100} max={1000} step={10} unit=" EA" onChange={(v: number) => handleChange('targetQuantity', v)} />
            <RangeSlider label="납기 기한" value={state.deadlineDays} min={10} max={60} unit=" 일" onChange={(v: number) => handleChange('deadlineDays', v)} />
            <RangeSlider label="계약 금액" value={state.contractAmount} min={10} max={500} step={10} unit=" 억원" onChange={(v: number) => handleChange('contractAmount', v)} />
          </ControlGroup>
          
          <ControlGroup title="인력 및 일정 운영 (연장/특근)">
            <Select 
              label="평일 연장근무" 
              value={state.overtimeHours} 
              onChange={(v: number) => handleChange('overtimeHours', v)}
              options={[{label: '미실시 (8시간)', value: 0}, {label: '2시간 실시 (총 10시간)', value: 2}]} 
            />
            <RangeSlider label="주말 특근 일수" value={state.weekendDays} min={0} max={10} unit=" 일" onChange={(v: number) => handleChange('weekendDays', v)} />
            <Toggle label="주/야 2교대 운영" checked={state.isTwoShift} onChange={(v: boolean) => handleChange('isTwoShift', v)} />
          </ControlGroup>
          
          <ControlGroup title="추가 인력 투입">
            <RangeSlider label="투입 인원 수" value={state.extraWorkers} min={0} max={30} unit=" 명" onChange={(v: number) => handleChange('extraWorkers', v)} />
            <Select 
              label="투입 인력 숙련도" 
              value={state.extraWorkerSkill} 
              onChange={(v: number) => handleChange('extraWorkerSkill', v)}
              options={[
                {label: '타부서 지원 (85%)', value: 0.85}, 
                {label: '신규 계약직 (70%)', value: 0.70},
                {label: '기존 숙련공 동일 (100%)', value: 1.0}
              ]} 
            />
          </ControlGroup>
          
          <ControlGroup title="설비 및 품질 (병목 개선)">
            <RangeSlider label="추가 시험설비 투입" value={state.extraMachines} min={0} max={2} unit=" 기" onChange={(v: number) => handleChange('extraMachines', v)} />
            <RangeSlider label="불량률 / 재작업률" value={state.defectRate} min={0} max={10} step={0.5} unit=" %" onChange={(v: number) => handleChange('defectRate', v)} />
          </ControlGroup>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100">
        
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">실시간 생산성 및 비용 대시보드</h1>
          <p className="text-slate-600">조작 패널의 변수를 조정하여 납기 지연 페널티와 연장근무/추가인력 투입 비용의 최적 균형점을 찾습니다.</p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard 
            title="예상 일일 생산량" 
            value={`${result.dailyProduction.toFixed(1)} EA`} 
            subtext={`최대 가능량 대비 가동률: ${result.utilizationRate.toFixed(1)}%`}
            icon={Activity} 
          />
          <KPICard 
            title="납기 소요 일수" 
            value={`${result.daysToComplete} 일`} 
            subtext={`목표: ${state.deadlineDays}일 / 특근: ${state.weekendDays}일`}
            icon={Clock} 
            alert={result.delayDays > 0}
          />
          <KPICard 
            title="예상 페널티 (지연)" 
            value={result.delayDays > 0 ? formatKRW(result.penaltyCost) : '0 만원 (정상 납기)'} 
            subtext={`${result.delayDays}일 지연 예상`}
            icon={AlertTriangle} 
            alert={result.delayDays > 0}
          />
          <KPICard 
            title="총 운영 예상 비용" 
            value={formatKRW(result.totalCost)} 
            subtext={`인건비: ${formatKRW(result.totalLaborCost)}`}
            icon={DollarSign} 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Production Timeline */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4 lg:col-span-2 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">누적 생산량 예측 (목표 vs 실제)</h3>
              <div className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-200">
                목표 {state.targetQuantity}EA
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#334155' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="cumulative" name="예상 생산량" stroke="#f97316" strokeWidth={2} fill="url(#colorUv)" />
                  <Line type="stepAfter" dataKey="target" name="일일 목표선" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Cost Comparison */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">운영 시나리오 비용 비교</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.costComparison} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}백`} />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} 백만원`, '비용']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9', opacity: 0.6}}
                  />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {result.costComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottleneck Analysis */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4 xl:col-span-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">공정별 대기시간 및 병목 지수</h3>
              {result.bottleneckRate > 90 && (
                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                  <AlertCircle className="w-4 h-4" />
                  기능시험(Test) 공정 병목 발생 위험
                </div>
              )}
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.bottleneckData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit=" hr" />
                  <YAxis dataKey="process" type="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9', opacity: 0.6}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="waitTime" name="대기시간(시간)" radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {result.bottleneckData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.waitTime > 3 ? '#ef4444' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
