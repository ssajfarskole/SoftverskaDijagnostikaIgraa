import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Mail, AlertTriangle, CheckCircle, Trash2, Archive, Reply, Star } from 'lucide-react';

interface Email {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  date: string;
  isPhishing: boolean;
  isRead: boolean;
  isStarred: boolean;
  body: string;
  attachments?: string[];
  indicators?: string[];
}

const emails: Email[] = [
  {
    id: 1,
    from: 'Hrvatska Banka',
    fromEmail: 'security@bank.secure-phish.xyz',
    subject: 'HITNO: Vaš račun je blokiran — potvrdite identitet',
    date: '15.03.2024 09:15',
    isPhishing: true,
    isRead: false,
    isStarred: false,
    attachments: ['potvrda_identiteta.exe'],
    indicators: [
      'Domena pošiljatelja nije legitimna (secure-phish.xyz)',
      'Privitak je .exe datoteka — OPASNO!',
      'Stvara osjećaj hitnosti i straha',
      'Traži klik na sumnjivi link',
      'Generički pozdrav umjesto vašeg imena',
    ],
    body: `Poštovani klijentu,

Primili smo obavijest da je vaš bankovni račun kompromitiran od strane neovlaštene treće strane.

Radi zaštite vaše financijske imovine, HITNO trebate potvrditi vaš identitet putem priloženog obrasca u roku od 24 sata.

Ako ne potvrdite identitet, vaš račun bit će trajno blokiran.

Kliknite ovdje za potvrdu: http://bank.secure-phish.xyz/confirm

S poštovanjem,
Tim za sigurnost
Hrvatska Banka

Napomena: Ova poruka poslana je automatski. Molimo ne odgovarajte na ovu e-poštu.`,
  },
  {
    id: 2,
    from: 'IT Odjel',
    fromEmail: 'it.support@nasatvrtka.hr',
    subject: 'Planirano održavanje servera — subota 2-4h',
    date: '15.03.2024 08:30',
    isPhishing: false,
    isRead: true,
    isStarred: false,
    body: `Poštovani korisnici,

Obavještavamo vas da će se planirano održavanje servera odvijati u subotu od 02:00 do 04:00 sati.

Za to vrijeme sustavi neće biti dostupni:
- Email sustav
- ERP sustav  
- Intranet portal

Isprike zbog eventualnih neugodnosti.

Srdačan pozdrav,
IT Odjel`,
  },
  {
    id: 3,
    from: 'Microsoft Security',
    fromEmail: 'alerts@microsoft-security-alert.com',
    subject: 'Your PC is infected! Call immediately!',
    date: '14.03.2024 16:45',
    isPhishing: true,
    isRead: false,
    isStarred: false,
    attachments: ['MICROSOFT_SECURITY_SCAN.exe'],
    indicators: [
      'Domena nije microsoftova (microsoft-security-alert.com)',
      'Privitak je .exe datoteka — OPASNO!',
      'Poruka na engleskom za hr. korisnika',
      'Lažno prikazuje sigurnosne prijetnje',
      'Traži hitno djelovanje i telefonski kontakt',
    ],
    body: `⚠️ WARNING: Your PC has been infected!

Our security systems have detected 5 critical viruses on your computer:
- Trojan:Win32/Emotet
- Ransomware:Win32/WannaCry
- Spyware:Win32/KeyLogger

Your personal data is at RISK. Call Microsoft Support immediately:
+1 (800) 555-0199

Or run the attached security scan tool NOW!

Microsoft Security Team`,
  },
  {
    id: 4,
    from: 'Marija Horvat',
    fromEmail: 'm.horvat@nasatvrtka.hr',
    subject: 'Prijedlog za tjedni sastanak',
    date: '14.03.2024 14:20',
    isPhishing: false,
    isRead: true,
    isStarred: true,
    body: `Bok,

Predlažem da organiziramo tjedni team meeting u petak u 10h.

Agenda:
1. Projekt status update
2. Q2 planovi
3. Razno

Molim potvrdu dostupnosti.

Lp,
Marija`,
  },
  {
    id: 5,
    from: 'FedEx Dostava',
    fromEmail: 'delivery@fedex-tracking-info.net',
    subject: 'Vaš paket čeka na preuzimanje — kliknite za plaćanje carine',
    date: '13.03.2024 11:30',
    isPhishing: true,
    isRead: false,
    isStarred: false,
    indicators: [
      'Nije od prave FedEx domene (fedex.com)',
      'Traži plaćanje bez narudžbe',
      'Lažni tracking broj',
      'Link vodi na nelegitimnu stranicu',
    ],
    body: `Poštovani,

Vaš paket s brojem praćenja HR948572948HR čeka na preuzimanju.

Radi oslobađanja paketa potrebno je platiti carinsku pristojbu u iznosu 15,00 EUR.

Plaćanje izvršite putem linka:
http://fedex-tracking-info.net/pay/HR948572948HR

Paket bit će vraćen pošiljatelju ako ne platite u roku 48 sati.

FedEx Croatia`,
  },
];

