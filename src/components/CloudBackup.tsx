import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Cloud, Download, RefreshCw, CheckCircle, AlertTriangle, HardDrive, Clock } from 'lucide-react';

interface BackupPoint {
  id: string;
  name: string;
  date: string;
  size: string;
  status: 'Uspješno' | 'Parcijalno' | 'Neuspješno';
  files: number;
  retention: string;
  type: 'Puno' | 'Inkrementalno' | 'Diferncijalno';
}

const backupPoints: BackupPoint[] = [
  {
    id: 'bp1',
    name: 'Dnevna sigurnosna kopija',
    date: '2024-03-25 02:00',
    size: '45.2 GB',
    status: 'Uspješno',
    files: 234567,
    retention: '30 dana',
    type: 'Inkrementalno',
  },
  {
    id: 'bp2',
    name: 'Tjedna kopija',
    date: '2024-03-18 03:30',
    size: '128.7 GB',
    status: 'Uspješno',
    files: 892341,
    retention: '3 mjeseca',
    type: 'Diferncijalno',
  },
  {
    id: 'bp3',
    name: 'Mjesečna puna kopija',
    date: '2024-03-01 00:00',
    size: '312.4 GB',
    status: 'Uspješno',
    files: 1567890,
    retention: '1 godina',
    type: 'Puno',
  },
  {
    id: 'bp4',
    name: 'Hitna kopija',
    date: '2024-02-14 17:23',
    size: '52.1 GB',
    status: 'Parcijalno',
    files: 198432,
    retention: '7 dana',
    type: 'Inkrementalno',
  },
  {
    id: 'bp5',
    name: 'Stara puna kopija',
    date: '2024-02-01 00:00',
    size: '295.8 GB',
    status: 'Uspješno',
    files: 1478321,
    retention: 'Isteklo za 3 dana',
    type: 'Puno',
  },
];

const folders = [
  { name: 'Dokumenti', path: 'C:\\Users\\Admin\\Documents', size: '12.3 GB', files: 45234 },
  { name: 'Radna površina', path: 'C:\\Users\\Admin\\Desktop', size: '2.1 GB', files: 1234 },
  { name: 'Slike', path: 'C:\\Users\\Admin\\Pictures', size: '8.7 GB', files: 12456 },
  { name: 'Poslovni podaci', path: 'D:\\Tvrtka\\Podaci', size: '45.2 GB', files: 89032 },
  { name: 'Baze podataka', path: 'D:\\SQL\\Databases', size: '78.9 GB', files: 124 },
  { name: 'Projekti', path: 'D:\\Projekti', size: '23.4 GB', files: 23456 },
];

