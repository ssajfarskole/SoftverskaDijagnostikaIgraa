import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ArrowLeft, ArrowRight, RefreshCw, Home, AlertTriangle, Lock, Shield } from 'lucide-react';

interface FakePage {
  title: string;
  url: string;
  isPhishing?: boolean;
  isMalicious?: boolean;
  isSafe?: boolean;
  content: React.ReactNode;
}

const fakeSites: Record<string, FakePage> = {
  'home': {
    title: 'Nova kartica',
    url: 'about:blank',
    isSafe: true,
    content: (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 gap-4">
        <div className="text-6xl">🌐</div>
        <div className="text-gray-400 text-sm">Nova kartica - odaberite stranicu za posjet</div>
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {[
            { label: '🏦 Banka', url: 'bank.secure-phish.xyz' },
            { label: '📧 Mail', url: 'mail.microsoft-security-alert.com' },
            { label: '🔒 KB Microsoft', url: 'support.microsoft.com/kb/4589208' },
            { label: '📰 Vijesti', url: 'hr.vijesti.net' },
          ].map(s => (
            <button key={s.url} className="px-3 py-2 bg-white rounded-lg shadow text-xs hover:bg-gray-50 text-gray-700 border border-gray-200">
              {s.label}
            </button>
          ))}
        </div>
      </div>
    ),
  },
  'phishing_bank': {
    title: 'Hrvatska Banka - Potvrda identiteta',
    url: 'https://bank.secure-phish.xyz/login',
    isPhishing: true,
    content: (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-black text-xl">HB</div>
            <div>
              <div className="font-bold text-gray-800">Hrvatska Banka d.d.</div>
              <div className="text-xs text-gray-500">Sigurna prijava</div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4 text-xs text-red-700">
            ⚠️ Vaš račun je privremeno blokiran zbog sumnjive aktivnosti!
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Korisničko ime / IBAN</label>
              <input className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Upišite korisničko ime..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Lozinka</label>
              <input type="password" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="Upišite lozinku..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">PIN kartice</label>
              <input type="password" maxLength={4} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-400" placeholder="4 znamenke PIN-a..." />
            </div>
            <button className="w-full py-2 bg-blue-700 text-white rounded-lg font-bold text-sm">Potvrdi identitet</button>
          </div>
          <div className="mt-3 text-[10px] text-gray-400 text-center">© 2024 Hrvatska Banka - Sva prava pridržana</div>
        </div>
      </div>
    ),
  },
  'phishing_ms': {
    title: 'Microsoft Security Alert — Action Required',
    url: 'https://mail.microsoft-security-alert.com/urgent',
    isPhishing: true,
    content: (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-red-600 text-white p-3 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="font-bold text-sm">⚡ HITNO: Vaš Windows je kompromitiran!</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 gap-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <div className="text-center max-w-xs">
            <h2 className="text-lg font-black text-red-800 mb-2">Vaše računalo je pod napadom!</h2>
            <p className="text-sm text-gray-600">Otkriveni smo <strong>5 virusa</strong> i <strong>3 trojanca</strong> na vašem uređaju. Hitno nazovite Microsoft podršku:</p>
            <p className="text-2xl font-black text-red-600 my-3">+1 (800) 555-0199</p>
            <p className="text-xs text-gray-500">Ne zatvarajte ovu stranicu! Vaši podaci su u opasnosti!</p>
          </div>
          <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg">
            Nazovi odmah za BESPLATNU pomoć
          </button>
        </div>
      </div>
    ),
  },
  'kb_article': {
    title: 'KB4589208 — Windows Update CRITICAL_PROCESS_DIED Fix',
    url: 'https://support.microsoft.com/kb/4589208',
    isSafe: true,
    content: (
      <div className="h-full overflow-auto bg-white p-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-gray-500 text-xs">Microsoft Support</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">KB4589208: Rješenje za CRITICAL_PROCESS_DIED</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
            <strong>Sažetak:</strong> Ažuriranje rješava problem koji uzrokuje BSOD s kodom CRITICAL_PROCESS_DIED (0x000000EF) na Windows 10/11 sustavima.
          </div>
          <h2 className="font-bold text-gray-800 mb-2">Simptomi</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-4">
            <li>Sustav prikazuje BSOD s kodom 0x000000EF</li>
            <li>Računalo se neočekivano restartira</li>
            <li>Sistemske datoteke mogu biti oštećene</li>
          </ul>
          <h2 className="font-bold text-gray-800 mb-2">Rješenje</h2>
          <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs mb-4">
            <div className="text-green-700">C:\&gt; sfc /scannow</div>
            <div className="text-gray-500 mt-1"># Pričekajte kraj skeniranja. Ako pronađe pogreške:</div>
            <div className="text-green-700">C:\&gt; DISM /Online /Cleanup-Image /RestoreHealth</div>
          </div>
          <p className="text-xs text-gray-500">Datum objave: 15. 3. 2024. | Verzija: 1.2 | Microsoft Corporation</p>
        </div>
      </div>
    ),
  },
  'malware_download': {
    title: 'Preuzmite BESPLATAN Antivirus!',
    url: 'http://free-antivirus-download.ru/download.php',
    isMalicious: true,
    content: (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-6 gap-4 text-white">
        <div className="text-5xl">🛡️</div>
        <h2 className="text-2xl font-black text-center">TotalShield PRO 2024</h2>
        <p className="text-center text-gray-300 text-sm">Najjači antivirus — <strong className="text-yellow-400">BESPLATNO</strong> za 24 sata!</p>
        <div className="flex flex-col items-center gap-2 bg-gray-700 rounded-xl p-4 w-full max-w-xs">
          <div className="text-green-400 text-sm font-bold">✓ Uklanja sve viruse</div>
          <div className="text-green-400 text-sm font-bold">✓ Štiti od ransomwarea</div>
          <div className="text-green-400 text-sm font-bold">✓ Bez registracije</div>
        </div>
        <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-lg shadow-lg animate-bounce">
          PREUZMI SADA (14.3 MB)
        </button>
        <p className="text-[10px] text-gray-500 text-center">Instalacijom prihvaćate naše uvjete. TotalShield d.o.o. nije odgovoran za eventualnu štetu.</p>
      </div>
    ),
  },
};

