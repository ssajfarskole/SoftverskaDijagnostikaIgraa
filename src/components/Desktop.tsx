import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { desktopIcons, levels } from '../gameData';
import { Window } from './WindowManager';
import { BSOD, GlitchOverlay } from './BSOD';
import { Terminal } from './Terminal';
import { TaskManager } from './TaskManager';
import { EventViewer } from './EventViewer';
import { RegistryEditor } from './RegistryEditor';
import { AntivirusScanner } from './AntivirusScanner';
import { ResourceMonitor } from './ResourceMonitor';
import { TicketSystem } from './TicketSystem';
import { LevelMenu } from './LevelMenu';
import { FakeBrowser } from './FakeBrowser';
import { EmailClient } from './EmailClient';
import { USBTool } from './USBTool';
import { PrinterManager } from './PrinterManager';
import { CloudBackup } from './CloudBackup';
import { BIOSSetup } from './BIOSSetup';

const ThisPC: React.FC = () => (
  <div className="h-full overflow-auto p-4 bg-white text-xs">
    <div className="font-semibold text-gray-600 mb-3">Uređaji i pogoni</div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { name: 'Windows (C:)', icon: '💾', free: '12 GB slobodnih od 512 GB', color: 'blue' },
        { name: 'Podaci (D:)', icon: '💿', free: '145 GB slobodnih od 2 TB', color: 'green' },
        { name: 'Backup (E:)', icon: '🗄️', free: '234 GB slobodnih od 500 GB', color: 'purple' },
        { name: 'USB Drive (F:)', icon: '🔌', free: '16 GB slobodnih od 64 GB', color: 'orange' },
      ].map(drive => (
        <div key={drive.name} className={`p-3 bg-${drive.color}-50 border border-${drive.color}-200 rounded-xl`}>
          <div className="text-2xl mb-1">{drive.icon}</div>
          <div className="font-bold text-gray-800 text-[11px]">{drive.name}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">{drive.free}</div>
        </div>
      ))}
    </div>
    <div className="mt-4 font-semibold text-gray-600 mb-2">Mrežne lokacije</div>
    <div className="space-y-1">
      {['\\\\SERVER01\\Share', '\\\\NAS\\Backup', '\\\\FILESVR\\Projekti'].map(loc => (
        <div key={loc} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
          <span>🌐</span>
          <span className="font-mono text-[10px] text-gray-700">{loc}</span>
        </div>
      ))}
    </div>
  </div>
);

const getWindowContent = (type: string) => {
  switch (type) {
    case 'tickets':     return <TicketSystem />;
    case 'terminal':    return <Terminal />;
    case 'taskmanager': return <TaskManager />;
    case 'eventviewer': return <EventViewer />;
    case 'registry':    return <RegistryEditor />;
    case 'antivirus':   return <AntivirusScanner />;
    case 'resource':    return <ResourceMonitor />;
    case 'thispc':      return <ThisPC />;
    case 'fakebrowser': return <FakeBrowser />;
    case 'email':       return <EmailClient />;
    case 'usbtool':     return <USBTool />;
    case 'printer':     return <PrinterManager />;
    case 'cloudbackup': return <CloudBackup />;
    case 'bios':        return <BIOSSetup />;
    case 'levelmenu':   return <LevelMenu />;
    default:            return <div className="p-4 text-gray-500">Sadržaj nedostupan</div>;
  }
};

const priorityColors: Record<string, string> = {
  'Kritičan': 'bg-red-500',
  'Visok':    'bg-orange-500',
  'Srednji':  'bg-yellow-500',
  'Nizak':    'bg-green-500',
};

