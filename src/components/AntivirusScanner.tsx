import React from 'react';
import { useGame } from '../GameContext';
import { Shield, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const threats = [
  { name: 'Trojan:Win32/Emotet.A!ml', severity: 'Kritično', path: 'C:\\Users\\Admin\\Downloads\\invoice_march.exe', action: 'Karantena' },
  { name: 'PUA:Win32/CoinMiner',       severity: 'Visoko',   path: 'C:\\Windows\\Temp\\svchost32.tmp',              action: 'Uklanjanje' },
  { name: 'Adware:Win32/PopAds',       severity: 'Srednje',  path: 'C:\\Program Files (x86)\\PopHelper\\ph.dll',    action: 'Karantena' },
];

const scanPaths = [
  'C:\\Windows\\System32\\',
  'C:\\Program Files\\',
  'C:\\Users\\Admin\\AppData\\Local\\',
  'C:\\Users\\Admin\\Downloads\\',
  'C:\\Windows\\Temp\\',
  'C:\\ProgramData\\Microsoft\\',
];

export const AntivirusScanner: React.FC = () => {
  const { state, startAntivirusScan, removeThreats } = useGame();
  const currentScanPath = scanPaths[Math.min(Math.floor(state.antivirusProgress / (100 / scanPaths.length)), scanPaths.length - 1)];
  const filesScanned = Math.floor(state.antivirusProgress * 1847);

  if (state.threatsRemoved) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-6 gap-4">
        <CheckCircle size={72} className="text-green-500" />
        <div className="text-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">Sustav je čist!</h3>
          <p className="text-sm text-gray-600">Sve prijetnje su uspješno uklonjene.</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full max-w-sm">
          <div className="text-xs font-bold text-green-700 mb-2">Uklonjene prijetnje:</div>
          {threats.map((t, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-green-100 last:border-0">
              <CheckCircle size={12} className="text-green-500 shrink-0" />
              <span className="text-xs text-gray-700 truncate">{t.name}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400">{threats.length} prijetnje uklonjeno | Sustav zaštićen</div>
      </div>
    );
  }

  if (state.antivirusComplete && !state.threatsRemoved) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 bg-red-50 border-b-2 border-red-200 shrink-0">
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} className="text-red-600 shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 text-sm">Otkrivene prijetnje!</h3>
              <p className="text-xs text-red-600 mt-0.5">{threats.length} prijetnje pronađeno — potrebna je hitna akcija</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {threats.map((threat, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900">{threat.name}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">📁 {threat.path}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    threat.severity === 'Kritično' ? 'bg-red-600 text-white' :
                    threat.severity === 'Visoko' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {threat.severity}
                  </span>
                  <span className="text-[10px] text-gray-500">Akcija: {threat.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <button
            onClick={removeThreats}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Shield size={18} />
            Ukloni sve prijetnje ({threats.length})
          </button>
        </div>
      </div>
    );
  }

  if (state.antivirusScanning) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 gap-4">
        <div className="relative">
          <Shield size={72} className="text-blue-500" style={{ animation: 'pulse 1.5s infinite' }} />
          <Search size={28} className="text-blue-400 absolute -bottom-1 -right-1" style={{ animation: 'spin 2s linear infinite' }} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-blue-800">Skeniranje u tijeku...</h3>
          <p className="text-xs text-gray-500 mt-1 font-mono break-all max-w-xs">{currentScanPath}</p>
        </div>
        <div className="w-full max-w-sm">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full progress-shimmer rounded-full transition-all duration-300" style={{ width: `${state.antivirusProgress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{state.antivirusProgress}% završeno</span>
            <span>{filesScanned.toLocaleString()} datoteka</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center">Nemojte gasiti računalo za vrijeme skeniranja</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6 gap-4">
      <Shield size={80} className="text-blue-600" />
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">Antivirusni skener</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">Pokrenite potpuno skeniranje sustava za otkrivanje virusa, trojanaca i drugog zlonamjernog softvera.</p>
      </div>
      <button
        onClick={startAntivirusScan}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        <Search size={18} />
        Pokreni potpuni sken
      </button>
      <div className="text-center text-xs text-gray-400">
        <div>Zadnje skeniranje: Nikad</div>
        <div>Definicije: Ažurne (2024-03-15)</div>
      </div>
    </div>
  );
};
