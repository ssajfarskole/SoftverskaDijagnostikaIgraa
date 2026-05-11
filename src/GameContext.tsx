import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GameLevel, ProcessData, EventLogData, RegistryKeyData, levels, popupMessages } from './gameData';

export interface WindowState {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
}

export interface PopupData {
  id: string;
  x: number;
  y: number;
  title: string;
  message: string;
}

export interface TerminalEntry {
  command: string;
  output: string;
  isError?: boolean;
}

interface GameState {
  currentLevel: number;
  score: number;
  totalScore: number;
  actions: string[];
  wrongActions: number;
  completedLevels: number[];
  openWindows: WindowState[];
  processes: ProcessData[];
  eventLogs: EventLogData[];
  registryKeys: RegistryKeyData[];
  systemHealth: number;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkUsage: number;
  isBSOD: boolean;
  bsodCode: string;
  bsodVisible: boolean;
  hasMalware: boolean;
  hasRegistryCorruption: boolean;
  hasDriverConflict: boolean;
  levelComplete: boolean;
  showScore: boolean;
  showTicket: boolean;
  timer: number;
  timerRunning: boolean;
  antivirusScanning: boolean;
  antivirusProgress: number;
  antivirusComplete: boolean;
  threatsRemoved: boolean;
  sfcRunning: boolean;
  sfcProgress: number;
  sfcComplete: boolean;
  malwareKilled: boolean;
  registryFixed: boolean;
  driverFixed: boolean;
  systemRepaired: boolean;
  systemRestarted: boolean;
  startMenuOpen: boolean;
  popups: PopupData[];
  hintsUsed: number;
  currentHint: number;
  terminalHistory: TerminalEntry[];
  allLevelsComplete: boolean;
  notification: string | null;
  eventViewerLogViewed: string | null;
  driverQueryRun: boolean;
  zIndexCounter: number;
}