export const Desktop: React.FC = () => {
  const {
    state, openWindow, closeWindow, minimizeWindow, maximizeWindow,
    bringToFront, restoreWindow, updateWindowPos, updateWindowSize,
    nextLevel, closePopup, dismissNotification, dismissBSOD, toggleStartMenu,
  } = useGame();

  const level = levels[state.currentLevel];

  const [taskbarTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [taskbarDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  });

  const completedCount = level.requiredActions.filter(a => state.actions.includes(a)).length;
  const progressPct = Math.round((completedCount / level.requiredActions.length) * 100);

  // Icons arranged in column-first grid: core(8) left 2 cols, tools(4) middle 1-2 cols, extra(3) rightmost
  const coreIcons    = desktopIcons.filter(i => i.group === 'core');
  const toolsIcons   = desktopIcons.filter(i => i.group === 'tools');
  const extraIcons   = desktopIcons.filter(i => i.group === 'extra');

  const openTaskbarWindows = state.openWindows.filter(w => !w.minimized);
  const minimizedWindows = state.openWindows.filter(w => w.minimized);

  return (
    <div className="relative w-full h-full overflow-hidden desktop-wallpaper">
      {/* Glitch overlay when BSOD or malware */}
      {(state.isBSOD || (state.hasMalware && !state.malwareKilled)) && !state.levelComplete && (
        <GlitchOverlay intensity={state.hasMalware ? 0.7 : 1.5} />
      )}

      {/* BSOD */}
      {state.bsodVisible && !state.levelComplete && (
        <BSOD code={state.bsodCode} onDismiss={dismissBSOD} />
      )}

      {/* Notification */}
      {state.notification && (
        <div
          className="absolute top-4 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 max-w-xs cursor-pointer hover:shadow-xl"
          style={{ animation: 'notification-slide 0.4s ease-out' }}
          onClick={() => { openWindow('tickets'); dismissNotification(); }}
        >
          <div className="flex items-start gap-2">
            <div className="text-blue-500 text-lg shrink-0">🔔</div>
            <div className="flex-1">
              <div className="font-bold text-xs text-gray-800 mb-0.5">Novi zahtjev</div>
              <div className="text-[11px] text-gray-600 leading-snug">{state.notification}</div>
              <div className="text-[10px] text-blue-600 mt-2">Kliknite za otvaranje zahtjeva</div>
            </div>
            <button onClick={e => { e.stopPropagation(); dismissNotification(); }} className="text-gray-400 hover:text-gray-600 text-sm shrink-0">✕</button>
          </div>
        </div>
      )}

      {/* Popup windows (malware) */}
      {state.popups.map(popup => (
        <div
          key={popup.id}
          className="absolute bg-white border-2 border-red-400 rounded-lg shadow-2xl p-3 z-50 w-64"
          style={{ left: popup.x, top: popup.y, animation: 'fade-in 0.2s ease-out' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs text-red-700 truncate flex-1">{popup.title}</span>
            <button onClick={() => closePopup(popup.id)} className="text-gray-400 hover:text-red-500 text-sm shrink-0 ml-2">✕</button>
          </div>
          <p className="text-[11px] text-gray-700 mb-2 leading-snug">{popup.message}</p>
          <div className="flex gap-1">
            <button 
              onClick={() => { 
                if (popup.id === 'ransomware-popup') addAction('identify_ransomware_popup');
                closePopup(popup.id); 
              }} 
              className="flex-1 py-1 text-[10px] bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
            >
              OK
            </button>
            <button 
              onClick={() => { 
                if (popup.id === 'ransomware-popup') addAction('identify_ransomware_popup');
                closePopup(popup.id); 
              }} 
              className="flex-1 py-1 text-[10px] bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300"
            >
              Otkaži
            </button>
          </div>
        </div>
      ))}

      {/* Level complete overlay */}
      {state.levelComplete && state.showScore && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 text-center" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Odlično!</h2>
            <p className="text-sm text-gray-600 mb-4">{level.title}</p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="text-4xl font-black text-blue-700">{state.score.toLocaleString()}</div>
              <div className="text-xs text-blue-500 font-medium">bodova</div>
              <div className="text-xs text-gray-500 mt-1">
                Ukupno: <strong>{state.totalScore.toLocaleString()}</strong> bodova
              </div>
            </div>

            <div className="flex justify-around text-center mb-4 text-xs text-gray-600">
              <div>
                <div className="font-black text-lg text-gray-800">{String(Math.floor(state.timer / 60)).padStart(2, '0')}:{String(state.timer % 60).padStart(2, '0')}</div>
                <div>Vrijeme</div>
              </div>
              <div>
                <div className={`font-black text-lg ${state.wrongActions > 0 ? 'text-red-600' : 'text-green-600'}`}>{state.wrongActions}</div>
                <div>Pogrešnih akcija</div>
              </div>
              <div>
                <div className="font-black text-lg text-amber-600">{state.hintsUsed}</div>
                <div>Savjeta</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
              <div className="text-xs font-bold text-amber-800 mb-1">Pročitaj povratnu informaciju</div>
              <p className="text-[11px] text-amber-700 leading-relaxed">{level.educationalFeedback}</p>
            </div>

            <button
              onClick={nextLevel}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-colors text-sm"
            >
              {state.currentLevel < levels.length - 1 ? `Sljedeća razina →` : '🏆 Završi igru!'}
            </button>
          </div>
        </div>
      )}

      {/* All levels complete */}
      {state.allLevelsComplete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Čestitamo!</h2>
            <p className="text-gray-600 mb-4">Uspješno ste završili sve razine!</p>
            <div className="text-5xl font-black text-blue-700 mb-1">{state.totalScore.toLocaleString()}</div>
            <div className="text-blue-500 text-sm mb-6">ukupno bodova</div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Igraj ponovo
            </button>
          </div>
        </div>
      )}

      {/* Desktop icon grid — Windows column-first layout */}
      <div
        className="absolute top-3 left-3 flex gap-3"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {/* Core icons — 2 columns, 4 rows */}
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(2, 56px)', gridAutoFlow: 'column', gridTemplateRows: 'repeat(4, 70px)', pointerEvents: 'all' }}>
          {coreIcons.map(icon => (
            <div
              key={icon.id}
              className="icon-hover flex flex-col items-center justify-center gap-1 p-1 w-14"
              style={{ height: 68, cursor: 'pointer' }}
              onDoubleClick={() => openWindow(icon.windowType)}
            >
              <span className="text-2xl leading-none">{icon.emoji}</span>
              <span className="text-white text-[10px] text-center leading-tight text-shadow font-medium max-w-full">
                {icon.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tools icons — 1 column */}
        <div className="grid gap-1" style={{ gridTemplateColumns: '56px', gridAutoFlow: 'column', gridTemplateRows: 'repeat(4, 70px)', pointerEvents: 'all' }}>
          {toolsIcons.map(icon => (
            <div
              key={icon.id}
              className="icon-hover flex flex-col items-center justify-center gap-1 p-1 w-14"
              style={{ height: 68, cursor: 'pointer' }}
              onDoubleClick={() => openWindow(icon.windowType)}
            >
              <span className="text-2xl leading-none">{icon.emoji}</span>
              <span className="text-white text-[10px] text-center leading-tight text-shadow font-medium max-w-full">
                {icon.label}
              </span>
            </div>
          ))}
        </div>

        {/* Extra icons — 1 column */}
        <div className="grid gap-1" style={{ gridTemplateColumns: '56px', gridAutoFlow: 'column', gridTemplateRows: 'repeat(4, 70px)', pointerEvents: 'all' }}>
          {extraIcons.map(icon => (
            <div
              key={icon.id}
              className="icon-hover flex flex-col items-center justify-center gap-1 p-1 w-14"
              style={{ height: 68, cursor: 'pointer' }}
              onDoubleClick={() => openWindow(icon.windowType)}
            >
              <span className="text-2xl leading-none">{icon.emoji}</span>
              <span className="text-white text-[10px] text-center leading-tight text-shadow font-medium max-w-full">
                {icon.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress panel — top right */}
      <div
        className="absolute top-3 right-3 rounded-2xl p-3 z-10"
        style={{
          background: 'rgba(10,20,50,0.82)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: 220,
        }}
      >
        {/* Level header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-white font-black text-xs leading-tight">{level.title}</div>
            <div className="text-blue-300/70 text-[9px]">{level.ticketNumber}</div>
          </div>
          <div className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${priorityColors[level.priority]} text-white`}>
            {level.priority}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-300">Napredak</span>
            <span className={`font-bold ${progressPct === 100 ? 'text-green-400' : 'text-white'}`}>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-green-400' : 'progress-shimmer'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-[9px] text-gray-400 mt-0.5">{completedCount} / {level.requiredActions.length} zadataka</div>
        </div>

        {/* System health */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-300">Zdravlje sustava</span>
            <span className={`font-bold ${state.systemHealth > 60 ? 'text-green-400' : state.systemHealth > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
              {state.systemHealth}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${state.systemHealth > 60 ? 'bg-green-400' : state.systemHealth > 30 ? 'bg-yellow-400' : 'bg-red-500'}`}
              style={{ width: `${state.systemHealth}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          {[
            { label: 'CPU', v: state.cpuUsage },
            { label: 'RAM', v: state.ramUsage },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1">
              <span className="text-gray-400 text-[9px]">{s.label}</span>
              <div className="flex-1 bg-gray-700 rounded h-1 overflow-hidden">
                <div className={`h-full rounded ${s.v > 80 ? 'bg-red-500' : s.v > 50 ? 'bg-yellow-500' : 'bg-blue-400'}`} style={{ width: `${s.v}%` }} />
              </div>
              <span className={`text-[9px] font-bold ${s.v > 80 ? 'text-red-400' : 'text-gray-300'}`}>{s.v}%</span>
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="text-center border-t border-white/10 pt-1.5">
          <span className="text-[9px] text-gray-400">Ukupno bodova: </span>
          <span className="text-yellow-400 font-black text-xs">{state.totalScore.toLocaleString()}</span>
        </div>

        {/* Level selector button */}
        <button
          onClick={() => openWindow('levelmenu')}
          className="mt-2 w-full py-1.5 bg-blue-600/60 hover:bg-blue-600/90 text-white rounded-lg text-[10px] font-bold transition-colors border border-blue-500/30"
        >
          📌 Izbornik levela ({state.currentLevel + 1}/{levels.length})
        </button>
      </div>

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Windows */}
      {state.openWindows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          type={win.type}
          title={win.title}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          minimized={win.minimized}
          maximized={win.maximized}
          zIndex={win.zIndex}
        >
          {getWindowContent(win.type)}
        </Window>
      ))}

      {/* Taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 taskbar-glass flex items-center px-2 gap-1 no-select z-40"
        style={{ height: 44 }}
      >
        {/* Start button */}
        <button
          onClick={toggleStartMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors font-bold text-white text-xs"
        >
          <span className="text-lg">🪟</span>
          <span className="hidden sm:block">Start</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Open windows on taskbar */}
        <div className="flex gap-1 flex-1 overflow-hidden">
          {state.openWindows.map(win => (
            <button
              key={win.id}
              onClick={() => win.minimized ? restoreWindow(win.id) : minimizeWindow(win.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors whitespace-nowrap max-w-[120px] ${
                win.minimized
                  ? 'text-gray-400 hover:bg-white/10 border border-transparent'
                  : 'text-white bg-white/10 border border-white/10'
              }`}
              title={win.title}
            >
              <span className="truncate">{win.title}</span>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* System tray */}
        <div className="flex items-center gap-2 text-white/70 text-[10px]">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
            <span className="text-[12px]">📶</span>
            <span className="text-white">Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
            <span className="text-[12px]">⚙️</span>
            <span className="text-white">Sustav</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-white font-bold text-xs">{taskbarTime}</span>
            <span className="text-white/60 text-[9px]">{taskbarDate}</span>
          </div>
        </div>
      </div>

      {/* Start Menu */}
      {state.startMenuOpen && (
        <div
          className="absolute bottom-12 left-2 bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-3 z-50 w-56"
          style={{ animation: 'slide-up 0.2s ease-out' }}
        >
          <div className="text-white text-xs font-bold mb-2 px-1">Programi</div>
          <div className="space-y-0.5">
            {desktopIcons.map(icon => (
              <button
                key={icon.id}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 text-white text-[11px] transition-colors text-left"
                onClick={() => openWindow(icon.windowType)}
              >
                <span className="text-base shrink-0">{icon.emoji}</span>
                <span className="truncate">{icon.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
