import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Usb, AlertCircle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

interface USBDevice {
  id: string;
  name: string;
  type: string;
  status: 'OK' | 'Pogreška' | 'Nepoznat' | 'Isključen';
  port: string;
  vendor: string;
  speed: string;
  capacity?: string;
  serial: string;
  driverOK: boolean;
  errorCode?: number;
  details: string;
}

const usbDevices: USBDevice[] = [
  {
    id: 'usb1',
    name: 'Kingston DataTraveler 64 GB',
    type: 'Flash Drive',
    status: 'Pogreška',
    port: 'USB 3.0 Port 3',
    vendor: 'Kingston Technology',
    speed: 'SuperSpeed USB (5 Gbps)',
    capacity: '64 GB',
    serial: 'KT00783921KK',
    driverOK: false,
    errorCode: 43,
    details: 'Windows je zaustavio ovaj uređaj jer je prijavilo probleme. (Kod 43)',
  },
  {
    id: 'usb2',
    name: 'Logitech USB Receiver',
    type: 'HID Uređaj',
    status: 'OK',
    port: 'USB 2.0 Port 1',
    vendor: 'Logitech International',
    speed: 'High Speed USB (480 Mbps)',
    serial: 'LGT00291AAB',
    driverOK: true,
    details: 'USB primopredajnik za bežičnu tipkovnicu i miš. Radi ispravno.',
  },
  {
    id: 'usb3',
    name: 'Nepoznat USB uređaj',
    type: 'Nepoznato',
    status: 'Nepoznat',
    port: 'USB 3.0 Port 2',
    vendor: 'Nepoznat proizvođač',
    speed: 'Full Speed USB (12 Mbps)',
    serial: '???',
    driverOK: false,
    errorCode: 28,
    details: 'Upravljački programi za ovaj uređaj nisu instalirani. (Kod 28)',
  },
  {
    id: 'usb4',
    name: 'Samsung T7 SSD',
    type: 'Vanjski SSD',
    status: 'OK',
    port: 'USB 3.2 Port (Type-C)',
    vendor: 'Samsung Electronics',
    speed: 'SuperSpeed+ USB (10 Gbps)',
    capacity: '1 TB',
    serial: 'S4EVNF0R123456',
    driverOK: true,
    details: 'Samsung prenosivi NVMe SSD. Radi ispravno. Formatiran: exFAT.',
  },
];

