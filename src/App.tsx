import React from 'react';
import { GameProvider } from './GameContext';
import { Desktop } from './components/Desktop';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #050510 0%, #0a1628 40%, #0d1b3e 70%, #0f2050 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.06) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 text-center mb-2">
          <h1 className="text-white text-base font-bold tracking-widest" style={{ textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>
            DIJAGNOSTIČKI TEHNIČAR
          </h1>
          <p className="text-blue-300/50 text-[9px] tracking-widest uppercase">
            Simulator dijagnostike softvera — Tehnički laboratorij
          </p>
        </div>

        <div className="relative z-10" style={{ width: 'min(98vw, 1200px)', height: 'min(82vh, 760px)' }}>
          <div className="absolute inset-0 rounded-2xl" style={{
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #111 100%)',
            padding: '10px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)' }}>
              <Desktop />
              <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)',
              }} />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center mt-0">
          <div className="w-14 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-sm" />
          <div className="w-36 h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-14" style={{
          background: 'linear-gradient(180deg, rgba(20,14,10,0.7) 0%, rgba(12,8,5,0.9) 100%)',
          borderTop: '1px solid rgba(80,50,30,0.25)',
        }} />

        <div className="absolute bottom-2 left-0 right-0 text-center z-10">
          <p className="text-white/15 text-[8px] tracking-wider">
            Edukativni simulator dijagnostike • Sanja Šajfar™
          </p>
        </div>
      </div>
    </GameProvider>
  );
};

export default App;
