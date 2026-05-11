import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Download, RefreshCw } from 'lucide-react';

type FilterLevel = 'all' | 'Pogreška' | 'Upozorenje' | 'Informacija';
type LogCategory = 'system' | 'application' | 'security';

const levelIcon: Record<string, string> = {
  'Pogreška':   '🔴',
  'Upozorenje': '🟡',
  'Informacija':'🔵',
};

const levelBg: Record<string, string> = {
  'Pogreška':   'bg-red-50',
  'Upozorenje': 'bg-yellow-50',
  'Informacija':'',
};

const levelText: Record<string, string> = {
  'Pogreška':   'text-red-700',
  'Upozorenje': 'text-amber-700',
  'Informacija':'text-blue-700',
};

export const EventViewer: React.FC = () => {
  const { state, viewLog, addAction } = useGame();
  const [selectedLog, setSelectedLog] = useState<LogCategory>('system');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterLevel>('all');
  const [search, setSearch] = useState('');
  const [exported, setExported] = useState(false);

  const handleCategoryClick = (cat: LogCategory) => {
    setSelectedLog(cat);
    viewLog(cat);
    setSelectedEvent(null);
  };

  const matchesCategory = (log: typeof state.eventLogs[number], category: LogCategory) => {
    const source = log.source.toLowerCase();
    if (category === 'system') {
      return ['system', 'bugcheck', 'disk', 'eventlog', 'whea', 'storport', 'usbhub', 'bootmanager', 'windows update', 'pnp', 'audiosrv', 'bootmanager', 'dhcp-client', 'boot manager', 'service control manager'].some(term => source.includes(term));
    }
    if (category === 'application') {
      return ['application', 'windows defender', 'printservice', 'defrag', 'diagtrack', 'vss', 'explorer', 'acro rd32', 'service control manager', 'application error', 'application'].some(term => source.includes(term));
    }
    return ['security', 'user profile service', 'networkprofile', 'dhcp-client', 'windows defender', 'ids'].some(term => source.includes(term));
  };

  const filteredLogs = state.eventLogs.filter(log => {
    if (!matchesCategory(log, selectedLog)) return false;
    if (filter !== 'all' && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase()) &&
        !log.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedEventData = state.eventLogs.find(e => e.id === selectedEvent);

  const handleExport = () => {
    addAction('export_event_log');
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const counts = {
    error: state.eventLogs.filter(l => l.level === 'Pogreška').length,
    warn: state.eventLogs.filter(l => l.level === 'Upozorenje').length,
    info: state.eventLogs.filter(l => l.level === 'Informacija').length,
  };

  return (
    <div className="h-full flex flex-col bg-white text-sm select-none">
      {/* Alatna traka */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 flex-wrap gap-y-1">
        <span className="text-xs font-semibold text-gray-600 mr-1">Filtar:</span>
        {(['all', 'Pogreška', 'Upozorenje', 'Informacija'] as FilterLevel[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              filter === f ? 'bg-blue-600 text-white shadow' : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {f === 'all' ? `Sve (${state.eventLogs.length})` : `${levelIcon[f]} ${f} (${f === 'Pogreška' ? counts.error : f === 'Upozorenje' ? counts.warn : counts.info})`}
          </button>
        ))}
        <input
          type="text"
          placeholder="Pretraži..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto px-2 py-1 border border-gray-300 rounded text-xs outline-none focus:border-blue-400"
          style={{ width: 120 }}
        />
        <button
          onClick={handleExport}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${exported ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-600'}`}
          title="Izvezi izvještaj"
        >
          {exported ? <>✓ Izvezeno</> : <><Download size={12} /> Izvezi</>}
        </button>
        <button
          onClick={() => setSelectedEvent(null)}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
          title="Osvježi"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Bočna traka */}
        <div className="w-44 border-r border-gray-200 bg-gray-50 p-2 shrink-0 overflow-auto">
          <div className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase tracking-wide">Preglednik događaja</div>
          {([
            { cat: 'system' as const,      label: 'Sustav',      icon: '⚙️' },
            { cat: 'application' as const, label: 'Aplikacije',  icon: '📄' },
            { cat: 'security' as const,    label: 'Sigurnost',   icon: '🔒' },
          ]).map(({ cat, label, icon }) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full text-left px-2 py-2 rounded text-xs flex items-center gap-2 transition-colors mb-0.5 ${
                selectedLog === cat ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          <div className="mt-4 px-2 space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Sažetak</div>
            <div className="flex items-center gap-1 text-[10px] text-red-600"><span>🔴</span> {counts.error} pogrešaka</div>
            <div className="flex items-center gap-1 text-[10px] text-amber-600"><span>🟡</span> {counts.warn} upozorenja</div>
            <div className="flex items-center gap-1 text-[10px] text-blue-600"><span>🔵</span> {counts.info} informacija</div>
          </div>
        </div>

        {/* Popis događaja */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-auto">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Nema događaja za odabrane filtere
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                  <tr>
                    <th className="text-left px-2 py-2 font-semibold text-gray-600 w-24">Razina</th>
                    <th className="text-left px-2 py-2 font-semibold text-gray-600 w-36">Datum/Vrijeme</th>
                    <th className="text-left px-2 py-2 font-semibold text-gray-600">Izvor</th>
                    <th className="text-left px-2 py-2 font-semibold text-gray-600 w-12">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedEvent(log.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedEvent === log.id
                          ? 'bg-blue-100 border-blue-300'
                          : `${levelBg[log.level]} hover:brightness-95`
                      }`}
                    >
                      <td className="px-2 py-1.5">
                        <span className={`inline-flex items-center gap-1 font-medium ${levelText[log.level]}`}>
                          {levelIcon[log.level]} {log.level}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-gray-500 font-mono">{log.timestamp}</td>
                      <td className="px-2 py-1.5 text-gray-700 truncate max-w-0" style={{ maxWidth: 160 }}>{log.source}</td>
                      <td className="px-2 py-1.5 text-gray-500">{log.eventId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detalj */}
          {selectedEventData ? (
            <div className="border-t-2 border-gray-300 bg-gray-50 p-3 shrink-0" style={{ maxHeight: 130 }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{levelIcon[selectedEventData.level]}</span>
                <span className={`text-xs font-bold ${levelText[selectedEventData.level]}`}>{selectedEventData.level}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs font-semibold text-gray-700">{selectedEventData.source}</span>
                <span className="text-xs text-gray-500">ID: {selectedEventData.eventId}</span>
                <span className="text-xs text-gray-400 ml-auto">{selectedEventData.timestamp}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed overflow-auto" style={{ maxHeight: 70 }}>
                {selectedEventData.message}
              </p>
            </div>
          ) : (
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 shrink-0 text-xs text-gray-400">
              Odaberite događaj za detalje
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