export const FakeBrowser: React.FC = () => {
  const { addAction } = useGame();
  const [currentPage, setCurrentPage] = useState<keyof typeof fakeSites>('home');
  const [urlBar, setUrlBar] = useState('');
  const [history, setHistory] = useState<(keyof typeof fakeSites)[]>(['home']);
  const [histIdx, setHistIdx] = useState(0);

  const page = fakeSites[currentPage];

  const navigate = (key: keyof typeof fakeSites) => {
    const newHist = [...history.slice(0, histIdx + 1), key];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
    setCurrentPage(key);
    setUrlBar(fakeSites[key].url);
    addAction('open_fakebrowser');
    if (fakeSites[key].isPhishing || fakeSites[key].isMalicious) {
      addAction('identify_phishing');
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = urlBar.toLowerCase();
    if (lower.includes('secure-phish') || lower.includes('banka')) navigate('phishing_bank');
    else if (lower.includes('microsoft-security-alert')) navigate('phishing_ms');
    else if (lower.includes('support.microsoft') || lower.includes('kb4589208')) navigate('kb_article');
    else if (lower.includes('free-antivirus') || lower.includes('antivirus')) navigate('malware_download');
    else navigate('home');
  };

  const goBack = () => {
    if (histIdx > 0) { const idx = histIdx - 1; setHistIdx(idx); setCurrentPage(history[idx]); setUrlBar(fakeSites[history[idx]].url); }
  };
  const goForward = () => {
    if (histIdx < history.length - 1) { const idx = histIdx + 1; setHistIdx(idx); setCurrentPage(history[idx]); setUrlBar(fakeSites[history[idx]].url); }
  };

  return (
    <div className="h-full flex flex-col text-xs bg-white">
      {/* Alatna traka */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-100 shrink-0">
        <button onClick={goBack} disabled={histIdx === 0} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30">
          <ArrowLeft size={14} />
        </button>
        <button onClick={goForward} disabled={histIdx >= history.length - 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30">
          <ArrowRight size={14} />
        </button>
        <button onClick={() => navigate(currentPage)} className="p-1.5 rounded hover:bg-gray-200">
          <RefreshCw size={14} />
        </button>
        <button onClick={() => navigate('home')} className="p-1.5 rounded hover:bg-gray-200">
          <Home size={14} />
        </button>

        {/* URL traka */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-1 bg-white border rounded-full px-2 py-1">
          {page.isPhishing || page.isMalicious ? (
            <AlertTriangle size={12} className="text-red-500 shrink-0" />
          ) : page.isSafe ? (
            <Lock size={12} className="text-green-600 shrink-0" />
          ) : (
            <Shield size={12} className="text-gray-400 shrink-0" />
          )}
          <input
            type="text"
            value={urlBar || page.url}
            onChange={e => setUrlBar(e.target.value)}
            className="flex-1 outline-none text-xs bg-transparent"
          />
        </form>
      </div>

      {/* Sigurnosno upozorenje */}
      {(page.isPhishing || page.isMalicious) && (
        <div className="shrink-0 bg-red-600 text-white px-3 py-2 flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          <div>
            <div className="font-bold text-xs">⚠️ PHISHING UPOZORENJE!</div>
            <div className="text-[10px] text-red-100">Ova stranica može biti lažna. Nemojte unositi osobne podatke!</div>
          </div>
        </div>
      )}

      {/* Sadržaj */}
      <div className="flex-1 overflow-hidden">
        {page.content}
      </div>

      {/* Brze veze */}
      <div className="border-t border-gray-200 px-2 py-1.5 bg-gray-50 flex gap-1 flex-wrap shrink-0">
        <span className="text-gray-400 text-[10px] self-center mr-1">Brzi pristup:</span>
        <button onClick={() => navigate('kb_article')} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] hover:bg-blue-200 font-medium">📄 KB Članak</button>
        <button onClick={() => navigate('phishing_bank')} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] hover:bg-red-200 font-medium">⚠ Phishing banka</button>
        <button onClick={() => navigate('phishing_ms')} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] hover:bg-orange-200 font-medium">⚠ Lažni Microsoft</button>
        <button onClick={() => navigate('malware_download')} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] hover:bg-red-200 font-medium">☠ Malware stranica</button>
      </div>
    </div>
  );
};