export const USBTool: React.FC = () => {
  const { addAction, executeCommand } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restarted, setRestarted] = useState<Set<string>>(new Set());
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const selected = usbDevices.find(d => d.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    addAction('open_usbtool');
  };

  const handleRestart = (id: string) => {
    setRestarted(prev => new Set([...prev, id]));
    addAction('usb_device_restart');
  };

  const handleScan = () => {
    if (scanning || scanComplete) return;
    setScanning(true);
    setProgress(0);
    addAction('usb_scan');
    let p = 0;
    const iv = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        setScanning(false);
        setScanComplete(true);
      }
    }, 200);
  };

  const statusBg: Record<string, string> = {
    'OK': 'bg-green-100 text-green-800 border-green-300',
    'Pogreška': 'bg-red-100 text-red-800 border-red-300',
    'Nepoznat': 'bg-orange-100 text-orange-800 border-orange-300',
    'Isključen': 'bg-gray-100 text-gray-600 border-gray-300',
  };

  return (
    <div className="h-full flex flex-col bg-white text-xs">
      {/* Alatna traka */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
        <Usb size={14} className="text-blue-600" />
        <span className="font-bold text-gray-700 text-xs">USB Dijagnostika</span>
        <div className="flex-1" />
        {!scanComplete ? (
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw size={10} className={scanning ? 'animate-spin' : ''} />
            {scanning ? `Skeniranje ${progress}%...` : 'Skeniraj uređaje'}
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-green-700 font-bold">
            <CheckCircle size={12} /> Skeniranje završeno
          </div>
        )}
      </div>

      {/* Progress */}
      {scanning && (
        <div className="px-3 py-2 border-b border-gray-200 shrink-0">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-blue-500 progress-shimmer rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Lista uređaja */}
        <div className="w-52 border-r border-gray-200 overflow-auto bg-gray-50 shrink-0">
          <div className="p-2 border-b border-gray-200">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Pronađeni uređaji ({usbDevices.length})</div>
          </div>
          {usbDevices.map(dev => (
            <div
              key={dev.id}
              onClick={() => handleSelect(dev.id)}
              className={`px-2 py-2.5 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedId === dev.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Usb size={12} className={dev.status === 'OK' ? 'text-green-600' : 'text-red-500'} />
                <span className="font-semibold text-[10px] text-gray-800 truncate">{dev.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500">{dev.port}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${statusBg[dev.status]}`}>
                  {dev.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detalji uređaja */}
        <div className="flex-1 overflow-auto bg-white">
          {selected ? (
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{selected.name}</h3>
                  <p className="text-[10px] text-gray-500">{selected.type} • {selected.vendor}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${statusBg[selected.status]}`}>
                  {selected.status === 'OK' ? <><CheckCircle className="inline w-3 h-3 mr-1" />Ispravno</> : <><AlertCircle className="inline w-3 h-3 mr-1" />{selected.status}</>}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Port', value: selected.port },
                  { label: 'Brzina', value: selected.speed },
                  { label: 'Serijski broj', value: selected.serial },
                  { label: 'Kapacitet', value: selected.capacity || 'N/A' },
                  { label: 'Upravljački prog.', value: selected.driverOK ? '✓ Ispravno instaliran' : '✗ Problem s driverom' },
                  { label: 'Kod pogreške', value: selected.errorCode ? `Kod ${selected.errorCode}` : 'Nema' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <div className="text-[9px] text-gray-500 font-medium">{item.label}</div>
                    <div className={`font-semibold text-[10px] mt-0.5 ${!selected.driverOK && item.label === 'Upravljački prog.' ? 'text-red-600' : 'text-gray-800'}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detalji i poruka o grešci */}
              <div className={`rounded-xl p-3 border ${selected.status === 'OK' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-[10px] font-bold mb-1 ${selected.status === 'OK' ? 'text-green-800' : 'text-red-800'}`}>
                  {selected.status === 'OK' ? '✓ Dijagnostika' : '⚠ Dijagnostika — Problem pronađen'}
                </div>
                <p className={`text-[10px] leading-relaxed ${selected.status === 'OK' ? 'text-green-700' : 'text-red-700'}`}>
                  {selected.details}
                </p>
              </div>

              {/* Akcije */}
              {selected.status !== 'OK' && (
                <div className="flex flex-col gap-2">
                  {!restarted.has(selected.id) ? (
                    <button
                      onClick={() => handleRestart(selected.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] transition-colors"
                    >
                      <RefreshCw size={12} /> Restartaj upravljački program
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-xl text-[10px] text-green-800 font-bold">
                      <CheckCircle size={12} /> Upravljački program resetiran - provjerite uređaj
                    </div>
                  )}
                  <button
                    onClick={() => {
                      addAction('run_chkdsk');
                      executeCommand('chkdsk');
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[10px] transition-colors"
                  >
                    <Trash2 size={12} /> Pokreni provjeru diska
                  </button>
                </div>
              )}

              {scanComplete && selected.status === 'OK' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 text-[10px] text-blue-800">
                  📊 SMART podaci: Status OK | Pročitano: 134 GB | Zapisano: 89 GB | Starih sektora: 0
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <Usb size={48} className="opacity-30" />
              <div className="text-sm font-medium">Odaberite USB uređaj s lijeve strane</div>
              <div className="text-xs">za dijagnostiku i rješavanje problema</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
