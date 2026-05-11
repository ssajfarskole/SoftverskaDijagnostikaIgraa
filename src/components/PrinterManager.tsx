import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Printer, AlertTriangle, CheckCircle, RefreshCw, Trash2, Plus } from 'lucide-react';

interface PrintJob {
  id: number;
  name: string;
  pages: number;
  status: 'Čekanje' | 'Ispis' | 'Pogreška' | 'Pauza';
  size: string;
  owner: string;
  submitted: string;
}

interface PrinterDevice {
  id: string;
  name: string;
  status: 'Spreman' | 'Pogreška' | 'Isključen' | 'Zauzet';
  type: string;
  location: string;
  driver: string;
  isDefault: boolean;
  queueCount: number;
  spoolerStatus: 'Pokrenut' | 'Zaustavljan' | 'Greška';
}

const printers: PrinterDevice[] = [
  {
    id: 'p1',
    name: 'HP LaserJet Pro M404dn',
    status: 'Pogreška',
    type: 'Laserski pisač',
    location: 'Ured A — 2. kat',
    driver: 'HP LaserJet Universal PCL6',
    isDefault: true,
    queueCount: 7,
    spoolerStatus: 'Greška',
  },
  {
    id: 'p2',
    name: 'Canon PIXMA G3460',
    status: 'Spreman',
    type: 'Tintni pisač (MFP)',
    location: 'Knjiznica',
    driver: 'Canon PIXMA G3460 series',
    isDefault: false,
    queueCount: 0,
    spoolerStatus: 'Pokrenut',
  },
  {
    id: 'p3',
    name: 'Microsoft Print to PDF',
    status: 'Spreman',
    type: 'Virtualni pisač',
    location: 'Lokalno',
    driver: 'Microsoft PDF',
    isDefault: false,
    queueCount: 0,
    spoolerStatus: 'Pokrenut',
  },
];

const printJobs: PrintJob[] = [
  { id: 1, name: 'Godišnji_izvještaj_2024.docx',    pages: 45, status: 'Pogreška', size: '2.3 MB', owner: 'Admin',   submitted: '10:15' },
  { id: 2, name: 'Ugovor_klijent_A.pdf',              pages: 8,  status: 'Čekanje', size: '456 KB', owner: 'Marija',  submitted: '10:22' },
  { id: 3, name: 'Prezentacija_Q1.pptx',              pages: 20, status: 'Čekanje', size: '5.1 MB', owner: 'Ivica',   submitted: '10:30' },
  { id: 4, name: 'Tablice_proračun.xlsx',             pages: 12, status: 'Čekanje', size: '890 KB', owner: 'Petra',   submitted: '10:35' },
  { id: 5, name: 'Zapisnik_sjednice.docx',            pages: 4,  status: 'Pauza',   size: '234 KB', owner: 'Admin',   submitted: '10:40' },
  { id: 6, name: 'Troškovnik_projekt_X.xlsx',         pages: 6,  status: 'Čekanje', size: '312 KB', owner: 'Josip',   submitted: '10:45' },
  { id: 7, name: 'Oglas_za_radno_mjesto.pdf',         pages: 2,  status: 'Čekanje', size: '78 KB',  owner: 'HR_Odjel',submitted: '10:50' },
];