interface GameContextType {
  state: GameState;
  openWindow: (type: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPos: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  executeCommand: (cmd: string) => void;
  killProcess: (pid: number) => void;
  fixRegistryKey: (id: string) => void;
  startAntivirusScan: () => void;
  removeThreats: () => void;
  startSFCScan: () => void;
  restartSystem: () => void;
  rollbackDriver: (name: string) => void;
  nextLevel: () => void;
  setLevel: (idx: number) => void;
  showHint: () => void;
  toggleStartMenu: () => void;
  closePopup: (id: string) => void;
  dismissNotification: () => void;
  dismissBSOD: () => void;
  viewLog: (logType: string) => void;
  runDriverQuery: () => void;
  addAction: (action: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const getWindowConfig = (type: string): { title: string; width: number; height: number } => {
  const configs: Record<string, { title: string; width: number; height: number }> = {
    tickets:     { title: 'Sustav zahtjeva',           width: 520,  height: 480 },
    terminal:    { title: 'Naredbeni redak',            width: 680,  height: 420 },
    taskmanager: { title: 'Upravitelj zadataka',        width: 650,  height: 500 },
    eventviewer: { title: 'Preglednik događaja',        width: 720,  height: 540 },
    registry:    { title: 'Uređivač registra',          width: 680,  height: 500 },
    antivirus:   { title: 'Antivirusni skener',         width: 500,  height: 450 },
    resource:    { title: 'Nadzor resursa',             width: 560,  height: 460 },
    thispc:      { title: 'Ovo računalo',               width: 500,  height: 400 },
    fakebrowser: { title: 'WebExplorer 2024',           width: 740,  height: 520 },
    email:       { title: 'Klijent e-pošte',            width: 700,  height: 520 },
    usbtool:     { title: 'USB Dijagnostika',           width: 560,  height: 440 },
    printer:     { title: 'Upravljanje pisačem',        width: 600,  height: 460 },
    cloudbackup: { title: 'Cloud Sigurnosna kopija',   width: 620,  height: 480 },
    bios:        { title: 'BIOS/UEFI Setup Utility',   width: 700,  height: 540 },
    levelmenu:   { title: 'Izbor levela',               width: 400,  height: 560 },
  };
  return configs[type] || { title: type, width: 500, height: 400 };
};

const initLevel = (level: GameLevel, completedLevels: number[] = []) => {
  const s = level.initialState;
  return {
    processes: [...s.processes],
    eventLogs: [...s.eventLogs],
    registryKeys: s.registryKeys.map(k => ({ ...k })),
    systemHealth: s.systemHealth,
    cpuUsage: s.cpuUsage,
    ramUsage: s.ramUsage,
    diskUsage: s.diskUsage,
    networkUsage: s.networkUsage,
    isBSOD: s.hasBSOD,
    bsodCode: s.bsodCode,
    bsodVisible: s.hasBSOD,
    hasMalware: s.hasMalware,
    hasRegistryCorruption: s.hasRegistryCorruption,
    hasDriverConflict: s.hasDriverConflict,
    levelComplete: false,
    showScore: false,
    showTicket: true,
    timer: 0,
    timerRunning: true,
    antivirusScanning: false,
    antivirusProgress: 0,
    antivirusComplete: false,
    threatsRemoved: false,
    sfcRunning: false,
    sfcProgress: 0,
    sfcComplete: false,
    malwareKilled: false,
    registryFixed: false,
    driverFixed: false,
    systemRepaired: false,
    systemRestarted: false,
    popups: [] as PopupData[],
    hintsUsed: 0,
    currentHint: 0,
    terminalHistory: [] as TerminalEntry[],
    notification: `Novi zahtjev: ${level.ticketNumber} - ${level.title}`,
    eventViewerLogViewed: null as string | null,
    driverQueryRun: false,
    actions: [] as string[],
    completedLevels,
    wrongActions: 0,
    openWindows: [] as WindowState[],
    startMenuOpen: false,
    allLevelsComplete: false,
  };
};

const checkWinCondition = (state: GameState, level: GameLevel): boolean =>
  level.requiredActions.every(a => state.actions.includes(a));

const calculateScore = (state: GameState, level: GameLevel): number => {
  const base = 1000;
  const timeRatio = Math.max(0, 1 - state.timer / level.maxTime);
  const timeBonus = Math.round(timeRatio * 500);
  const accuracyPenalty = state.wrongActions * 50;
  const accuracyBonus = Math.max(0, 500 - accuracyPenalty);
  const hintPenalty = state.hintsUsed * 100;
  return Math.max(0, base + timeBonus + accuracyBonus - hintPenalty);
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => ({
    currentLevel: 0,
    score: 0,
    totalScore: 0,
    zIndexCounter: 100,
    ...initLevel(levels[0], []),
  }));

  const popupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bsodIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.timerRunning && !state.levelComplete) {
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.timerRunning, state.levelComplete]);

  useEffect(() => {
    if (state.hasMalware && !state.malwareKilled && !state.levelComplete) {
      if (levels[state.currentLevel]?.id === 8) {
        // For ransomware level, show one big popup
        setState(prev => {
          if (prev.popups.length === 0) {
            return {
              ...prev,
              popups: [{
                id: 'ransomware-popup',
                x: 100,
                y: 50,
                title: popupMessages[0].title,
                message: popupMessages[0].message,
              }],
            };
          }
          return prev;
        });
      } else {
        // For other malware levels, show multiple small popups
        popupIntervalRef.current = setInterval(() => {
          const msg = popupMessages[Math.floor(Math.random() * popupMessages.length)];
          setState(prev => {
            if (prev.popups.length >= 4) return prev;
            return {
              ...prev,
              popups: [...prev.popups, {
                id: `popup-${Date.now()}`,
                x: 80 + Math.random() * 380,
                y: 40 + Math.random() * 240,
                title: msg.title,
                message: msg.message,
              }],
            };
          });
        }, 4500);
      }
    }
    return () => { if (popupIntervalRef.current) clearInterval(popupIntervalRef.current); };
  }, [state.hasMalware, state.malwareKilled, state.levelComplete, state.currentLevel]);

