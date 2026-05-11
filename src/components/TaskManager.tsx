import React, { useState, useEffect } from 'react';
import { useGame } from '../GameContext';

type Tab = 'processes' | 'performance' | 'startup';

const cpuBar = (val: number) => val > 80 ? 'bg-red-500' : val > 50 ? 'bg-yellow-500' : 'bg-blue-500';

export const TaskManager: React.FC = () => {
  const { state, killProcess } = useGame();
  const [tab, setTab] = useState<Tab>('processes');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const sortedProcesses = [...state.processes].sort((a, b) => b.cpu - a.cpu);

  const startupApps = [
    { name: 'Microsoft Teams',   impact: 'Visok',   status: 'Omogućeno', publisher: 'Microsoft Corp.' },
    { name: 'Spotify',           impact: 'Srednji', status: 'Omogućeno', publisher: 'Spotify AB' },
    { name: 'Discord',           impact: 'Srednji', status: 'Omogućeno', publisher: 'Discord Inc.' },
    { name: 'OneDrive',          impact: 'Visok',   status: 'Omogućeno', publisher: 'Microsoft Corp.' },
    { name: 'Dropbox',           impact: 'Srednji', status: 'Omogućeno', publisher: 'Dropbox Inc.' },
    { name: 'Skype',             impact: 'Srednji', status: 'Onemogućeno', publisher: 'Microsoft Corp.' },
    { name: 'Windows Defender',  impact: 'Nizak',   status: 'Omogućeno', publisher: 'Microsoft Corp.' },
  ];

  return (
    <div className="h-full flex flex-col bg-white text-sm">
      {/* Tabovi */}
      <div className="flex border-b border-gray-200 shrink-0">
        {([
          { key: 'processes',   label: 'Procesi' },
          { key: 'performance', label: 'Performanse' },
          { key: 'startup',     label: 'Pokretanje' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 ${
              tab === t.key ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'processes' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Naziv</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-600 w-14">PID</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-600 w-14">CPU%</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-600 w-14">Mem%</th>
                  <th className="text-center px-3 py-2 font-semibold text-gray-600 w-24">Status</th>
                  <th className="text-center px-3 py-2 font-semibold text-gray-600 w-24">Akcija</th>
                </tr>
              </thead>
              <tbody>
                {sortedProcesses.map(p => (
                  <tr
                    key={p.pid}
                    onClick={() => setSelectedPid(p.pid === selectedPid ? null : p.pid)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedPid === p.pid ? 'bg-blue-50' : p.isMalware ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        {p.isMalware && <span className="text-red-500 text-xs font-bold">⚠</span>}
                        <span className={`font-medium ${p.isMalware ? 'text-red-700' : 'text-gray-800'}`}>{p.name}</span>
                      </div>
                      {selectedPid === p.pid && <div className="text-gray-500 text-[10px] mt-0.5">{p.description}</div>}
                    </td>
                    <td className="px-3 py-1.5 text-right text-gray-500 font-mono">{p.pid}</td>
                    <td className="px-3 py-1.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cpuBar(p.cpu)}`} style={{ width: `${Math.min(p.cpu, 100)}%` }} />
                        </div>
                        <span className={`font-mono font-bold text-[10px] ${p.cpu > 30 ? 'text-red-600' : p.cpu > 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                          {p.cpu}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono text-gray-600">{p.memory}%</td>
                    <td className="px-3 py-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'Pokrenut' ? 'bg-green-100 text-green-700' :
                        p.status === 'Ne reagira' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-center">
                      <button
                        onClick={e => { e.stopPropagation(); killProcess(p.pid); }}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                          p.isMalware
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                      >
                        {p.isMalware ? 'Završi!' : 'Završi zadatak'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {state.processes.some(p => p.isMalware) && (
            <div className="mx-3 my-2 p-2.5 bg-red-50 border border-red-200 rounded-lg shrink-0">
              <div className="text-red-700 font-bold text-xs">⚠️ Sumnjivi procesi otkriveni</div>
              <div className="text-red-600 text-[10px] mt-0.5">Označeni procesi izgledaju zlonamjerno. Završite ih i pokrenite antivirusni sken.</div>
            </div>
          )}
          <div className="border-t border-gray-200 px-3 py-1.5 text-[10px] text-gray-500 flex justify-between shrink-0">
            <span>{state.processes.length} procesa pokrenuto</span>
            <span>CPU: <strong className={state.cpuUsage > 80 ? 'text-red-600' : ''}>{state.cpuUsage}%</strong> | RAM: <strong className={state.ramUsage > 80 ? 'text-red-600' : ''}>{state.ramUsage}%</strong></span>
          </div>
        </div>
      )}

      {tab === 'performance' && (
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'CPU',    value: state.cpuUsage,     color: cpuBar(state.cpuUsage),     detail: 'Intel Core i7-12700H' },
              { label: 'Memorija',value: state.ramUsage,    color: cpuBar(state.ramUsage),     detail: '16 GB DDR4-3200' },
              { label: 'Disk',   value: state.diskUsage,    color: cpuBar(state.diskUsage),    detail: 'Samsung NVMe 512 GB' },
              { label: 'Mreža',  value: state.networkUsage, color: cpuBar(state.networkUsage), detail: 'Realtek GbE 1 Gbps' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-bold text-gray-600">{item.label}</div>
                    <div className="text-[10px] text-gray-400">{item.detail}</div>
                  </div>
                  <div className={`text-2xl font-bold ${item.value > 80 ? 'text-red-600' : item.value > 50 ? 'text-yellow-600' : 'text-gray-800'}`}>
                    {item.value}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-bold text-gray-600">Zdravlje sustava</div>
              <div className={`text-xl font-bold ${state.systemHealth > 70 ? 'text-green-600' : state.systemHealth > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                {state.systemHealth}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${state.systemHealth > 70 ? 'bg-green-500' : state.systemHealth > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${state.systemHealth}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {state.systemHealth > 80 ? '✓ Sustav radi normalno.' : state.systemHealth > 50 ? '⚠ Sustav ima probleme koji zahtijevaju pažnju.' : '🚨 Kritično stanje! Hitna akcija potrebna.'}
            </div>
          </div>
        </div>
      )}

      {tab === 'startup' && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Naziv</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Izdavač</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Status</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Utjecaj</th>
              </tr>
            </thead>
            <tbody>
              {startupApps.map((app, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{app.name}</td>
                  <td className="px-3 py-2 text-gray-500">{app.publisher}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      app.status === 'Omogućeno' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      app.impact === 'Visok' ? 'bg-red-100 text-red-700' :
                      app.impact === 'Srednji' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {app.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-yellow-50 border-t border-yellow-200">
            <div className="text-xs text-yellow-800 font-semibold">💡 Savjet</div>
            <div className="text-[10px] text-yellow-700 mt-0.5">Onemogućite nepotrebne startup programe za brže pokretanje sustava. Programi s "Visokim" utjecajem značajno usporavaju boot.</div>
          </div>
        </div>
      )}
    </div>
  );
};
