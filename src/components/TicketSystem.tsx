import React, { useState } from 'react';
import { levels } from '../gameData';
import { useGame } from '../GameContext';

const priorityColors: Record<string, string> = {
  'Kritičan': 'bg-red-100 text-red-800 border-red-300',
  'Visok':    'bg-orange-100 text-orange-800 border-orange-300',
  'Srednji':  'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Nizak':    'bg-green-100 text-green-800 border-green-300',
};

const priorityIcon: Record<string, string> = {
  'Kritičan': 'R',
  'Visok':    'V',
  'Srednji':  'S',
  'Nizak':    'N',
};

const actionLabels: Record<string, string> = {
  open_eventviewer: 'Otvori Preglednik događaja',
  view_system_log: 'Pregledaj sistemski dnevnik',
  view_application_log: 'Pregledaj dnevnik aplikacija',
  open_taskmanager: 'Otvori Upravitelj zadataka',
  kill_malware_process: 'Zaustavi zlonamjerni proces',
  run_antivirus_scan: 'Pokreni antivirusni sken',
  remove_threats: 'Ukloni prijetnje',
  identify_phishing_email: 'Identificiraj phishing e-mail',
  identify_ransomware_popup: 'Identificiraj ransomware popup',
  open_email: 'Otvori e-poštu',
  open_fakebrowser: 'Otvori preglednik',
  open_registry: 'Otvori Uređivač registra',
  fix_registry_keys: 'Popravi registre',
  open_usbtool: 'Otvori USB dijagnostiku',
  usb_device_restart: 'Restartaj USB uređaj',
  run_driverquery: 'Pokreni driverquery',
  rollback_driver: 'Vrati upravljački program',
  open_printer: 'Otvori upravljanje pisačem',
  clear_print_queue: 'Očisti red pisača',
  restart_print_spooler: 'Restartaj servis pisača',
  test_printer_print: 'Testiraj ispis na pisač',
  open_cloudbackup: 'Otvori Cloud sigurnosnu kopiju',
  create_backup_copy: 'Kreiraj sigurnosnu kopiju',
  restore_backup: 'Obnovi iz sigurnosne kopije',
  open_terminal: 'Otvori Naredbeni redak',
  run_chkdsk: 'Pokreni chkdsk',
  open_bios: 'Otvori BIOS/UEFI',
  find_bios_version: 'Pronađi verziju BIOS-a',
  enable_usb_boot: 'Omogući USB boot',
  save_bios_settings: 'Spremi BIOS postavke',
  run_ipconfig: 'Pokreni ipconfig',
  run_ipconfig_renew: 'Obnovi IP adresu',
  run_ipconfig_flushdns: 'Očisti DNS predmemoriju',
  run_ping: 'Pokreni ping',
  run_systeminfo: 'Pokreni systeminfo',
  run_netstat: 'Pokreni netstat',
  run_disk_cleanup: 'Pokreni čišćenje diska',
  open_resource: 'Otvori nadzor resursa',
  run_sfc_scannow: 'Pokreni sfc /scannow',
  system_restart: 'Restartaj sustav',
  expand_registry_folders: 'Raštrkaj registre',
  identify_suspicious_driver: 'Identificiraj sumnjivi upravljački program',
  read_all_emails: 'Pročitaj sve e-mailove',
  view_printer_queue: 'Pregledaj red čekanja pisača',
  check_network_adapter: 'Provjeri mrežni adapter',
  run_ipconfig_release: 'Osvježi IP adresu',
  check_boot_order: 'Provjeri redoslijed boot uređaja',
  disable_secure_boot: 'Onemogući Secure Boot',
  reset_bios_settings: 'Resetiraj BIOS postavke',
  check_bios_version: 'Provjeri verziju BIOS-a',
  check_usb_boot: 'Provjeri je li USB za bootanje priključen',
  configure_bios_power: 'Konfiguriraj power management',
};

