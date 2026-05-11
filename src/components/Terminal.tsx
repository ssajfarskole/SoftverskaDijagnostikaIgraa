import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../GameContext';

const SUGGESTIONS = [
  'chkdsk', 'cleanmgr', 'cls', 'driverquery', 'help',
  'ipconfig', 'ipconfig /flushdns', 'ipconfig /release', 'ipconfig /renew',
  'wmic bios get smbiosbiosversion', 'find bios version', 'check usb boot',
  'netstat', 'netstat -ano', 'ping 8.8.8.8', 'shutdown /r',
  'sfc /scannow', 'systeminfo', 'taskkill /PID ', 'tasklist',
];

export const Terminal: React.FC = () => {
  const { state, executeCommand } = useGame();
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [state.terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setCmdHistory(prev => [...prev, input]);
    setHistoryIdx(-1);
    setSuggestions([]);
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const idx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const idx = historyIdx + 1;
        if (idx >= cmdHistory.length) { setHistoryIdx(-1); setInput(''); }
        else { setHistoryIdx(idx); setInput(cmdHistory[idx]); }
        setSuggestions([]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleInputChange = (v: string) => {
    setInput(v);
    if (v.length > 1) {
      const lower = v.toLowerCase();
      const matches = SUGGESTIONS.filter(s => s.toLowerCase().startsWith(lower) && s !== v);
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="h-full flex flex-col terminal-font relative" style={{ background: '#0C0C0C', color: '#CCCCCC' }}>
      <div className="px-3 py-1.5 text-xs border-b border-gray-800" style={{ background: '#1A1A1A', color: '#888' }}>
        Microsoft Windows [Verzija 10.0.22621.0] - Naredbeni redak (Administrator)
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-2 space-y-2">
        <div className="text-gray-500 text-xs">Upišite <span className="text-green-400">help</span> za popis dostupnih naredbi.</div>

        {state.terminalHistory.map((entry, i) => (
          <div key={i} className="mb-1">
            <div className="flex flex-wrap">
              <span className="text-green-400 mr-1 shrink-0">C:\Windows\System32&gt;</span>
              <span className="text-white break-all">{entry.command}</span>
            </div>
            {entry.output && (
              <pre className={`whitespace-pre-wrap mt-1 text-xs leading-5 ${entry.isError ? 'text-red-400' : 'text-gray-300'}`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {state.sfcRunning && (
          <div className="mt-2">
            <div className="text-yellow-400 text-xs mb-1">Skeniranje sistemskih datoteka u tijeku...</div>
            <div className="w-full bg-gray-800 rounded h-3 overflow-hidden">
              <div className="h-full bg-green-500 progress-shimmer transition-all duration-300" style={{ width: `${state.sfcProgress}%` }} />
            </div>
            <div className="text-gray-500 text-xs mt-1">{state.sfcProgress}% završeno</div>
          </div>
        )}
        {state.sfcComplete && (
          <div className="text-green-400 text-xs">
            ✓ Windows Resource Protection pronašao je oštećene datoteke i uspješno ih popravio.
          </div>
        )}
      </div>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute bottom-10 left-0 right-0 bg-gray-900 border border-gray-700 rounded-sm mx-2">
          {suggestions.map(s => (
            <button
              key={s}
              className="block w-full text-left px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 font-mono"
              onMouseDown={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center px-3 py-2 border-t border-gray-800 shrink-0">
        <span className="text-green-400 mr-1 whitespace-nowrap text-xs">C:\Windows\System32&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white caret-white text-xs"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder="Upišite naredbu..."
        />
      </form>
    </div>
  );
};
