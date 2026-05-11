import React from 'react';
import { levels } from '../gameData';
import { useGame } from '../GameContext';

const priorityColors: Record<string, string> = {
  'Kritičan': 'bg-red-100 text-red-700 border border-red-300',
  'Visok':    'bg-orange-100 text-orange-700 border border-orange-300',
  'Srednji':  'bg-yellow-100 text-yellow-700 border border-yellow-300',
  'Nizak':    'bg-green-100 text-green-700 border border-green-300',
};

export const LevelMenu: React.FC = () => {
  const { state, setLevel, closeWindow } = useGame();
  const win = state.openWindows.find(w => w.type === 'levelmenu');

  return (
    <div className="h-full flex flex-col bg-white text-sm">
      {/* Zaglavlje */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 shrink-0">
        <div className="text-white font-semibold text-sm">Odaberite razinu zadatka</div>
        <div className="text-blue-200 text-xs mt-0.5">
          Ukupno {levels.length} razina | Trenutna: {state.currentLevel + 1} | Ukupno bodova: {state.totalScore.toLocaleString()}
        </div>
      </div>

      {/* Lista levela */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {levels.map((lvl, idx) => {
          const isCurrent = state.currentLevel === idx;
          const isCompleted = state.completedLevels.includes(idx) || (idx === state.currentLevel && state.levelComplete);
          return (
            <button
              key={lvl.id}
              className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all group ${
                isCurrent
                  ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                  : isCompleted
                  ? 'bg-green-50 border-green-300 hover:bg-green-100'
                  : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
              onClick={() => {
                setLevel(idx);
                if (win) closeWindow(win.id);
              }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCurrent ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-xs truncate ${isCurrent ? 'text-blue-800' : 'text-gray-800'}`}>
                      {lvl.title}
                    </span>
                    {isCurrent && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full shrink-0">AKTIVNO</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[lvl.priority]}`}>
                      {lvl.priority}
                    </span>
                    <span className="text-[9px] text-gray-400">{lvl.ticketNumber}</span>
                    <span className="text-[9px] text-gray-400">⏱ {Math.floor(lvl.maxTime / 60)}min</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Podnožje */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="text-xs text-gray-500 text-center">
          Dvostruki klik na ikone desktop-a za otvaranje alata
        </div>
      </div>
    </div>
  );
};