  useEffect(() => {
    if (state.isBSOD && !state.sfcComplete && !state.levelComplete) {
      bsodIntervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, bsodVisible: !prev.bsodVisible }));
      }, 9000);
    }
    return () => { if (bsodIntervalRef.current) clearInterval(bsodIntervalRef.current); };
  }, [state.isBSOD, state.sfcComplete, state.levelComplete]);

  const getNextZ = useCallback(() => {
    let z = 0;
    setState(prev => { z = prev.zIndexCounter + 1; return { ...prev, zIndexCounter: z }; });
    return z;
  }, []);

  const addAction = useCallback((action: string) => {
    setState(prev => {
      if (prev.actions.includes(action)) return prev;
      const newActions = [...prev.actions, action];
      const level = levels[prev.currentLevel];
      const isRequired = level.requiredActions.includes(action);
      const neutralActions = [
        'identify_phishing',
        'identify_phishing_email',
        'export_event_log',
        'diagnose_wifi',
        'usb_scan',
        'sync_backup',
        'save_bios_settings',
      ];
      const isNeutral = action.startsWith('open_') || neutralActions.includes(action);
      const newWrong = isRequired || isNeutral ? prev.wrongActions : prev.wrongActions + 1;
      const newState = { ...prev, actions: newActions, wrongActions: newWrong };
      if (checkWinCondition(newState, level)) {
        const score = calculateScore(newState, level);
        const completedLevels = prev.completedLevels.includes(prev.currentLevel)
          ? prev.completedLevels
          : [...prev.completedLevels, prev.currentLevel];
        return {
          ...newState,
          levelComplete: true,
          showScore: true,
          timerRunning: false,
          score,
          totalScore: prev.totalScore + score,
          systemHealth: 100,
          cpuUsage: 5,
          ramUsage: 20,
          popups: [],
          bsodVisible: false,
          completedLevels,
        };
      }
      return newState;
    });
  }, []);

  const openWindow = useCallback((type: string) => {
    const config = getWindowConfig(type);
    setState(prev => {
      const existing = prev.openWindows.find(w => w.type === type);
      const z = prev.zIndexCounter + 1;
      if (existing) {
        return {
          ...prev,
          zIndexCounter: z,
          openWindows: prev.openWindows.map(w =>
            w.id === existing.id ? { ...w, minimized: false, zIndex: z } : w
          ),
          startMenuOpen: false,
        };
      }
      const n = prev.openWindows.filter(w => !w.minimized).length;
      const newWindow: WindowState = {
        id: `${type}-${Date.now()}`,
        type,
        title: config.title,
        x: 80 + (n % 6) * 28,
        y: 40 + (n % 6) * 28,
        width: config.width,
        height: config.height,
        minimized: false,
        maximized: false,
        zIndex: z,
      };
      return { ...prev, zIndexCounter: z, openWindows: [...prev.openWindows, newWindow], startMenuOpen: false };
    });
    if (type === 'eventviewer') addAction('open_eventviewer');
    if (type === 'taskmanager') addAction('open_taskmanager');
    if (type === 'registry') addAction('open_registry');
    if (type === 'terminal') addAction('open_terminal');
    if (type === 'antivirus') addAction('open_antivirus');
    if (type === 'resource') addAction('open_resource');
    if (type === 'fakebrowser') addAction('open_fakebrowser');
    if (type === 'email') addAction('open_email');
    if (type === 'usbtool') addAction('open_usbtool');
    if (type === 'printer') addAction('open_printer');
    if (type === 'cloudbackup') addAction('open_cloudbackup');
    if (type === 'bios') addAction('open_bios');
  }, [addAction]);

  const closeWindow = useCallback((id: string) => {
    setState(prev => ({ ...prev, openWindows: prev.openWindows.filter(w => w.id !== id) }));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      openWindows: prev.openWindows.map(w => w.id === id ? { ...w, minimized: true } : w),
    }));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setState(prev => {
      const z = prev.zIndexCounter + 1;
      return {
        ...prev,
        zIndexCounter: z,
        openWindows: prev.openWindows.map(w => w.id === id ? { ...w, minimized: false, zIndex: z } : w),
      };
    });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      openWindows: prev.openWindows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w),
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setState(prev => {
      const z = prev.zIndexCounter + 1;
      return {
        ...prev,
        zIndexCounter: z,
        openWindows: prev.openWindows.map(w => w.id === id ? { ...w, zIndex: z } : w),
      };
    });
  }, []);

  const updateWindowPos = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      openWindows: prev.openWindows.map(w => w.id === id ? { ...w, x, y } : w),
    }));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setState(prev => ({
      ...prev,
      openWindows: prev.openWindows.map(w => w.id === id ? { ...w, width, height } : w),
    }));
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase().replace(/\s+/g, ' ');
    let output = '';
    let isError = false;
    let killedMalware = false;

    setState(prev => {
      if (trimmed === 'help') {
        output = `Dostupne naredbe:\n  help                    Prikaži ovu pomoć\n  cls                     Očisti zaslon\n  tasklist                Popis procesa\n  taskkill /PID <id>      Prekini proces\n  sfc /scannow            Skeniranje sistemskih datoteka\n  chkdsk                  Provjeri disk\n  ipconfig                Mrežna konfiguracija\n  ipconfig /release       Oslobodi IP adresu\n  ipconfig /renew         Obnovi IP adresu\n  ipconfig /flushdns      Očisti DNS predmemoriju\n  identify suspicious driver   Identificiraj sumnjivi upravljački program\n  wmic bios get smbiosbiosversion   Prikaži verziju BIOS-a\n  find bios version        Prikaži verziju BIOS-a\n  check usb boot          Provjeri je li USB za bootanje priključen\n  driverquery             Popis upravljačkih programa\n  systeminfo              Informacije o sustavu\n  netstat                 Mrežne veze\n  netstat -ano            Sve veze s PID-ovima\n  ping <host>             Testiraj konekciju\n  shutdown /r             Pokreni restartanje\n  cleanmgr                Čišćenje diska`;
      } else if (trimmed === 'cls') {
        return { ...prev, terminalHistory: [] };
      } else if (trimmed === 'tasklist') {
        output = 'Naziv slike                    PID   CPU%   Mem%   Status\n' + '='.repeat(60) + '\n';
        prev.processes.forEach(p => {
          output += `${p.name.padEnd(30)} ${String(p.pid).padStart(5)}  ${String(p.cpu).padStart(4)}%  ${String(p.memory).padStart(4)}%  ${p.status}\n`;
        });
      } else if (trimmed.startsWith('taskkill')) {
        const match = trimmed.match(/\/pid\s+(\d+)/i);
        if (match) {
          const pid = parseInt(match[1]);
          const proc = prev.processes.find(p => p.pid === pid);
          if (proc) {
            if (proc.isMalware) {
              output = `USPJEH: Proces "${proc.name}" s PID-om ${pid} je prekinut.`;
              killedMalware = true;
              const newProcesses = prev.processes.filter(p => p.pid !== pid);
              const allMalwareKilled = newProcesses.filter(p => p.isMalware).length === 0;
              return {
                ...prev,
                processes: newProcesses,
                cpuUsage: Math.max(5, prev.cpuUsage - proc.cpu),
                ramUsage: Math.max(20, prev.ramUsage - proc.memory),
                systemHealth: Math.min(100, prev.systemHealth + 10),
                malwareKilled: allMalwareKilled,
              };
            }
            output = `POGREŠKA: Pristup odbijen za "${proc.name}" (PID ${pid}).`;
            isError = true;
          } else {
            output = `POGREŠKA: Proces s PID-om ${pid} nije pronađen.`;
            isError = true;
          }
        } else {
          output = 'Upotreba: taskkill /PID <pid>';
          isError = true;
        }
      } else if (trimmed === 'sfc /scannow' || trimmed === 'sfc/scannow') {
        if (prev.sfcRunning) {
          output = 'SFC već radi. Pričekajte...';
        } else if (prev.sfcComplete) {
          output = 'Windows Resource Protection nije pronašao nikakva kršenja integriteta.';
        } else {
          output = 'Počinje skeniranje sustava. Ovo može potrajati nekoliko minuta...\n';
          setTimeout(() => {
            setState(p => ({ ...p, sfcRunning: true, sfcProgress: 0 }));
            let prog = 0;
            const interval = setInterval(() => {
              prog += 5;
              if (prog >= 100) {
                clearInterval(interval);
                setState(p => ({
                  ...p, sfcRunning: false, sfcProgress: 100, sfcComplete: true,
                  systemRepaired: true, systemHealth: Math.min(100, p.systemHealth + 40),
                  cpuUsage: Math.max(10, p.cpuUsage - 30), isBSOD: false, bsodVisible: false,
                }));
                addAction('run_sfc_scannow');
              } else {
                setState(p => ({ ...p, sfcProgress: prog }));
              }
            }, 200);
          }, 500);
        }
      } else if (trimmed === 'chkdsk') {
        addAction('run_chkdsk');
        output = `Vrsta datotečnog sustava: NTFS\n\nSkeniranje u tijeku...\n\n  100 posto završeno.\n\nWindows nije pronašao problema s diskom.\n  488,384,511 KB ukupnog prostora na disku.\n  234,567,890 KB u 123,456 datoteka.\n            0 KB u lošim sektorima.`;
      } else if (trimmed === 'ipconfig' || trimmed === 'ipconfig /all') {
        addAction('run_ipconfig');
        output = `Windows IP konfiguracija\n\nAdapter Ethernet:\n   IPv4 adresa: 192.168.1.105\n   Maska podmreže: 255.255.255.0\n   Zadani pristupnik: 192.168.1.1\n   DNS poslužitelji: 8.8.8.8, 8.8.4.4`;
      } else if (trimmed === 'ipconfig /release') {
        addAction('run_ipconfig_release');
        output = 'Windows IP konfiguracija\n\nAdapter Ethernet:\n   IP adresa oslobođena.';
      } else if (trimmed === 'ipconfig /renew') {
        addAction('run_ipconfig_renew');
        output = 'Windows IP konfiguracija\n\nAdapter Ethernet:\n   IPv4 adresa: 192.168.1.105\n   Zadani pristupnik: 192.168.1.1\n   IP adresa obnovljena.';
      } else if (trimmed === 'ipconfig /flushdns') {
        addAction('run_ipconfig_flushdns');
        output = 'Windows IP konfiguracija\n\nUSPJEŠNO razriješen predmemorija razlučivač DNS-a.';
      } else if (trimmed === 'identify suspicious driver') {
        addAction('identify_suspicious_driver');
        output = 'Identificiran sumnjivi upravljački program: Realtek_Audio 6.0.9999. Vratite upravljački program na prethodnu verziju.';
      } else if (
        trimmed === 'wmic bios get smbiosbiosversion' ||
        trimmed === 'find bios version' ||
        trimmed === 'bios version' ||
        trimmed === 'check bios version'
      ) {
        addAction('find_bios_version');
        output = 'SMBIOSBIOSVersion\nF.35';
      } else if (trimmed === 'check usb boot') {
        addAction('check_usb_boot');
        output = 'Provjera USB uređaja za bootanje...\n\nUSB Flash Drive (Windows Bootable) je priključen i prepoznat kao boot uređaj.';
      } else if (trimmed === 'driverquery') {
        addAction('run_driverquery');
        output = `Naziv modula           Naziv prikaza           Upravljač          Datum\n${'='.repeat(70)}\nRealtek_Audio          Realtek High Definition  Kernel   2024-03-17\nRTL8168                Realtek PCIe GbE         Kernel   2024-03-17\ndxgkrnl               DirectX Graphics         Kernel   2024-03-10\nNDIS                   Network Driver Interface  Kernel   2024-03-10\nSTORPORT               Microsoft StorPort        Kernel   2024-03-10\nusbaudio               USB Audio                 Kernel   2024-02-28\n\n[!] Realtek_Audio: Verzija 6.0.9999 može biti nekompatibilna s ovom verzijom Windowsa.`;
      } else if (trimmed === 'systeminfo') {
        addAction('run_systeminfo');
        output = `Naziv računala:          RADNA-STANICA-01\nNaziv OS-a:              Microsoft Windows 11 Pro\nVerzija OS-a:            10.0.22621 Build 22621\nProizvođač OS-a:         Microsoft Corporation\nTip OS-a:                Višeprocesorski 64-bitni\nProizvođač sustava:      Dell Inc.\nModel sustava:           Latitude 5530\nInstalirana memorija:    16,384 MB RAM\nDobar fizički memorija:  4,238 MB\nUkupna virtualna mem.:   18,780 MB`;
      } else if (trimmed === 'netstat' || trimmed === 'netstat -ano') {
        addAction('run_netstat');
        output = `Aktivne veze\n\nProto  Lokalna adresa         Strana adresa          Stanje          PID\nTCP    127.0.0.1:49670       127.0.0.1:49671        ESTABLISHED     ${prev.hasMalware ? '9901\nTCP    192.168.1.105:59234   91.215.85.33:443       ESTABLISHED     9902  <-- SUMNJIVO!' : '4'}\nTCP    192.168.1.105:443     142.250.74.14:443      ESTABLISHED     4567\nTCP    192.168.1.105:3389    0.0.0.0:0              LISTENING       892`;
      } else if (trimmed.startsWith('ping')) {
        addAction('run_ping');
        const host = trimmed.split(' ')[1] || '8.8.8.8';
        output = `Pinganje ${host} s 32 bajta podataka:\n\nOdgovor od ${host}: bajtovi=32 vrijeme=12ms TTL=118\nOdgovor od ${host}: bajtovi=32 vrijeme=11ms TTL=118\nOdgovor od ${host}: bajtovi=32 vrijeme=13ms TTL=118\nOdgovor od ${host}: bajtovi=32 vrijeme=12ms TTL=118\n\nStatistike pinganja za ${host}:\n    Paketi: Poslano = 4, Primljeno = 4, Izgubljeno = 0 (0% gubitaka)`;
      } else if (trimmed === 'shutdown /r') {
        addAction('system_restart');
        output = 'Sustav se ponovno pokreće za 60 sekundi...\nZatvorite sve programe prije ponovnog pokretanja.';
      } else if (trimmed === 'cleanmgr') {
        addAction('run_disk_cleanup');
        output = 'Čišćenje diska pokreće se...\n\nAnaliziranje...\n  Privremene datoteke interneta:  2.34 GB\n  Privremene datoteke:            1.12 GB\n  Koš za smeće:                   456 MB\n  Stare Windows instalacije:      8.23 GB\n\nUkupno: 12.15 GB. Čišćenje završeno.';
      } else if (trimmed.startsWith('rollback_driver')) {
        const name = cmd.split(' ').slice(1).join(' ');
        addAction('rollback_driver');
        output = `Vraćanje upravljačkog programa: ${name || 'Realtek Audio'}\n\nVraćanje na prethodnu verziju...\n\nUSPJEH: Upravljački program uspješno vraćen na prethodnu verziju.\nPotrebno je ponovno pokretanje za primjenu promjena.`;
      } else {
        output = `'${cmd}' nije prepoznata kao interna ili eksterna naredba,\noperativni program ili datoteka naredbe.`;
        isError = true;
      }

      return {
        ...prev,
        terminalHistory: [...prev.terminalHistory, { command: cmd, output, isError }],
      };
    });
    if (killedMalware) addAction('kill_malware_process');
  }, [addAction]);

  const killProcess = useCallback((pid: number) => {
    setState(prev => {
      const proc = prev.processes.find(p => p.pid === pid);
      if (!proc) return prev;
      if (!proc.isMalware) return prev;

      const newProcesses = prev.processes.filter(p => p.pid !== pid);
      const allMalwareKilled = newProcesses.filter(p => p.isMalware).length === 0;

      addAction('kill_malware_process');
      return {
        ...prev,
        processes: newProcesses,
        cpuUsage: Math.max(5, prev.cpuUsage - proc.cpu),
        ramUsage: Math.max(20, prev.ramUsage - proc.memory),
        systemHealth: Math.min(100, prev.systemHealth + 10),
        malwareKilled: allMalwareKilled,
      };
    });
  }, [addAction]);

  const fixRegistryKey = useCallback((id: string) => {
    setState(prev => {
      const key = prev.registryKeys.find(k => k.id === id);
      if (!key || !key.isCorrupted) return prev;
      const newKeys = prev.registryKeys.map(k => k.id === id ? { ...k, isCorrupted: false, value: k.correctValue } : k);
      const allFixed = !newKeys.some(k => k.isCorrupted);
      if (allFixed) addAction('fix_registry_keys');
      return { ...prev, registryKeys: newKeys, registryFixed: allFixed, systemHealth: Math.min(100, prev.systemHealth + 15) };
    });
  }, [addAction]);

  const startAntivirusScan = useCallback(() => {
    setState(prev => {
      if (prev.antivirusScanning || prev.antivirusComplete) return prev;
      return { ...prev, antivirusScanning: true, antivirusProgress: 0 };
    });
    let prog = 0;
    const interval = setInterval(() => {
      prog += 2;
      if (prog >= 100) {
        clearInterval(interval);
        setState(p => ({ ...p, antivirusScanning: false, antivirusProgress: 100, antivirusComplete: true }));
        addAction('run_antivirus_scan');
      } else {
        setState(p => ({ ...p, antivirusProgress: prog }));
      }
    }, 100);
  }, [addAction]);

  const removeThreats = useCallback(() => {
    setState(prev => ({
      ...prev,
      threatsRemoved: true,
      processes: prev.processes.filter(p => !p.isMalware),
      hasMalware: false,
      popups: [],
      cpuUsage: 15,
      ramUsage: 35,
      systemHealth: Math.min(100, prev.systemHealth + 30),
    }));
    addAction('remove_threats');
  }, [addAction]);

  const startSFCScan = useCallback(() => executeCommand('sfc /scannow'), [executeCommand]);
  const restartSystem = useCallback(() => executeCommand('shutdown /r'), [executeCommand]);
  const rollbackDriver = useCallback((name: string) => executeCommand(`rollback_driver ${name}`), [executeCommand]);

  const nextLevel = useCallback(() => {
    setState(prev => {
      const nextIdx = prev.currentLevel + 1;
      if (nextIdx >= levels.length) {
        // Check if all levels are completed
        const allLevelsCompleted = levels.every((_, idx) => prev.completedLevels.includes(idx));
        if (allLevelsCompleted) {
          return { ...prev, allLevelsComplete: true, showScore: false, levelComplete: false };
        } else {
          // Go back to level menu if not all completed
          return { ...prev, showScore: false, levelComplete: false };
        }
      }
      return { ...initLevel(levels[nextIdx], prev.completedLevels), currentLevel: nextIdx, totalScore: prev.totalScore, score: 0, zIndexCounter: prev.zIndexCounter, allLevelsComplete: false } as GameState;
    });
  }, []);

  const setLevel = useCallback((idx: number) => {
    setState(prev => ({
      ...initLevel(levels[idx], prev.completedLevels),
      currentLevel: idx,
      totalScore: prev.totalScore,
      score: 0,
      zIndexCounter: prev.zIndexCounter,
      allLevelsComplete: false,
    } as GameState));
  }, []);

  const showHint = useCallback(() => {
    setState(prev => {
      const level = levels[prev.currentLevel];
      if (prev.currentHint >= level.hints.length) return prev;
      return { ...prev, currentHint: prev.currentHint + 1, hintsUsed: prev.hintsUsed + 1 };
    });
  }, []);

  const toggleStartMenu = useCallback(() => {
    setState(prev => ({ ...prev, startMenuOpen: !prev.startMenuOpen }));
  }, []);

  const closePopup = useCallback((id: string) => {
    setState(prev => ({ ...prev, popups: prev.popups.filter(p => p.id !== id) }));
  }, []);

  const dismissNotification = useCallback(() => {
    setState(prev => ({ ...prev, notification: null }));
  }, []);

  const dismissBSOD = useCallback(() => {
    setState(prev => ({ ...prev, bsodVisible: false }));
  }, []);

  const viewLog = useCallback((logType: string) => {
    if (logType === 'system') addAction('view_system_log');
    if (logType === 'application') addAction('view_application_log');
    setState(prev => ({ ...prev, eventViewerLogViewed: logType }));
  }, [addAction]);

  const runDriverQuery = useCallback(() => {
    addAction('run_driverquery');
    setState(prev => ({ ...prev, driverQueryRun: true }));
  }, [addAction]);

  return (
    <GameContext.Provider value={{
      state, openWindow, closeWindow, minimizeWindow, maximizeWindow,
      bringToFront, restoreWindow, updateWindowPos, updateWindowSize,
      executeCommand, killProcess, fixRegistryKey,
      startAntivirusScan, removeThreats, startSFCScan, restartSystem,
      rollbackDriver, nextLevel, setLevel, showHint, toggleStartMenu, closePopup,
      dismissNotification, dismissBSOD, viewLog, runDriverQuery, addAction,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