export const PrinterManager: React.FC = () => {
  const { addAction } = useGame();
  const [selectedPrinter, setSelectedPrinter] = useState<string>('p1');
  const [queue, setQueue] = useState<PrintJob[]>(printJobs);
  const [spoolerRestarted, setSpoolerRestarted] = useState(false);
  const [queueCleared, setQueueCleared] = useState(false);
  const [tab, setTab] = useState<'printers' | 'queue' | 'settings'>('printers');

  const handleTabChange = (newTab: 'printers' | 'queue' | 'settings') => {
    setTab(newTab);
    if (newTab === 'queue') {
      addAction('view_printer_queue');
    }
  };

  const printer = printers.find(p => p.id === selectedPrinter);

  const handleClearQueue = () => {
    setQueue([]);
    setQueueCleared(true);
    addAction('clear_print_queue');
    addAction('open_printer');
  };

  const handleRestartSpooler = () => {
    setSpoolerRestarted(true);
    addAction('restart_print_spooler');
    addAction('open_printer');
  };

  const handleCancelJob = (id: number) => {
    setQueue(prev => prev.filter(j => j.id !== id));
  };

  const statusColor: Record<string, string> = {
    'Spreman':   'bg-green-100 text-green-800 border-green-300',
    'Pogreška':  'bg-red-100 text-red-800 border-red-300',
    'Isključen': 'bg-gray-100 text-gray-600 border-gray-300',
    'Zauzet':    'bg-blue-100 text-blue-800 border-blue-300',
  };

  const jobStatusColor: Record<string, string> = {
    'Pogreška': 'bg-red-100 text-red-700',
    'Čekanje':  'bg-yellow-100 text-yellow-700',
    'Ispis':    'bg-blue-100 text-blue-700',
    'Pauza':    'bg-orange-100 text-orange-700',
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs">
      {/* Tabovi */}
      <div className="flex border-b border-gray-200 shrink-0">
        {([
          { key: 'printers', label: '🖨️ Pisači' },
          { key: 'queue', label: `📄 Red čekanja (${queue.length})` },
          { key: 'settings', label: '⚙️ Dijagnostika' },
        ] as { key: typeof tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-3 py-2 text-xs font-semibold transition-colors border-b-2 ${
              tab === t.key ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'printers' && (
          <div className="p-3 space-y-2">
            {printers.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPrinter(p.id)}
                className={`rounded-xl border p-3 cursor-pointer transition-all ${
                  selectedPrinter === p.id
                    ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
                    : p.status === 'Pogreška' ? 'border-red-200 bg-red-50 hover:border-red-300' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Printer size={20} className={p.status === 'Pogreška' ? 'text-red-500' : p.status === 'Spreman' ? 'text-green-600' : 'text-gray-400'} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-[11px]">{p.name}</span>
                        {p.isDefault && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">Zadano</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{p.type} • {p.location}</div>
                      <div className="text-[10px] text-gray-400">Driver: {p.driver}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border shrink-0 ${statusColor[p.status]}`}>
                    {p.status === 'Pogreška' ? <AlertTriangle className="inline w-3 h-3 mr-0.5" /> : <CheckCircle className="inline w-3 h-3 mr-0.5" />}
                    {p.status}
                  </span>
                </div>
                {p.queueCount > 0 && (
                  <div className="mt-2 text-[10px] text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
                    ⚠ {p.queueCount} dokumenata u redu čekanja | Spooler: {p.spoolerStatus}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'queue' && (
          <div>
            {queue.length > 0 ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-600 flex-1">{queue.length} dokumenata</span>
                  <button
                    onClick={handleClearQueue}
                    className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors"
                  >
                    <Trash2 size={10} /> Obriši sve
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {queue.map(job => (
                    <div key={job.id} className={`flex items-center px-3 py-2 gap-2 ${jobStatusColor[job.status]}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[11px] truncate">{job.name}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">
                          {job.pages} str. • {job.size} • {job.owner} • {job.submitted}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${jobStatusColor[job.status]}`}>
                        {job.status}
                      </span>
                      <button
                        onClick={() => handleCancelJob(job.id)}
                        className="p-1 rounded hover:bg-red-200 text-red-600 transition-colors shrink-0"
                        title="Otkaži"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : queueCleared ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-green-600">
                <CheckCircle size={40} />
                <div className="font-bold text-sm">Red čekanja obrisan!</div>
                <div className="text-xs text-gray-500">Pokrenite Print Spooler za nastavak ispisa</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                <Printer size={40} className="opacity-30" />
                <div className="text-sm">Red čekanja je prazan</div>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="p-3 space-y-3">
            <div className={`rounded-xl p-3 border ${spoolerRestarted ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${spoolerRestarted ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-bold text-[11px] text-gray-800">Print Spooler usluga</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${spoolerRestarted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {spoolerRestarted ? 'Pokrenut' : 'Greška'}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mb-2">
                {spoolerRestarted
                  ? 'Print Spooler uspješno pokrenut. Ispis bi trebao funkcionirati normalno.'
                  : 'Print Spooler usluga je pala. Ovo uzrokuje zastoj u redu čekanja pisača. Trebate restartati uslugu.'
                }
              </p>
              {!spoolerRestarted && (
                <button
                  onClick={handleRestartSpooler}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                >
                  <RefreshCw size={10} /> Restartaj Print Spooler
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2">
              <div className="font-bold text-[11px] text-gray-700">📋 Dijagnostički koraci</div>
              {[
                { done: spoolerRestarted, text: 'Restartaj Print Spooler uslugu' },
                { done: queueCleared, text: 'Obriši zaglavljene dokumente iz reda' },
                { done: false, text: 'Provjeri upravljački program pisača' },
                { done: false, text: 'Testiraj ispis test stranice' },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-[10px] ${step.done ? 'text-green-700' : 'text-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {step.done ? <CheckCircle size={10} className="text-white" /> : <span className="text-[8px] text-gray-600">{i+1}</span>}
                  </div>
                  <span className={step.done ? 'line-through' : ''}>{step.text}</span>
                </div>
              ))}
              <button
                onClick={() => addAction('test_printer_print')}
                className="w-full mt-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors"
              >
                🖨️ Testiraj ispis test stranice
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="font-bold text-[10px] text-blue-800 mb-1">💡 Savjet</div>
              <div className="text-[10px] text-blue-700">
                Ako restartanje Spoolera ne pomogne, pokušajte: net stop spooler / del /Q /F /S "%systemroot%\System32\spool\PRINTERS\*.*" / net start spooler
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
