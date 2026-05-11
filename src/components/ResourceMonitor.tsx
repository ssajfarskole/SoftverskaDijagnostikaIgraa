import React from 'react';
import { useGame } from '../GameContext';
import { Cpu, HardDrive, Wifi } from 'lucide-react';

const getStatus = (v: number) => v > 90 ? 'KRITIČNO' : v > 80 ? 'VISOKO' : v > 50 ? 'UMJERENO' : 'NORMALNO';
const getColor = (v: number) => v > 80 ? '#EF4444' : v > 50 ? '#F59E0B' : '#22C55E';
const getBg = (v: number) => v > 80 ? 'bg-red-500' : v > 50 ? 'bg-yellow-500' : 'bg-green-500';
const getBadge = (v: number) => v > 80 ? 'bg-red-500 text-white' : v > 50 ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white';

const CircleGauge: React.FC<{ value: number; size?: number }> = ({ value, size = 70 }) => {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={getColor(value)}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x={size/2} y={size/2+5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={getColor(value)}>
        {value}%
      </text>
    </svg>
  );
};

export const ResourceMonitor: React.FC = () => {
  const { state, addAction } = useGame();

  const resources = [
    { label: 'CPU', icon: Cpu, value: state.cpuUsage, detail: 'Intel Core i7-12700H @ 2.3 GHz, 14 jezgri' },
    { label: 'RAM', icon: Cpu, value: state.ramUsage, detail: '16 GB DDR4-3200, koristi se 8.1 GB' },
    { label: 'Disk', icon: HardDrive, value: state.diskUsage, detail: 'Samsung 980 Pro 512 GB NVMe' },
    { label: 'Mreža', icon: Wifi, value: state.networkUsage, detail: 'Realtek GbE, 1 Gbps' },
  ];

  return (
    <div className="h-full bg-white flex flex-col text-sm">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="font-bold text-gray-700 text-sm">Nadzor resursa</div>
        <div className="text-xs text-gray-500">Korištenje sistemskih resursa u stvarnom vremenu</div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {resources.map(r => (
          <div key={r.label} className={`rounded-xl p-3 border cursor-pointer ${r.value > 80 ? 'border-red-200 bg-red-50' : r.value > 50 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`} onClick={() => {
            if (r.label === 'Mreža') addAction('check_network_adapter');
          }}>
            <div className="flex items-center gap-3">
              <CircleGauge value={r.value} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800 text-sm">{r.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadge(r.value)}`}>
                    {getStatus(r.value)}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mb-2">{r.detail}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${getBg(r.value)}`} style={{ width: `${r.value}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">Zdravlje sustava</span>
            <span className={`text-2xl font-black ${state.systemHealth > 70 ? 'text-green-600' : state.systemHealth > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {state.systemHealth}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${state.systemHealth > 70 ? 'bg-green-500' : state.systemHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${state.systemHealth}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {state.systemHealth > 80 ? '✓ Sustav radi optimalno' : state.systemHealth > 50 ? '⚠ Preporuča se dijagnostika' : '🚨 Sustav u kritičnom stanju!'}
          </div>
        </div>

        {state.hasDriverConflict && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <div className="text-xs font-bold text-orange-800">⚡ Sukob upravljačkih programa</div>
            <div className="text-[10px] text-orange-700 mt-0.5">Otkriveni problematični driveri. Provjerite Preglednik događaja i pokrenite driverquery.</div>
            <button
              className="mt-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold rounded-lg transition-colors"
              onClick={() => addAction('diagnose_wifi')}
            >
              Dijagnosticira mrežu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
