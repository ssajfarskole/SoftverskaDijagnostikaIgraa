import React from 'react';

interface BSODProps {
  code: string;
  onDismiss: () => void;
}

export const BSOD: React.FC<BSODProps> = ({ code, onDismiss }) => {
  return (
    <div className="bsod-screen" onClick={onDismiss}>
      <div className="max-w-2xl w-full">
        <div className="text-8xl mb-8">:(</div>
        <h2 className="text-2xl font-semibold mb-6">
          Vaše računalo naišlo je na problem i mora se ponovo pokrenuti.<br />
          Prikupljamo informacije o pogrešci, a zatim ćemo ga ponovo pokrenuti umjesto vas.
        </h2>
        <div className="text-lg font-mono mb-8">
          {Math.floor(Math.random() * 20)}% završeno
        </div>
        <div className="text-sm opacity-80 mb-4">
          Za više informacija o ovoj pogrešci i mogućem popravku posjetite:
          <br />
          <span className="font-mono">https://www.windows.com/stopcode</span>
        </div>
        <div className="font-mono text-lg border-2 border-white/30 rounded p-4 mt-4">
          Stop Code: <strong>{code}</strong>
        </div>
        <div className="mt-8 text-sm opacity-60">
          [Kliknite bilo gdje za nastavak dijagnostike]
        </div>
      </div>
    </div>
  );
};

export const GlitchOverlay: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <div
    className="glitch-overlay"
    style={{ opacity: intensity * 0.06 }}
  />
);