export const CloudBackup: React.FC = () => {
  const { addAction } = useGame();
  const [selectedBP, setSelectedBP] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreComplete, setRestoreComplete] = useState(false);
  const [tab, setTab] = useState<'backups' | 'restore' | 'schedule'>('backups');
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleRestore = () => {
    if (!selectedBP || restoring) return;
    setRestoring(true);
    setRestoreProgress(0);
    addAction('open_cloudbackup');
    addAction('restore_backup');
    let p = 0;
    const iv = setInterval(() => {
      p += 4;
      setRestoreProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        setRestoring(false);
        setRestoreComplete(true);
      }
    }, 200);
  };

  const handleSync = () => {
    if (syncing || syncComplete) return;
    setSyncing(true);
    setSyncProgress(0);
    addAction('sync_backup');
    let p = 0;
    const iv = setInterval(() => {
      p += 5;
      setSyncProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        setSyncing(false);
        setSyncComplete(true);
      }
    }, 150);
  };

  const selected = backupPoints.find(bp => bp.id === selectedBP);

  const statusColor: Record<string, string> = {
    'Uspješno':   'bg-green-100 text-green-800 border-green-300',
    'Parcijalno': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Neuspješno': 'bg-red-100 text-red-800 border-red-300',
  };

  const typeColor: Record<string, string> = {
    'Puno':         'bg-blue-100 text-blue-700',
    'Inkrementalno':'bg-purple-100 text-purple-700',
    'Diferncijalno':'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs">
      {/* Zaglavlje */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
        <Cloud size={16} className="text-white" />
        <div className="flex-1">
          <div className="text-white font-bold text-[11px]">Cloud Sigurnosna kopija</div>
          <div className="text-blue-200 text-[9px]">Posljednja sinkronizacija: 2024-03-25 02:15 | Stanje: {syncComplete ? 'Sinkronizirano' : '⚠ Nije sinkronizirano'}</div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || syncComplete}
          className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-bold transition-colors"
        >
          <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />
          {syncing ? `${syncProgress}%` : syncComplete ? '✓ Sinkronizirano' : 'Sinkroniziraj'}
        </button>
      </div>

      {/* Sync progress */}
      {syncing && (
        <div className="px-3 py-1 border-b border-gray-200 shrink-0">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 progress-shimmer rounded-full transition-all" style={{ width: `${syncProgress}%` }} />
          </div>
        </div>
      )}

      {/* Statistike */}
      <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 shrink-0">
        {[
          { label: 'Ukupno pohranjeno', value: '628.1 GB', icon: HardDrive, color: 'text-blue-600' },
          { label: 'Točke obnavljanja', value: `${backupPoints.length}`, icon: Cloud, color: 'text-green-600' },
          { label: 'Starija kopija', value: '31 dan', icon: Clock, color: 'text-orange-600' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-2 bg-gray-50">
            <s.icon size={14} className={s.color} />
            <div>
              <div className={`font-black text-sm ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabovi */}
      <div className="flex border-b border-gray-200 shrink-0">
        {([
          { key: 'backups', label: '📦 Kopije' },
          { key: 'restore', label: '⏪ Obnavljanje' },
          { key: 'schedule', label: '📁 Mape' },
        ] as { key: typeof tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-b-2 ${
              tab === t.key ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'backups' && (
          <div className="p-2 space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => addAction('create_backup_copy')}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold transition-colors"
              >
                <Plus size={12} /> Nova sigurnosna kopija
              </button>
            </div>
            {backupPoints.map(bp => (
              <div
                key={bp.id}
                onClick={() => setSelectedBP(bp.id === selectedBP ? null : bp.id)}
                className={`rounded-xl border p-2.5 cursor-pointer transition-all ${
                  selectedBP === bp.id ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-[11px] truncate">{bp.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${typeColor[bp.type]}`}>{bp.type}</span>
                    </div>
                    <div className="text-[9px] text-gray-500 mt-0.5">
                      📅 {bp.date} • 💾 {bp.size} • 📄 {bp.files.toLocaleString()} dat. • ⏰ {bp.retention}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${statusColor[bp.status]}`}>
                    {bp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'restore' && (
          <div className="p-3 space-y-3">
            {restoreComplete ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <CheckCircle size={48} className="text-green-500" />
                <div className="text-center">
                  <div className="font-black text-lg text-green-700">Obnavljanje završeno!</div>
                  <div className="text-sm text-gray-600 mt-1">Podaci su uspješno obnovljeni iz sigurnosne kopije.</div>
                </div>
              </div>
            ) : restoring ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Cloud size={48} className="text-blue-500" style={{ animation: 'pulse 1s infinite' }} />
                <div className="font-bold text-sm text-gray-800">Obnavljanje u tijeku...</div>
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-full progress-shimmer rounded-full transition-all" style={{ width: `${restoreProgress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>{restoreProgress}% završeno</span>
                    <span>{Math.floor(restoreProgress * 6283)} datoteka</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="font-bold text-blue-800 text-[11px] mb-2">📥 Odabrana točka za obnavljanje:</div>
                  {selected ? (
                    <div>
                      <div className="font-bold text-gray-800">{selected.name}</div>
                      <div className="text-[10px] text-gray-600">{selected.date} • {selected.size} • {selected.files.toLocaleString()} datoteka</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-blue-600">Odaberite kopiju sa kartice "Kopije"</div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-yellow-800 text-[10px]">Upozorenje!</div>
                      <div className="text-[10px] text-yellow-700 mt-0.5">
                        Obnavljanje će zamijeniti trenutne datoteke s datotekama iz sigurnosne kopije. Ova radnja se ne može poništiti!
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRestore}
                  disabled={!selectedBP}
                  className="w-full py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-bold transition-colors"
                >
                  <Download size={16} />
                  Obnovi iz odabrane kopije
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'schedule' && (
          <div className="divide-y divide-gray-100">
            {folders.map(folder => (
              <div key={folder.name} className="flex items-center px-3 py-2.5 hover:bg-gray-50 gap-3">
                <div className="text-lg shrink-0">📁</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-[11px]">{folder.name}</div>
                  <div className="text-[9px] text-gray-500 truncate">{folder.path}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gray-700 text-[11px]">{folder.size}</div>
                  <div className="text-[9px] text-gray-400">{folder.files.toLocaleString()} dat.</div>
                </div>
                <CheckCircle size={14} className="text-green-500 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
