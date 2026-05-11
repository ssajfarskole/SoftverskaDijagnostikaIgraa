import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { ChevronRight, ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';

const registryTree = [
  {
    name: 'HKEY_LOCAL_MACHINE',
    path: 'HKLM',
    children: [
      {
        name: 'SOFTWARE',
        path: 'HKLM\\SOFTWARE',
        children: [
          {
            name: 'Microsoft',
            path: 'HKLM\\SOFTWARE\\Microsoft',
            children: [
              {
                name: 'Windows NT',
                path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT',
                children: [
                  {
                    name: 'CurrentVersion',
                    path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion',
                    children: [
                      { name: 'Winlogon', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' },
                      { name: 'AppInit_DLLs', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AppInit_DLLs' },
                      { name: 'Image File Execution Options', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'SYSTEM',
        path: 'HKLM\\SYSTEM',
        children: [
          {
            name: 'CurrentControlSet',
            path: 'HKLM\\SYSTEM\\CurrentControlSet',
            children: [
              {
                name: 'Services',
                path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services',
                children: [
                  { name: 'WinDefend', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\WinDefend' },
                  { name: 'AudioSrv', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\AudioSrv' },
                  { name: 'USBSTOR', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\USBSTOR' },
                ],
              },
              { name: 'Control', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Control' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'HKEY_CURRENT_USER',
    path: 'HKCU',
    children: [
      {
        name: 'Software',
        path: 'HKCU\\Software',
        children: [
          {
            name: 'Microsoft',
            path: 'HKCU\\Software\\Microsoft',
            children: [
              {
                name: 'Windows',
                path: 'HKCU\\Software\\Microsoft\\Windows',
                children: [
                  {
                    name: 'CurrentVersion',
                    path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion',
                    children: [
                      { name: 'Explorer', path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer' },
                      { name: 'Policies', path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies' },
                    ],
                  },
                  {
                    name: 'Internet Settings',
                    path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
                  },
                ],
              },
            ],
          },
          {
            name: 'Policies',
            path: 'HKCU\\Software\\Policies',
            children: [
              { name: 'Microsoft', path: 'HKCU\\Software\\Policies\\Microsoft' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'HKEY_CLASSES_ROOT',
    path: 'HKCR',
    children: [
      { name: '.exe', path: 'HKCR\\.exe' },
      { name: 'CLSID', path: 'HKCR\\CLSID' },
    ],
  },
  { name: 'HKEY_USERS', path: 'HKU' },
  { name: 'HKEY_CURRENT_CONFIG', path: 'HKCC' },
];

export const RegistryEditor: React.FC = () => {
  const { state, fixRegistryKey, addAction } = useGame();
  const [expanded, setExpanded] = useState<string[]>(['HKEY_LOCAL_MACHINE']);
  const [selected, setSelected] = useState<string | null>(null);
  const [fixedKeys, setFixedKeys] = useState<Set<string>>(new Set());

  const corruptedKeys = state.registryKeys.filter(k => k.isCorrupted);
  const fixedCount = state.registryKeys.filter(k => !k.isCorrupted && fixedKeys.has(k.id)).length;

  const handleExpand = (path: string) => {
    setExpanded(prev => {
      if (prev.includes(path)) return prev;
      const newExpanded = [...prev, path];
      if (newExpanded.length >= 3) { // Require expanding at least 3 folders
        addAction('expand_registry_folders');
      }
      return newExpanded;
    });
  };

  const handleFix = (id: string) => {
    fixRegistryKey(id);
    setFixedKeys(prev => new Set([...prev, id]));
  };

  const filteredKeys = selected ? state.registryKeys.filter(k => k.path.startsWith(selected)) : [];

  return (
    <div className="h-full flex flex-col bg-white text-xs">
      {/* Adresna traka */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0">
        <span className="text-gray-500 font-medium">Adresa:</span>
        <span className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700">
          {selected || 'Odaberite folder s lijeve strane'}
        </span>
        {corruptedKeys.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 border border-red-300 rounded text-red-700 text-[10px] font-bold shrink-0">
            <AlertTriangle size={10} />
            {corruptedKeys.length} oštećenih ključeva
          </div>
        )}
        {corruptedKeys.length === 0 && state.registryKeys.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 border border-green-300 rounded text-green-700 text-[10px] font-bold shrink-0">
            <CheckCircle size={10} />
            Sve popravljeno
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Stablo */}
        <div className="w-44 border-r border-gray-200 overflow-auto bg-gray-50 p-1 shrink-0">
          {registryTree.map(node => {
            const renderNode = (item: any, depth = 0) => {
              const isExpanded = expanded.includes(item.path);
              const isSelected = selected === item.path;
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;

              return (
                <div key={item.path}>
                  <div
                    className={`flex items-center gap-1 px-1 py-1 rounded cursor-pointer select-none ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
                    style={{ paddingLeft: 8 + depth * 12 }}
                    onClick={() => {
                      setSelected(item.path);
                      if (hasChildren) {
                        handleExpand(item.path);
                      }
                    }}
                  >
                    {hasChildren ? (
                      isExpanded ? <ChevronDown size={12} className="shrink-0 text-gray-500" /> : <ChevronRight size={12} className="shrink-0 text-gray-500" />
                    ) : (
                      <span className="w-3" />
                    )}
                    <span className="text-yellow-700 font-bold shrink-0">📁</span>
                    <span className={`font-medium text-[10px] truncate ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>{item.name}</span>
                  </div>
                  {hasChildren && isExpanded && (
                    <div>
                      {item.children.map((child: any) => renderNode(child, depth + 1))}
                    </div>
                  )}
                </div>
              );
            };

            return renderNode(node);
          })}
        </div>

        {/* Sadržaj */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {filteredKeys.length > 0 ? (
            <>
              <div className="overflow-auto flex-1">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                    <tr>
                      <th className="text-left px-2 py-2 font-semibold text-gray-600">Naziv</th>
                      <th className="text-left px-2 py-2 font-semibold text-gray-600 w-20">Vrsta</th>
                      <th className="text-left px-2 py-2 font-semibold text-gray-600">Podaci</th>
                      <th className="text-left px-2 py-2 font-semibold text-gray-600 w-20">Stanje</th>
                      <th className="text-left px-2 py-2 font-semibold text-gray-600 w-24">Akcija</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys.map(key => (
                      <tr key={key.id} className={`border-b border-gray-100 ${key.isCorrupted ? 'bg-red-50' : 'bg-green-50'}`}>
                        <td className="px-2 py-2">
                          <div className="font-bold text-gray-800">{key.name}</div>
                          <div className="text-[10px] text-gray-400 truncate" style={{ maxWidth: 180 }}>{key.path}</div>
                        </td>
                        <td className="px-2 py-2 font-mono text-gray-500">{key.type}</td>
                        <td className="px-2 py-2">
                          <div className={`font-mono text-[10px] truncate ${key.isCorrupted ? 'text-red-700' : 'text-green-700'}`} style={{ maxWidth: 200 }}>
                            {key.value || '(prazno)'}
                          </div>
                          {key.isCorrupted && (
                            <div className="text-[10px] text-green-600 mt-0.5 truncate">
                              Ispravna vrijednost: <span className="font-mono">{key.correctValue}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${key.isCorrupted ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                            {key.isCorrupted ? 'Oštećeno' : '✓ Ispravno'}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          {key.isCorrupted ? (
                            <button
                              onClick={() => handleFix(key.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors"
                            >
                              Popravi
                            </button>
                          ) : (
                            <span className="text-green-600 text-[10px] font-semibold">✓ OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 px-3 py-1.5 bg-gray-50 shrink-0 flex justify-between">
                <span className="text-[10px] text-gray-500">{filteredKeys.length} ključeva prikazano</span>
                <span className="text-[10px] text-gray-500">Oštećenih: <strong className="text-red-600">{corruptedKeys.length}</strong> | Popravljenih: <strong className="text-green-600">{fixedKeys.size}</strong></span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <div className="text-4xl">🔑</div>
              <div className="text-sm font-medium">Odaberite folder s lijeve strane</div>
              <div className="text-xs">Kliknite na folder da vidite njegove ključeve</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
