import React, { useState } from 'react';
import { useGame } from '../GameContext';

type BIOSTab = 'main' | 'boot' | 'security' | 'advanced' | 'exit';

export const BIOSSetup: React.FC = () => {
  const { addAction } = useGame();

  const [tab, setTab] = useState<BIOSTab>('main');
  const [bootOrder, setBootOrder] = useState(['USB Flash Drive', 'Windows Boot Manager', 'CD/DVD Drive', 'Onboard NIC']);
  const [secureBoot, setSecureBoot] = useState(true);
  const [fastBoot, setFastBoot] = useState(true);
  const [vtEnabled, setVtEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  const [biosVersionChecked, setBiosVersionChecked] = useState(false);
  const [xmpEnabled, setXmpEnabled] = useState(false);
  const [tpmEnabled, setTpmEnabled] = useState(true);
  const [powerManagementConfigured, setPowerManagementConfigured] = useState(false);
  const [biosPassword, setBiosPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState(false);

  const moveBootItem = (idx: number, dir: 'up' | 'down') => {
    const newOrder = [...bootOrder];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]];
    setBootOrder(newOrder);
    addAction('open_bios');
    addAction('check_boot_order');
    if (newOrder[0] === 'USB Flash Drive') {
      addAction('enable_usb_boot');
    }
  };

  const handleSave = () => {
    addAction('open_bios');
    addAction('save_bios_settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const biosInfo = {
    'Verzija BIOS-a': 'F.35 (2024-01-15)',
    'BIOS proizvođač': 'American Megatrends Inc.',
    'Model MB': 'ASUS PRIME Z790-P WIFI',
    'Procesor': 'Intel Core i7-12700H @ 2.3 GHz',
    'RAM': '16384 MB (2 x 8192 MB) @ 3200 MHz',
    'Serijski broj MB': 'MB2024031512345',
    'Datum/Vrijeme': '15.03.2024  09:45:32',
    'Temp. procesora': '38°C',
    'Temp. matične ploče': '32°C',
    'Napon CPU': '1.024 V',
  };

  const bootItemIcon: Record<string, string> = {
    'USB Flash Drive': '🔌',
    'Windows Boot Manager': '🪟',
    'CD/DVD Drive': '💿',
    'Onboard NIC': '🌐',
    'Internal SSD': '💾',
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#001080', color: '#C0C0FF', fontFamily: 'monospace' }}>
      {/* BIOS zaglavlje */}
      <div style={{ background: '#0000AA', padding: '6px 12px', borderBottom: '1px solid #4040FF' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
            ASUS UEFI BIOS Utility — Advanced Mode F.35
          </span>
          <span style={{ color: '#AAAAFF', fontSize: 11 }}>
            15.03.2024  09:45:32 | CPU: 38°C
          </span>
        </div>
      </div>

      {/* Tabovi */}
      <div className="flex" style={{ background: '#000080', borderBottom: '2px solid #4040FF' }}>
        {([
          { key: 'main', label: 'Glavna' },
          { key: 'boot', label: 'Pokretanje' },
          { key: 'security', label: 'Sigurnost' },
          { key: 'advanced', label: 'Napredno' },
          { key: 'exit', label: 'Izlaz' },
        ] as { key: BIOSTab; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key === 'boot') addAction('check_boot_order');
            }}
            style={{
              padding: '4px 16px',
              fontSize: 11,
              background: tab === t.key ? '#0000FF' : 'transparent',
              color: tab === t.key ? '#FFFFFF' : '#AAAAFF',
              border: 'none',
              cursor: 'pointer',
              fontWeight: tab === t.key ? 'bold' : 'normal',
              fontFamily: 'monospace',
            }}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        {saved && (
          <div style={{ color: '#00FF00', fontSize: 11, padding: '4px 12px', fontWeight: 'bold' }}>
            ✓ PROMJENE SPREMLJENE!
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto" style={{ padding: 12 }}>
        {tab === 'main' && (
          <div>
            <div style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
              ════ INFORMACIJE O SUSTAVU ════
            </div>
            <div className="space-y-1">
              {Object.entries(biosInfo).map(([key, val]) => {
                const isVersionRow = key === 'Verzija BIOS-a';
                return (
                  <div
                    key={key}
                    className="flex"
                    style={{
                      fontSize: 11,
                      padding: '2px 0',
                      borderBottom: '1px solid #003399',
                      cursor: isVersionRow ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (isVersionRow) {
                        addAction('find_bios_version');
                        setBiosVersionChecked(true);
                      }
                    }}
                  >
                    <span style={{ width: 200, color: '#AAAAFF' }}>{key}:</span>
                    <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
            {!biosVersionChecked && (
              <div className="text-green-200 text-[10px] mt-2">
                Kliknite na vrijednost <strong>Verzija BIOS-a</strong> da provjerite firmware.
              </div>
            )}
            {biosVersionChecked && (
              <div className="mt-3 p-3 rounded-lg border border-blue-400 bg-blue-950/80" style={{ fontSize: 11 }}>
                <div className="text-blue-200 font-bold mb-1">SMBIOS BIOS verzija provjerena</div>
                <div className="text-white">F.35</div>
                <div className="text-xs text-gray-400 mt-1">Ovo je verzija BIOS-a koja omogućuje provjeru da li je firmware star i kompatibilan s USB bootanjem.</div>
              </div>
            )}
          </div>
        )}

        {tab === 'boot' && (
          <div>
            <div style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
              ════ REDOSLIJED POKRETANJA ════
            </div>
            <div style={{ fontSize: 10, color: '#AAAAFF', marginBottom: 8 }}>
              Koristite tipke [↑] [↓] za promjenu redoslijeda pokretanja
            </div>
            <div className="space-y-1 mb-4">
              {bootOrder.map((item, i) => (
                <div key={item} style={{
                  padding: '6px 8px',
                  background: i === 0 ? '#003300' : '#000050',
                  border: i === 0 ? '1px solid #00AA00' : '1px solid #003399',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ color: '#FFFF00', fontWeight: 'bold', minWidth: 20 }}>{i + 1}.</span>
                  <span style={{ fontSize: 14 }}>{bootItemIcon[item] || '💾'}</span>
                  <span style={{ color: i === 0 ? '#00FF00' : '#C0C0FF', flex: 1, fontSize: 11, fontWeight: i === 0 ? 'bold' : 'normal' }}>
                    {item} {i === 0 ? '← AKTIVAN' : ''}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveBootItem(i, 'up')}
                      disabled={i === 0}
                      style={{
                        background: '#001880', color: '#AAAAFF', border: '1px solid #4040FF',
                        padding: '1px 6px', fontSize: 10, cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 1,
                        fontFamily: 'monospace',
                      }}
                    >↑</button>
                    <button
                      onClick={() => moveBootItem(i, 'down')}
                      disabled={i === bootOrder.length - 1}
                      style={{
                        background: '#001880', color: '#AAAAFF', border: '1px solid #4040FF',
                        padding: '1px 6px', fontSize: 10, cursor: i === bootOrder.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: i === bootOrder.length - 1 ? 0.3 : 1, fontFamily: 'monospace',
                      }}
                    >↓</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ color: '#FFFF00', fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Opcije pokretanja:</div>
            <div className="space-y-2">
              {[
                { label: 'Secure Boot', value: secureBoot, onChange: setSecureBoot, info: 'Zaštita od neovlaštenih bootloadera', warn: 'Isključite za USB boot s nepotpisanog medija' },
                { label: 'Fast Boot', value: fastBoot, onChange: setFastBoot, info: 'Preskoči POST testove za brže pokretanje' },
                { label: 'Boot Logo', value: true, onChange: () => {}, info: 'Prikaži logo pri pokretanju' },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between" style={{ padding: '4px 0', borderBottom: '1px solid #003399' }}>
                  <div>
                    <span style={{ color: '#C0C0FF', fontSize: 11 }}>{opt.label}</span>
                    <div style={{ color: '#666699', fontSize: 10 }}>{opt.info}</div>
                    {opt.warn && !opt.value && (
                      <div style={{ color: '#FF6600', fontSize: 10, marginTop: 2 }}>⚠ {opt.warn}</div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const nextValue = !opt.value;
                      opt.onChange(nextValue);
                      addAction('open_bios');
                      if (opt.label === 'Secure Boot' && !nextValue) {
                        addAction('disable_secure_boot');
                      }
                    }}
                    style={{
                      padding: '2px 12px',
                      background: opt.value ? '#005500' : '#550000',
                      color: opt.value ? '#00FF00' : '#FF4444',
                      border: opt.value ? '1px solid #00AA00' : '1px solid #AA0000',
                      fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
                      fontFamily: 'monospace',
                    }}
                  >
                    [{opt.value ? 'UKLJUČENO' : 'ISKLJUČENO'}]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div>
            <div style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
              ════ SIGURNOSNE POSTAVKE ════
            </div>
            <div className="space-y-3">
              {[
                { label: 'Secure Boot', value: secureBoot, onChange: setSecureBoot, info: 'Zaštita od neovlaštenih bootloadera (preporučeno: Uključeno)', warn: 'Isključivanje omogućuje pokretanje s nepotpisanog medija' },
                { label: 'TPM 2.0', value: tpmEnabled, onChange: setTpmEnabled, info: 'Trusted Platform Module — potrebno za BitLocker', warn: '' },
                { label: 'Lozinka za BIOS', value: biosPassword, onChange: setBiosPassword, info: 'Zahtijeva lozinku za ulaz u BIOS', warn: '' },
                { label: 'Lozinka administratora', value: adminPassword, onChange: setAdminPassword, info: 'Zahtijeva lozinku za promjenu postavki', warn: '' },
              ].map(opt => (
                <div key={opt.label} style={{ padding: '6px 8px', background: '#000050', border: '1px solid #003399', borderRadius: 4 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>{opt.label}</div>
                      <div style={{ color: '#888899', fontSize: 10, marginTop: 1 }}>{opt.info}</div>
                      {opt.warn && !opt.value && (
                        <div style={{ color: '#FF6600', fontSize: 10, marginTop: 1 }}>⚠ {opt.warn}</div>
                      )}
                    </div>
                    <button
                      onClick={() => { opt.onChange(!opt.value); addAction('open_bios'); }}
                      style={{
                        padding: '2px 12px',
                        background: opt.value ? '#005500' : '#550000',
                        color: opt.value ? '#00FF00' : '#FF4444',
                        border: opt.value ? '1px solid #00AA00' : '1px solid #AA0000',
                        fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
                        fontFamily: 'monospace',
                      }}
                    >
                      [{opt.value ? 'UKLJUČENO' : 'ISKLJUČENO'}]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'advanced' && (
          <div>
            <div style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
              ════ NAPREDNE POSTAVKE ════
            </div>
            <div className="space-y-2">
              {[
                { label: 'Intel VT-x (Virtualizacija)', value: vtEnabled, onChange: setVtEnabled, info: 'Hardverska podrška za virtualizaciju (Hyper-V, VMware, VirtualBox)' },
                { label: 'XMP Profile (RAM Overclock)', value: xmpEnabled, onChange: setXmpEnabled, info: 'Extreme Memory Profile — ubrzava RAM na 3200 MHz' },
                { label: 'Power Management', value: powerManagementConfigured, onChange: setPowerManagementConfigured, info: 'Omogućite automatsko upravljanje napajanjem i ventilatorima', warn: !powerManagementConfigured ? 'Treba konfigurirati radi stabilnosti i temperature' : '' },
              ].map(opt => (
                <div key={opt.label} style={{ padding: '6px 8px', background: '#000050', border: '1px solid #003399', borderRadius: 4 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ color: '#C0C0FF', fontSize: 11, fontWeight: 'bold' }}>{opt.label}</div>
                      <div style={{ color: '#666699', fontSize: 10, marginTop: 1 }}>{opt.info}</div>
                    </div>
                    <button
                      onClick={() => {
                        const nextValue = !opt.value;
                        opt.onChange(nextValue);
                        addAction('open_bios');
                        if (opt.label === 'Power Management' && nextValue) {
                          addAction('configure_bios_power');
                        }
                      }}
                      style={{
                        padding: '2px 12px',
                        background: opt.value ? '#005500' : '#550000',
                        color: opt.value ? '#00FF00' : '#FF4444',
                        border: opt.value ? '1px solid #00AA00' : '1px solid #AA0000',
                        fontSize: 11, fontWeight: 'bold', cursor: 'pointer',
                        fontFamily: 'monospace',
                      }}
                    >
                      [{opt.value ? 'UKLJUČENO' : 'ISKLJUČENO'}]
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ padding: '6px 8px', background: '#000050', border: '1px solid #003399', borderRadius: 4 }}>
                <div style={{ color: '#C0C0FF', fontSize: 11, fontWeight: 'bold' }}>Frekvencija procesora</div>
                <div style={{ color: '#666699', fontSize: 10 }}>Intel Core i7-12700H @ 2.3 GHz (max 4.7 GHz turbo)</div>
                <div style={{ color: '#00FF00', fontSize: 11, marginTop: 4 }}>Automatski (Preporučeno)</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'exit' && (
          <div>
            <div style={{ color: '#FFFF00', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
              ════ IZLAZ ════
            </div>
            <div className="space-y-2">
              {[
                { label: '[ F10 ] Spremi i izađi', action: handleSave, color: '#00FF00', bg: '#003300', border: '#00AA00' },
                { label: '[ ESC ] Izađi bez spremanja', action: () => {}, color: '#FF6666', bg: '#330000', border: '#AA0000' },
                { label: '[ F9 ] Učitaj zadane postavke', action: () => {
                  setSecureBoot(true); setFastBoot(true); setVtEnabled(true);
                  setXmpEnabled(false); setTpmEnabled(true); setBiosPassword(false);
                  addAction('reset_bios_settings');
                }, color: '#FFFF00', bg: '#333300', border: '#AAAA00' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    width: '100%', padding: '8px 16px',
                    background: btn.bg, color: btn.color,
                    border: `1px solid ${btn.border}`,
                    textAlign: 'left', fontSize: 12,
                    fontWeight: 'bold', cursor: 'pointer',
                    fontFamily: 'monospace', borderRadius: 4,
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {saved && (
              <div style={{ marginTop: 12, padding: 8, background: '#003300', border: '1px solid #00AA00', borderRadius: 4, color: '#00FF00', fontSize: 11, fontWeight: 'bold' }}>
                ✓ Postavke su uspješno spremljene! Sustav će se restartati.
              </div>
            )}
          </div>
        )}
      </div>

      {/* BIOS podnožje */}
      <div style={{ background: '#000080', padding: '3px 8px', borderTop: '1px solid #4040FF', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#AAAAFF' }}>
        <span>F1=Pomoć  F5/F6=Promijenji vrijednost  F9=Zadane  F10=Spremi i izađi  ESC=Izađi</span>
        <button
          onClick={handleSave}
          style={{ background: '#0000AA', color: '#FFFF00', border: '1px solid #4040FF', padding: '1px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold' }}
        >
          [F10] SPREMI
        </button>
      </div>
    </div>
  );
};