export const TicketSystem: React.FC = () => {
  const { state, showHint } = useGame();
  const level = levels[state.currentLevel];
  const [hintVisible, setHintVisible] = useState(false);
  const [tab, setTab] = useState<'details' | 'checklist' | 'hints'>('details');

  const completedActions = level.requiredActions.filter(a => state.actions.includes(a));
  const progress = Math.round((completedActions.length / level.requiredActions.length) * 100);

  const allComplete = completedActions.length === level.requiredActions.length;

  return (
    <div className="h-full flex flex-col bg-white text-sm">
      {/* Zaglavlje zahtjeva */}
      <div className="shrink-0 p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-blue-200 text-xs">{level.ticketNumber}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityColors[level.priority]}`}>
                {priorityIcon[level.priority]} {level.priority}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm leading-tight">{level.title}</h3>
            <div className="text-blue-200 text-xs mt-1 flex items-center gap-2">
              <span>👤 {level.client}</span>
              <span>•</span>
              <span>⏱ {Math.floor(level.maxTime / 60)} min</span>
              <span>•</span>
              <span>Razina {state.currentLevel + 1}/{levels.length}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white/70 text-[10px] mb-0.5">Napredak</div>
            <div className={`text-2xl font-black ${allComplete ? 'text-green-300' : 'text-white'}`}>{progress}%</div>
          </div>
        </div>
        {/* Progress traka */}
        <div className="mt-2 w-full bg-blue-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${allComplete ? 'bg-green-400' : 'bg-blue-200'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tabovi */}
      <div className="flex border-b border-gray-200 shrink-0">
        {([
          { key: 'details',   label: 'Detalji' },
          { key: 'checklist', label: `Zadaci (${completedActions.length}/${level.requiredActions.length})` },
          { key: 'hints',     label: `💡 Savjeti` },
        ] as { key: typeof tab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs font-semibold transition-colors border-b-2 ${
              tab === t.key ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'details' && (
          <div className="p-3 space-y-3">
            <div>
              <div className="font-bold text-gray-700 text-xs mb-1.5 flex items-center gap-1">
                📋 Opis problema
              </div>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                {level.description}
              </p>
            </div>
            <div>
              <div className="font-bold text-gray-700 text-xs mb-1.5">🔍 Simptomi</div>
              <ul className="space-y-1">
                {level.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                    <span className="text-yellow-500 shrink-0 mt-0.5">⚠</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
              <div className="font-bold text-blue-800 text-xs mb-1">⏰ Mjerač vremena</div>
              <div className="text-xl font-black text-blue-700 font-mono">
                {String(Math.floor(state.timer / 60)).padStart(2, '0')}:{String(state.timer % 60).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-blue-500 mt-0.5">
                Maks. {Math.floor(level.maxTime / 60)} min | Preostalo: {Math.floor(Math.max(0, level.maxTime - state.timer) / 60)}min {Math.max(0, level.maxTime - state.timer) % 60}s
              </div>
            </div>
            {state.levelComplete && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-3">
                <div className="text-green-800 font-black text-sm">🎉 Zadatak završen!</div>
                <div className="text-green-700 text-xs mt-1">{level.educationalFeedback}</div>
              </div>
            )}
          </div>
        )}

        {tab === 'checklist' && (
          <div className="p-3 space-y-1">
            <div className="text-xs text-gray-500 mb-2 font-medium">Radnje koje morate izvršiti:</div>
            {level.requiredActions.map((action, i) => {
              const done = state.actions.includes(action);
              return (
                <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                  done ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    done ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${done ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                      {actionLabels[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {done && <div className="text-[10px] text-green-600">Završeno</div>}
                  </div>
                </div>
              );
            })}
            <div className="mt-3 p-2 bg-gray-100 rounded-lg">
              <div className="text-xs text-gray-500">
                Bodovi: <strong>{state.wrongActions > 0 ? `Kazna: -${state.wrongActions * 50}` : 'Nema kazni'}</strong>
              </div>
              <div className="text-xs text-gray-500">
                Savjeti iskorišteni: <strong>{state.hintsUsed}</strong> (svaki -100 bod.)
              </div>
            </div>
          </div>
        )}

        {tab === 'hints' && (
          <div className="p-3 space-y-2">
            {level.hints.slice(0, state.currentHint).map((hint, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex gap-2">
                <span className="text-amber-500 text-lg shrink-0">💡</span>
                <div>
                  <div className="text-[10px] font-bold text-amber-700 mb-0.5">Savjet {i + 1}</div>
                  <div className="text-xs text-amber-800 leading-relaxed">{hint}</div>
                </div>
              </div>
            ))}
            {state.currentHint === 0 && (
              <div className="text-center py-6 text-gray-400">
                <div className="text-3xl mb-2">🤔</div>
                <div className="text-sm font-medium">Nema iskorištenih savjeta</div>
                <div className="text-xs mt-1">Pokušajte riješiti sami za više bodova!</div>
              </div>
            )}
            {state.currentHint < level.hints.length && (
              <button
                onClick={() => { showHint(); setHintVisible(true); }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                Otkrij sljedeći savjet (-100 bodova)
              </button>
            )}
            {state.currentHint >= level.hints.length && (
              <div className="text-center text-xs text-gray-400 py-3">Svi savjeti iskorišteni</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