export const EmailClient: React.FC = () => {
  const { addAction } = useGame();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [readEmails, setReadEmails] = useState<Set<number>>(new Set([2, 4]));
  const [folder, setFolder] = useState<'inbox' | 'spam'>('inbox');
  const [showIndicators, setShowIndicators] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedId);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setReadEmails(prev => {
      const newRead = new Set([...prev, id]);
      if (newRead.size === emails.length) {
        addAction('read_all_emails');
      }
      return newRead;
    });
    setShowIndicators(false);
    addAction('open_email');
    const email = emails.find(e => e.id === id);
    if (email?.isPhishing) addAction('identify_phishing_email');
  };

  const phishingCount = emails.filter(e => e.isPhishing && !readEmails.has(e.id)).length;
  const unreadCount = emails.filter(e => !readEmails.has(e.id)).length;

  return (
    <div className="h-full flex flex-col text-xs bg-white">
      {/* Alatna traka */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex-1 flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700">
            <Mail size={10} /> Nova poruka
          </button>
          <button className="p-1 rounded hover:bg-gray-200 text-gray-500" title="Odgovori"><Reply size={12} /></button>
          <button className="p-1 rounded hover:bg-gray-200 text-gray-500" title="Obriši"><Trash2 size={12} /></button>
          <button className="p-1 rounded hover:bg-gray-200 text-gray-500" title="Arhiviraj"><Archive size={12} /></button>
        </div>
        {phishingCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-300 rounded text-red-700 font-bold text-[10px]">
            <AlertTriangle size={10} /> {phishingCount} phishing prijetnji!
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Bočna traka */}
        <div className="w-32 border-r border-gray-200 bg-gray-50 p-2 shrink-0 overflow-auto">
          <div className="space-y-0.5">
            {[
              { key: 'inbox' as const, label: 'Pristigla pošta', count: unreadCount },
              { key: 'spam' as const, label: 'Neželjeno', count: phishingCount },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFolder(f.key)}
                className={`w-full text-left px-2 py-1.5 rounded text-[10px] flex justify-between items-center transition-colors ${
                  folder === f.key ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span>{f.label}</span>
                {f.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${f.key === 'spam' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lista poruka */}
        <div className="w-48 border-r border-gray-200 overflow-auto bg-white shrink-0">
          {emails.map(email => (
            <div
              key={email.id}
              onClick={() => handleSelect(email.id)}
              className={`px-2 py-2 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedId === email.id ? 'bg-blue-50 border-l-2 border-l-blue-500' :
                email.isPhishing ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  {!readEmails.has(email.id) && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                  <span className={`font-semibold text-[10px] truncate ${email.isPhishing ? 'text-red-800' : 'text-gray-800'} ${!readEmails.has(email.id) ? 'font-bold' : ''}`}>
                    {email.isPhishing ? <><AlertTriangle className="inline w-3 h-3 text-red-500" /> </> : null}{email.from}
                  </span>
                </div>
                {email.isStarred && <Star size={10} className="text-yellow-500 shrink-0" />}
              </div>
              <div className={`text-[10px] truncate ${email.isPhishing ? 'text-red-700' : 'text-gray-600'}`}>{email.subject}</div>
              <div className="text-[9px] text-gray-400 mt-0.5">{email.date}</div>
              {email.attachments && (
                <div className="text-[9px] text-orange-600 mt-0.5 flex items-center gap-0.5">
                  📎 {email.attachments[0]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prikaz e-poruke */}
        <div className="flex-1 overflow-auto bg-white">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              {selectedEmail.isPhishing && (
                <div className="bg-red-600 text-white px-3 py-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <span className="font-bold text-[11px]">⚠ PHISHING SUMNJA! Ova poruka može biti prijevara.</span>
                  </div>
                  <button
                    onClick={() => setShowIndicators(!showIndicators)}
                    className="px-2 py-0.5 bg-red-700 rounded text-[10px] hover:bg-red-800"
                  >
                    {showIndicators ? 'Sakrij' : 'Prikaži'} pokazatelje
                  </button>
                </div>
              )}
              {showIndicators && selectedEmail.indicators && (
                <div className="bg-red-50 border-b border-red-200 px-3 py-2 shrink-0">
                  <div className="text-[10px] font-bold text-red-800 mb-1">🔍 Phishing pokazatelji:</div>
                  {selectedEmail.indicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-1 text-[10px] text-red-700 mb-0.5">
                      <span className="shrink-0">⚠</span> {ind}
                    </div>
                  ))}
                </div>
              )}
              {!selectedEmail.isPhishing && (
                <div className="bg-green-50 border-b border-green-200 px-3 py-1.5 flex items-center gap-2 shrink-0">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-[10px] text-green-700 font-medium">Poruka prošla sigurnosnu provjeru — legitimna e-pošta</span>
                </div>
              )}
              <div className="flex-1 overflow-auto p-4">
                <h2 className="font-bold text-sm text-gray-900 mb-3">{selectedEmail.subject}</h2>
                <div className="border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50 space-y-1">
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-gray-500 w-14">Od:</span>
                    <span className="font-medium text-gray-800">{selectedEmail.from}</span>
                    <span className={`font-mono ml-1 ${selectedEmail.isPhishing ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                      &lt;{selectedEmail.fromEmail}&gt;
                      {selectedEmail.isPhishing && ' ⚠'}
                    </span>
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-gray-500 w-14">Datum:</span>
                    <span className="text-gray-700">{selectedEmail.date}</span>
                  </div>
                  {selectedEmail.attachments && (
                    <div className="flex gap-2 text-[10px] items-center">
                      <span className="text-gray-500 w-14">Privitak:</span>
                      {selectedEmail.attachments.map(att => (
                        <span key={att} className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-300 rounded font-mono font-bold">
                          📎 {att} ⚠️
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed bg-white border border-gray-100 rounded-xl p-4">
                  {selectedEmail.body}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <Mail size={48} className="opacity-30" />
              <div className="text-sm font-medium">Odaberite poruku za pregled</div>
              <div className="text-xs text-center max-w-xs">Analizirajte pristigle e-poruke za phishing i sumnjive privitke</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
