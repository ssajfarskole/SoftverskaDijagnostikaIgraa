export interface ProcessData {
  name: string;
  pid: number;
  cpu: number;
  memory: number;
  status: string;
  isMalware: boolean;
  description: string;
}

export interface EventLogData {
  id: number;
  level: 'Pogreška' | 'Upozorenje' | 'Informacija';
  source: string;
  eventId: number;
  message: string;
  timestamp: string;
}

export interface RegistryKeyData {
  id: string;
  path: string;
  name: string;
  value: string;
  type: string;
  isCorrupted: boolean;
  correctValue: string;
}

export interface GameLevel {
  id: number;
  title: string;
  ticketNumber: string;
  client: string;
  priority: 'Kritičan' | 'Visok' | 'Srednji' | 'Nizak';
  description: string;
  symptoms: string[];
  requiredActions: string[];
  hints: string[];
  educationalFeedback: string;
  maxTime: number;
  initialState: {
    systemHealth: number;
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
    networkUsage: number;
    hasBSOD: boolean;
    bsodCode: string;
    hasMalware: boolean;
    hasRegistryCorruption: boolean;
    hasDriverConflict: boolean;
    processes: ProcessData[];
    eventLogs: EventLogData[];
    registryKeys: RegistryKeyData[];
  };
}

export interface DesktopIcon {
  id: string;
  label: string;
  emoji: string;
  windowType: string;
  group: 'core' | 'tools' | 'extra';
}

export const desktopIcons: DesktopIcon[] = [
  { id: 'tickets',    label: 'Sustav zahtjeva', emoji: '🎫', windowType: 'tickets',    group: 'core' },
  { id: 'terminal',   label: 'Naredbeni redak',  emoji: '⌨️', windowType: 'terminal',   group: 'core' },
  { id: 'taskmanager',label: 'Upravitelj zadataka',    emoji: '⚙️', windowType: 'taskmanager',group: 'core' },
  { id: 'eventviewer',label: 'Preglednik događaja',   emoji: '📋', windowType: 'eventviewer',group: 'core' },
  { id: 'registry',   label: 'Uređivač registra',emoji: '🔑', windowType: 'registry',   group: 'core' },
  { id: 'antivirus',  label: 'Antivirus',         emoji: '🛡️', windowType: 'antivirus',  group: 'core' },
  { id: 'resource',   label: 'Nadzor resursa',    emoji: '📊', windowType: 'resource',   group: 'core' },
  { id: 'thispc',     label: 'Ovo računalo',      emoji: '🖥️', windowType: 'thispc',     group: 'core' },
  { id: 'fakebrowser',label: 'Web preglednik',    emoji: '🌐', windowType: 'fakebrowser',group: 'tools' },
  { id: 'email',      label: 'E-pošta',           emoji: '📧', windowType: 'email',      group: 'tools' },
  { id: 'usbtool',    label: 'USB alat',          emoji: '🔌', windowType: 'usbtool',    group: 'tools' },
  { id: 'printer',    label: 'Upravljanje pisačem',emoji: '🖨️', windowType: 'printer',    group: 'tools' },
  { id: 'terminal',   label: 'Naredbeni redak',    emoji: '⌨', windowType: 'terminal',   group: 'core' },
  { id: 'cloudbackup',label: 'Cloud sigurnosna kopija',emoji: '☁️', windowType: 'cloudbackup',group: 'extra' },
  { id: 'bios',       label: 'BIOS/UEFI',         emoji: '🔧', windowType: 'bios',       group: 'extra' },
  { id: 'levelmenu',  label: 'Izbor levela',      emoji: '🚀', windowType: 'levelmenu',  group: 'extra' },
];

const baseProcesses: ProcessData[] = [
  { name: 'System',           pid: 4,    cpu: 0,  memory: 0.1, status: 'Pokrenut', isMalware: false, description: 'Windows kernel' },
  { name: 'svchost.exe',      pid: 892,  cpu: 1,  memory: 1.2, status: 'Pokrenut', isMalware: false, description: 'Host proces za Windows usluge' },
  { name: 'explorer.exe',     pid: 3204, cpu: 0,  memory: 2.1, status: 'Pokrenut', isMalware: false, description: 'Windows Explorer' },
  { name: 'lsass.exe',        pid: 868,  cpu: 0,  memory: 0.8, status: 'Pokrenut', isMalware: false, description: 'Lokalni sigurnosni autoritet' },
  { name: 'dwm.exe',          pid: 1024, cpu: 1,  memory: 1.5, status: 'Pokrenut', isMalware: false, description: 'Desktop Window Manager' },
  { name: 'winlogon.exe',     pid: 548,  cpu: 0,  memory: 0.5, status: 'Pokrenut', isMalware: false, description: 'Windows Logon' },
  { name: 'MsMpEng.exe',      pid: 2048, cpu: 1,  memory: 3.2, status: 'Pokrenut', isMalware: false, description: 'Windows Defender' },
  { name: 'chrome.exe',       pid: 4567, cpu: 2,  memory: 8.5, status: 'Pokrenut', isMalware: false, description: 'Google Chrome' },
  { name: 'RuntimeBroker.exe',pid: 3892, cpu: 0,  memory: 0.9, status: 'Pokrenut', isMalware: false, description: 'Runtime Broker' },
];

export const levels: GameLevel[] = [
  {
    id: 1,
    title: 'Plavi ekran smrti (BSOD)',
    ticketNumber: 'ZAH-2024-001',
    client: 'Odjel marketinga',
    priority: 'Kritičan',
    description: 'Naša glavna radna stanica neprestano se ruši s plavim ekranom. Ne možemo raditi dok se sustav ne restartira i ne provjeri stanje datoteka. Što ću sad? Zašto se računalo ruši?',
    symptoms: [
      'Sustav se ruši s BSOD-om svakih nekoliko minuta - strašno!',
      'Kod pogreške: CRITICAL_PROCESS_DIED - što to znači?',
      'Stop kod: 0x000000EF - kako da shvatim te kodove?',
      'Sustav postaje neaktivan prije rušenja - zašto se koči?',
    ],
    requiredActions: ['open_eventviewer', 'view_system_log', 'open_terminal', 'run_sfc_scannow', 'system_restart'],
    hints: [
      'Provjerite sistemske dnevnike u Pregledniku događaja za detalje o pogrešci.',
      'Pogreška spominje kritični proces - sistemske datoteke mogu biti oštećene.',
      'Otvorite Naredbeni redak i pokrenite System File Checker (sfc /scannow), a zatim restartajte sustav.',
    ],
    educationalFeedback: 'BSOD s kodom CRITICAL_PROCESS_DIED označava da je kritični sistemski proces prekinut. System File Checker (sfc /scannow) skenira i obnavlja oštećene sistemske datoteke. Nakon popravka, restart računala zatvara zadnju petlju greške.',
    maxTime: 300,
    initialState: {
      systemHealth: 20, cpuUsage: 85, ramUsage: 70, diskUsage: 45, networkUsage: 20,
      hasBSOD: true, bsodCode: 'CRITICAL_PROCESS_DIED (0x000000EF)',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška', source: 'BugCheck', eventId: 1001, message: 'Računalo se ponovno pokrenulo nakon bugchecka. Bugcheck: 0x000000ef. CRITICAL_PROCESS_DIED.', timestamp: '2024-03-15 09:23:45' },
        { id: 2, level: 'Pogreška', source: 'Service Control Manager', eventId: 7031, message: 'Usluga Windows Update neočekivano je prekinuta. Korektivna radnja: Ponovni pokretanje.', timestamp: '2024-03-15 09:23:40' },
        { id: 3, level: 'Pogreška', source: 'WER', eventId: 1001, message: 'Windows Resource Protection pronašao oštećene datoteke ali nije mogao popraviti neke. Detalji u CBS.log.', timestamp: '2024-03-15 09:22:15' },
        { id: 4, level: 'Upozorenje', source: 'Disk', eventId: 51, message: 'Otkrivena pogreška na uređaju \\Device\\Harddisk0\\DR0 tijekom operacije straniciranja.', timestamp: '2024-03-15 09:21:30' },
        { id: 5, level: 'Upozorenje', source: 'WHEA-Logger', eventId: 17, message: 'Došlo je do ispravljene hardverske pogreške. Komponenta: PCI Express Root Port.', timestamp: '2024-03-15 09:20:00' },
        { id: 6, level: 'Informacija', source: 'EventLog', eventId: 6005, message: 'Usluga dnevnika događaja je pokrenuta.', timestamp: '2024-03-15 09:19:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 2,
    title: 'Malware infekcija',
    ticketNumber: 'ZAH-2024-002',
    client: 'Odjel prodaje',
    priority: 'Visok',
    description: 'Naše računalo je izuzetno sporo i neprestano vidimo čudne pop-up prozore! Netko je jučer vjerojatno kliknuo na sumnjivi privitak. CPU je na 100% i sustav jedva reagira. Što se dogodilo? Zašto su ti pop-upovi?',
    symptoms: [
      'CPU opterećenje na 100% - zašto je tako sporo?',
      'Nasumični pop-up prozori - što su ti prozori?',
      'Sustav je vrlo spor - jedva mogu raditi!',
      'Nepoznati procesi u pozadini - što rade ti procesi?',
    ],
    requiredActions: ['open_taskmanager', 'kill_malware_process', 'run_antivirus_scan', 'remove_threats', 'open_email'],
    hints: [
      'Provjerite Upravitelj zadataka za procese koji koriste previše CPU-a.',
      'Potražite procese sa sumnjivim imenima (npr. svch0st.exe s nulom).',
      'Nakon gašenja procesa, pokrenite antivirusni sken.',
    ],
    educationalFeedback: 'Malware infekcije se manifestiraju kao visoko CPU opterećenje i neželjeni pop-upovi. Identificirajte i prekinite sumnjive procese u Upravitelju zadataka, zatim pokrenite antivirusni sken.',
    maxTime: 360,
    initialState: {
      systemHealth: 15, cpuUsage: 100, ramUsage: 92, diskUsage: 78, networkUsage: 65,
      hasBSOD: false, bsodCode: '',
      hasMalware: true, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [
        ...baseProcesses,
        { name: 'svch0st.exe',          pid: 6661, cpu: 32, memory: 15, status: 'Pokrenut', isMalware: true, description: 'Sumnjiv proces (kripto rudar)' },
        { name: 'crypto_miner.exe',      pid: 6662, cpu: 45, memory: 22, status: 'Pokrenut', isMalware: true, description: 'Nepoznata aplikacija' },
        { name: 'win_defender_fake.exe', pid: 6663, cpu: 12, memory: 9,  status: 'Pokrenut', isMalware: true, description: 'Lažni Windows Defender' },
        { name: 'popup_gen.exe',         pid: 6664, cpu: 8,  memory: 5,  status: 'Pokrenut', isMalware: true, description: 'Generator pop-up prozora' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Application Error',  eventId: 1000, message: 'Neispravna aplikacija: svch0st.exe, verzija 0.0.0.0. Kod iznimke: 0xc0000005.', timestamp: '2024-03-16 14:32:10' },
        { id: 2, level: 'Upozorenje',  source: 'Windows Defender',   eventId: 1015, message: 'Sumnjiva mrežna veza od crypto_miner.exe prema 185.234.xx.xx:4444.', timestamp: '2024-03-16 14:30:05' },
        { id: 3, level: 'Upozorenje',  source: 'Security',            eventId: 4688, message: 'Stvoren novi proces: popup_gen.exe. Roditelj: explorer.exe.', timestamp: '2024-03-16 14:28:30' },
        { id: 4, level: 'Pogreška',    source: 'Application Hang',   eventId: 1002, message: 'Program explorer.exe prestao komunicirati s Windowsima.', timestamp: '2024-03-16 14:25:00' },
        { id: 5, level: 'Upozorenje',  source: 'System',              eventId: 2004, message: 'Otkriveno iscrpljivanje resursa. RAM na 92%.', timestamp: '2024-03-16 14:22:15' },
        { id: 6, level: 'Informacija', source: 'EventLog',            eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-16 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 3,
    title: 'Oštećenje registra',
    ticketNumber: 'ZAH-2024-003',
    client: 'Odjel ljudskih resursa',
    priority: 'Srednji',
    description: 'Nekoliko programa se više ne može pokrenuti. Dobivamo poruke o pogreškama vezanim uz registar. Ovo je počelo nakon nestanka struje sinoć. Računalo se ne ponaša normalno - programi se ruše, Windows se sporo pokreće, a neki servisi ne rade kako treba. Što ću sad? Zašto se programi ne pokreću?',
    symptoms: [
      'Programi se ne mogu pokrenuti - što se dogodilo?',
      'Pogreške pristupa registru - što je registar?',
      'Startup programi se ne pokreću - zašto se ne pokreću automatski?',
      'Servisi se ne mogu pokrenuti - što su servisi?',
      'Windows se sporo pokreće - kako da ubrzam to?',
    ],
    requiredActions: ['open_eventviewer', 'view_application_log', 'open_registry', 'expand_registry_folders', 'fix_registry_keys', 'open_usbtool'],
    hints: [
      'Provjerite dnevnik aplikacija u Pregledniku događaja za detaljne greške.',
      'Otvorite Uređivač registra i raštrkajte foldere da pronađete oštećene ključeve.',
      'Potražite ključeve pod HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion i HKCU\\Software\\Microsoft\\Windows\\CurrentVersion.',
      'Popravite ključeve vraćanjem na ispravne vrijednosti - kliknite na naziv ključa da vidite vrijednost.',
      'Nakon popravka, restartajte računalo da se promjene primjene.',
    ],
    educationalFeedback: 'Windows registar je baza podataka za konfiguracijske postavke svih programa i Windows komponenti. Nestanak struje može uzrokovati nepotpuno pisanje i oštetiti ključeve. Uređivač registra (regedit) omogućuje pregled i popravak oštećenih ključeva, ali budite oprezni - pogrešne promjene mogu oštetiti sustav.',
    maxTime: 420,
    initialState: {
      systemHealth: 40, cpuUsage: 25, ramUsage: 45, diskUsage: 35, networkUsage: 15,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: true, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Application Error',     eventId: 1000, message: 'Program se ne može pokrenuti: HKLM\\SOFTWARE\\...\\Run oštećen.', timestamp: '2024-03-17 11:15:30' },
        { id: 2, level: 'Pogreška',    source: 'Service Control Manager',eventId: 7000, message: 'Windows Defender nije se uspio pokrenuti. Ključ registra za uslugu oštećen.', timestamp: '2024-03-17 11:14:20' },
        { id: 3, level: 'Pogreška',    source: 'Winlogon',               eventId: 6000, message: 'Ljuska se nije uspjela inicijalizirati. HKCU\\...\\Explorer ima nevažeće podatke.', timestamp: '2024-03-17 11:13:45' },
        { id: 4, level: 'Upozorenje',  source: 'User Profile Service',   eventId: 1530, message: 'Datoteka registra još uvijek se koristi. Neki ključevi možda nisu pravilno spremljeni.', timestamp: '2024-03-17 11:10:30' },
        { id: 5, level: 'Informacija', source: 'EventLog',               eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-17 11:00:00' },
      ],
      registryKeys: [
        { id: 'reg1', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', name: 'WindowsDefender', value: 'OSTECENI_PODACI_0x00', type: 'REG_SZ', isCorrupted: true, correctValue: '"C:\\Program Files\\Windows Defender\\MSASCuiL.exe"' },
        { id: 'reg2', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\WinDefend',   name: 'Start',           value: '0xFFFFFFFF', type: 'REG_DWORD', isCorrupted: true, correctValue: '0x00000002' },
        { id: 'reg3', path: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer', name: 'ShellState', value: '0xDEADBEEF', type: 'REG_BINARY', isCorrupted: true, correctValue: '0x2400000033810000' },
        { id: 'reg4', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon', name: 'Shell', value: '', type: 'REG_SZ', isCorrupted: true, correctValue: 'explorer.exe' },
        { id: 'reg5', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', name: 'OneDrive', value: '"C:\\Users\\Admin\\AppData\\Local\\OneDrive\\OneDrive.exe"', type: 'REG_SZ', isCorrupted: false, correctValue: '"C:\\Users\\Admin\\AppData\\Local\\OneDrive\\OneDrive.exe"' },
      ],
    },
  },
  {
    id: 4,
    title: 'Sukob upravljačkih programa',
    ticketNumber: 'ZAH-2024-004',
    client: 'Dizajn studio',
    priority: 'Visok',
    description: 'Nakon nedavnog Windows ažuriranja, zvuk je prestao raditi i mrežna veza neprestano puca! Trebamo oboje za video konferencije. Računalo se čudno ponaša - zvukovi ne rade, internet se gubi svakih par minuta, a u Upravitelju uređaja vidim žute uskličnike. Što ću sad? Zašto nema zvuka i interneta?',
    symptoms: [
      'Nema audio izlaznog uređaja - zašto nema zvuka?',
      'Mrežna veza povremeno puca - zašto se gubi internet?',
      'Upravitelj uređaja prikazuje upozorenja - što znače žuti uskličnici?',
      'Zvuk se ne čuje ni u jednom programu - kako da popravim zvuk?',
      'Internet radi pa prestane - što je uzrok tome?',
    ],
    requiredActions: ['open_eventviewer', 'view_system_log', 'run_driverquery', 'identify_suspicious_driver', 'rollback_driver', 'open_printer'],
    hints: [
      'Provjerite sistemski dnevnik za pogreške vezane uz upravljačke programe.',
      'Problem je počeo nakon ažuriranja - upravljački program može biti uzrok.',
      'Pokrenite driverquery u terminalu za popis upravljačkih programa.',
      'Identificirajte upravljački program s verzijom 6.0.9999 kao sumnjiv prije vraćanja.',
      'Vratite Realtek Audio upravljački program na prethodnu verziju.',
    ],
    educationalFeedback: 'Upravljački programi (driveri) su softver koji omogućuje komunikaciju između operativnog sustava i hardvera. Windows Update može instalirati inkompatibilne drivere. Vraćanje na staru verziju je često najbrže rješenje, ali provjerite da li postoji službeno ažuriranje od proizvođača.',
    maxTime: 360,
    initialState: {
      systemHealth: 45, cpuUsage: 30, ramUsage: 55, diskUsage: 40, networkUsage: 10,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: true,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'AudioSrv',               eventId: 4001, message: 'Windows Audio nije se uspio pokrenuti. Upravljački program audio uređaja nedostupan.', timestamp: '2024-03-18 08:15:30' },
        { id: 2, level: 'Pogreška',    source: 'NDIS',                    eventId: 5023, message: 'Adapter Realtek PCIe GbE Family nije uspio inicijalizirati. Kod pogreške: 0xE000020B.', timestamp: '2024-03-18 08:14:00' },
        { id: 3, level: 'Upozorenje',  source: 'Windows Update',          eventId: 20,   message: 'Instalacija ažuriranja upravljačkog programa: Realtek Audio Driver 6.0.9999.2. Može biti potrebno ponovno pokretanje.', timestamp: '2024-03-17 23:45:00' },
        { id: 4, level: 'Upozorenje',  source: 'PnP',                     eventId: 219,  message: 'Upravljački program za uređaj HD Audio nije kompatibilan s trenutnom verzijom Windowsa.', timestamp: '2024-03-18 08:13:00' },
        { id: 5, level: 'Informacija', source: 'EventLog',                eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-18 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 5,
    title: 'Phishing napad putem e-pošte',
    ticketNumber: 'ZAH-2024-005',
    client: 'Računovodstvo',
    priority: 'Kritičan',
    description: 'Korisnik je primio e-poruku koja izgleda kao da je od naše banke. Kliknuo je na link i unio podatke. Sumnjamo na phishing napad! Računalo pokazuje neobičnu mrežnu aktivnost i korisnik se brine da su mu podaci ukradeni. Što ću sad? Jesu li podaci ukradeni?',
    symptoms: [
      'Sumnjiva e-pošta od naizgled legitimimnog pošiljatelja - je li stvarno od banke?',
      'Neovlaštena mrežna aktivnost - što se šalje van?',
      'Korisnik je unio osjetljive podatke - što ću sad?',
      'Neobični procesi u pozadini - što rade ti procesi?',
      'Računalo se sporije ponaša - zašto je sporije?',
    ],
    requiredActions: ['open_email', 'read_all_emails', 'identify_phishing_email', 'open_fakebrowser', 'run_antivirus_scan', 'remove_threats'],
    hints: [
      'Otvorite klijent e-pošte i pažljivo pregledajte sve poruke.',
      'Pročitajte sve e-poruke da identificirate phishing pokazatelje.',
      'Potražite poruku koja izgleda kao od banke ali ima sumnjive detalje.',
      'Otvorite preglednik i provjerlite URL koji je korisnik posjetio.',
      'Pokrenite antivirusni sken za provjeru infekcije.',
      'Uklonite sve otkrivene prijetnje.',
    ],
    educationalFeedback: 'Phishing je metoda krađe identiteta putem lažnih poruka. Uvijek provjerite pošiljatelja, URL-ove i tražene radnje. Legitimne institucije nikada ne traže lozinke putem e-pošte. Ako ste već unijeli podatke, odmah promijenite lozinke i kontaktirajte banku.',
    maxTime: 300,
    initialState: {
      systemHealth: 60, cpuUsage: 20, ramUsage: 35, diskUsage: 25, networkUsage: 45,
      hasBSOD: false, bsodCode: '',
      hasMalware: true, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [
        ...baseProcesses,
        { name: 'phish_keylogger.exe', pid: 8881, cpu: 5, memory: 3, status: 'Pokrenut', isMalware: true, description: 'Keylogger instaliran putem phishing linka' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Security',          eventId: 4688, message: 'Stvoren novi proces phish_keylogger.exe. Roditeljem označen chrome.exe.', timestamp: '2024-03-19 10:30:00' },
        { id: 2, level: 'Upozorenje',  source: 'Windows Defender',  eventId: 1116, message: 'Sumnjiva aktivnost otkrivena: mogući keylogger. Ručna provjera preporučena.', timestamp: '2024-03-19 10:31:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',           eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-19 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 6,
    title: 'USB uređaj ne radi',
    ticketNumber: 'ZAH-2024-006',
    client: 'Grafički dizajner',
    priority: 'Srednji',
    description: 'Moj USB flash drive se ne prepoznaje. Trebam hitno prenijeti datoteke za prezentaciju. Windows ne vidi uređaj.',
    symptoms: [
      'USB flash drive nije prepoznat',
      'Nema zvuka spajanja uređaja',
      'Uređaj se ne pojavljuje u Exploreru',
    ],
    requiredActions: ['open_usbtool', 'open_eventviewer', 'view_system_log', 'run_chkdsk', 'usb_device_restart'],
    hints: [
      'Otvorite USB alat za dijagnostiku spojenih uređaja.',
      'Provjerite sistemske dnevnike za greške USB kontrolera.',
      'Pokrenite provjeru diska i restartajte upravljački program.',
    ],
    educationalFeedback: 'USB problemi mogu biti uzrokovani lošim kontaktom, oštećenim upravljačkim programom ili hardverskim kvarom. Dijagnostika uključuje provjeru sistemskih dnevnika, test diska i reset upravljačkog programa.',
    maxTime: 240,
    initialState: {
      systemHealth: 70, cpuUsage: 10, ramUsage: 30, diskUsage: 20, networkUsage: 5,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'USBHUB',        eventId: 43,   message: 'USB uređaj priključen na port 3 nije prepoznat. Kod pogreške: 0x0000043.', timestamp: '2024-03-20 09:15:00' },
        { id: 2, level: 'Pogreška',    source: 'StorPort',      eventId: 129,  message: 'Zahtjev za resetiranje primljen za USB uređaj. Uređaj ne reagira.', timestamp: '2024-03-20 09:14:55' },
        { id: 3, level: 'Upozorenje',  source: 'WPD Framework', eventId: 10,   message: 'Prijenosni uređaj nije mogao biti pokrenut. Provjerlite upravljački program.', timestamp: '2024-03-20 09:14:50' },
        { id: 4, level: 'Informacija', source: 'EventLog',      eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-20 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 7,
    title: 'Pisač ne ispisuje',
    ticketNumber: 'ZAH-2024-007',
    client: 'Tajništvo',
    priority: 'Srednji',
    description: 'Pisač više ne ispisuje dokumente. Print Spooler ima zastoj. Moramo ispisati hitne ugovore. Dokumenti se šalju na pisač ali ništa se ne događa, a u redu čekanja vidimo zaglavljene dokumente. Što ću sad? Zašto pisač ne ispisuje?',
    symptoms: [
      'Dokumenti se ne ispisuju - što se događa?',
      'Print Spooler zastoj - što je to?',
      'Red čekanja pisača pun - zašto su zaglavljeni?',
      'Pisač pokazuje grešku - što znači greška?',
      'Dokumenti se ne brišu iz reda - kako da ih obrišem?',
    ],
    requiredActions: ['open_printer', 'view_printer_queue', 'clear_print_queue', 'restart_print_spooler', 'test_printer_print', 'open_eventviewer', 'view_system_log'],
    hints: [
      'Otvorite Upravljanje pisačem i provjerite red čekanja.',
      'Pogledajte što se nalazi u redu čekanja - možda su dokumenti zaglavljeni.',
      'Pokušajte obrisati sve dokumente iz reda čekanja.',
      'Restartajte Print Spooler uslugu da se resetira.',
      'Nakon restartanja usluge, pokušajte ispisati test dokument.',
      'Provjerite sistemski dnevnik za greške Print Spoolera.',
      'Nakon popravka, testirajte ispisivanje da se uvjerite da radi.',
    ],
    educationalFeedback: 'Print Spooler usluga upravlja redovima čekanja pisača. Zastoj se rješava pregledom događaja, brisanjem reda čekanja i ponovnim pokretanjem usluge. Redovito praznite red čekanja i provjeravajte status pisača.',
    maxTime: 240,
    initialState: {
      systemHealth: 65, cpuUsage: 15, ramUsage: 40, diskUsage: 30, networkUsage: 10,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Print Spooler', eventId: 7031, message: 'Print Spooler usluga se srušila. Zastoj u redu čekanja.', timestamp: '2024-03-21 10:00:00' },
        { id: 2, level: 'Upozorenje',  source: 'PrintService',  eventId: 834,  message: 'Dokument HP LaserJet - Ugovor.docx zaglavio u redu čekanja. Status: Pogreška.', timestamp: '2024-03-21 09:58:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',      eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-21 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 8,
    title: 'Ransomware napad',
    ticketNumber: 'ZAH-2024-008',
    client: 'Financijski odjel',
    priority: 'Kritičan',
    description: 'HITNO! Datoteke na serveru su šifrirane s .encrypted ekstenzijom! Korisnik je otvorio sumnjivi PDF i sada je sve zaključano. Prikazuje se poruka o otkupnini od 500$. Računalo je gotovo neupotrebljivo, datoteke su zaključane, a na desktopu je poruka o plaćanju. Što ću sad? Jesu li datoteke izgubljene zauvijek?',
    symptoms: [
      'Datoteke šifrirane (.encrypted ekstenzija) - što ću sad?',
      'Poruka o otkupnini na radnoj površini - trebam li platiti?',
      'Sumnjivi procesi aktivni - što rade ti procesi?',
      'Mrežni promet prema nepoznatim IP adresama - kome se šalje?',
      'Antivirus onemogućen - zašto ne radi antivirus?',
      'Datoteke se ne mogu otvoriti - jesu li izgubljene?',
    ],
    requiredActions: ['open_taskmanager', 'kill_malware_process', 'identify_ransomware_popup', 'run_antivirus_scan', 'remove_threats', 'open_cloudbackup', 'restore_backup'],
    hints: [
      'Prvo zaustavite širenje! Pronađite zlonamjerne procese u Upravitelju zadataka.',
      'Zaustavite procese: ransomware.exe, encrypt_svc.exe, c2_beacon.exe.',
      'Nakon zaustavljanja, pokrenite antivirusni sken.',
      'Uklonite sve otkrivene prijetnje.',
      'Provjerite Cloud Backup za obnavljanje datoteka.',
      'Obnovite podatke iz sigurnosne kopije.',
    ],
    educationalFeedback: 'Ransomware šifrira korisničke datoteke i traži otkupninu. Nikada ne plaćajte! Prevencija: redoviti backup, antivirus, edukacija korisnika o phishingu. Imajte backup na minimalno dva različita mjesta (3-2-1 pravilo).',
    maxTime: 400,
    initialState: {
      systemHealth: 5, cpuUsage: 90, ramUsage: 85, diskUsage: 90, networkUsage: 95,
      hasBSOD: false, bsodCode: '',
      hasMalware: true, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [
        ...baseProcesses,
        { name: 'ransomware.exe',   pid: 7771, cpu: 35, memory: 19, status: 'Pokrenut', isMalware: true, description: 'Šifriranje datoteka u tijeku' },
        { name: 'encrypt_svc.exe', pid: 7772, cpu: 40, memory: 25, status: 'Pokrenut', isMalware: true, description: 'Usluga šifriranja' },
        { name: 'c2_beacon.exe',   pid: 7773, cpu: 5,  memory: 3,  status: 'Pokrenut', isMalware: true, description: 'Command & Control komunikacija' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Security',      eventId: 4688, message: 'Stvoren novi proces: ransomware.exe. Roditelj: AcroRd32.exe (PDF čitač).', timestamp: '2024-03-25 15:30:00' },
        { id: 2, level: 'Pogreška',    source: 'Security',      eventId: 4688, message: 'Stvoren novi proces: encrypt_svc.exe. Masovni pristup datotekama na C: i D:.', timestamp: '2024-03-25 15:30:05' },
        { id: 3, level: 'Upozorenje',  source: 'Windows Defender', eventId: 1015, message: 'Sumnjiva mrežna veza: c2_beacon.exe komunicira s 91.215.85.33:8443.', timestamp: '2024-03-25 15:30:10' },
        { id: 4, level: 'Upozorenje',  source: 'File System',   eventId: 5000, message: '15,234 datoteka modificirano u 5 minuta. Ekstenzija .encrypted.', timestamp: '2024-03-25 15:35:00' },
        { id: 5, level: 'Informacija', source: 'EventLog',      eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-25 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 9,
    title: 'Cloud Backup obnavljanje',
    ticketNumber: 'ZAH-2024-009',
    client: 'Direktor prodaje',
    priority: 'Visok',
    description: 'Disk se pokvarilo i izgubili smo sve poslovne datoteke. Trebamo obnoviti podatke iz cloud backupa što prije. Računalo se ne može pokrenuti normalno, disk pokazuje greške, a važni dokumenti su nedostupni. Što ću sad? Jesu li datoteke izgubljene?',
    symptoms: [
      'Kritične poslovne datoteke nedostupne - gdje su nestale?',
      'Disk hardware failure - što ću sad?',
      'Podaci zadnji put sinkronizirani prekjučer - jesu li spremljeni?',
      'Računalo se sporo pokreće - zašto je sporo?',
      'Greške pri pristupu disku - što znače te greške?',
    ],
    requiredActions: ['open_cloudbackup', 'create_backup_copy', 'restore_backup', 'open_terminal', 'run_chkdsk'],
    hints: [
      'Otvorite Cloud Backup i provjerite dostupne točke obnavljanja.',
      'Napravite kopiju postojećih podataka prije obnavljanja.',
      'Obnovite podatke iz sigurnosne kopije.',
      'Pokrenite chkdsk za provjeru stanja diska.',
      'Provjerite da li su svi važni dokumenti vraćeni.',
    ],
    educationalFeedback: 'Redoviti cloud backup je ključna zaštita podataka. Uvijek imajte backup na minimalno dva različita mjesta (3-2-1 pravilo: 3 kopije, 2 medija, 1 izvan lokacije). Testirajte backup periodično da se uvjerite da radi.',
    maxTime: 300,
    initialState: {
      systemHealth: 30, cpuUsage: 20, ramUsage: 40, diskUsage: 95, networkUsage: 30,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Disk',      eventId: 11,   message: 'Upravljački program otkrio pogrešku na uređaju \\Device\\Harddisk0. Disk možda treba zamjenu.', timestamp: '2024-03-26 06:30:00' },
        { id: 2, level: 'Pogreška',    source: 'NTFS',      eventId: 55,   message: 'MFT (Master File Table) oštećena. Datoteke možda nisu dostupne.', timestamp: '2024-03-26 06:31:00' },
        { id: 3, level: 'Upozorenje',  source: 'VSS',       eventId: 8193, message: 'Volume Shadow Copy usluga nije uspjela kreirati kopiju. Stoga nema lokalne točke obnavljanja.', timestamp: '2024-03-26 06:35:00' },
        { id: 4, level: 'Informacija', source: 'EventLog',  eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-26 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 10,
    title: 'BIOS/UEFI konfiguracija',
    ticketNumber: 'ZAH-2024-010',
    client: 'IT administrator',
    priority: 'Visok',
    description: 'Novo računalo ne može se pokrenuti s USB-a. Trebamo konfigurirati BIOS za boot s eksternog medija i ažurirati firmware. Računalo se pokreće samo s internog diska, a trebamo instalirati Windows s USB sticka. Što ću sad? Kako da instaliram Windows ako se ne može pokrenuti s USB-a?',
    symptoms: [
      'Sustav se ne pokreće s USB medija - što ću sad?',
      'Secure Boot blokira pokretanje - što je to uopće?',
      'Boot prioritet nije ispravno postavljen - kako da promijenim to?',
      'USB uređaj se ne prepoznaje pri bootu - zašto ne vidi USB?',
      'BIOS pokazuje staru verziju firmwarea - trebam li ažurirati to?',
    ],
    requiredActions: ['open_bios', 'check_boot_order', 'disable_secure_boot', 'find_bios_version', 'enable_usb_boot', 'check_usb_boot', 'save_bios_settings', 'open_terminal', 'system_restart'],
    hints: [
      'Otvorite BIOS/UEFI postavke pritiskom na tipku tijekom pokretanja.',
      'Provjerite redoslijed boot uređaja - USB treba biti prvi.',
      'Onemogućite Secure Boot ako blokira USB pokretanje.',
      'Kliknite verziju BIOS-a da vidite točnu verziju firmwarea ili u terminal napišite find bios version / wmic bios get smbiosbiosversion.',
      'Koristite terminal naredbu za provjeru USB boot uređaja.',
      'Spremite promjene, a zatim restartajte računalo.',
      'Na kraju pokrenite shutdown /r za restart.',
    ],
    educationalFeedback: 'BIOS/UEFI je firmware koji pokreće hardver prije operativnog sustava. Boot redoslijed određuje koji uređaj se pokušava pokrenuti prvo. Secure Boot štiti od neovlaštenog bootloadera, ali može blokirati boot s USB-a.',
    maxTime: 300,
    initialState: {
      systemHealth: 55, cpuUsage: 5, ramUsage: 20, diskUsage: 15, networkUsage: 5,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'BootManager',    eventId: 100, message: 'Windows Boot Manager nije pronašao valjan boot uređaj. USB disk nije na listi prioriteta.', timestamp: '2024-03-27 08:00:00' },
        { id: 2, level: 'Upozorenje',  source: 'SecureBoot',     eventId: 4,   message: 'Secure Boot je blokirao pokretanje s nepotpisanog medija (USB bootloader).', timestamp: '2024-03-27 08:00:05' },
        { id: 3, level: 'Informacija', source: 'EventLog',       eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-27 08:30:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 11,
    title: 'BIOS reset i konfiguracija',
    ticketNumber: 'ZAH-2024-011',
    client: 'Korisnik ureda',
    priority: 'Srednji',
    description: 'Računalo se ponaša čudno nakon što je netko dirao postavke u BIOS-u. Ventilatori rade punom brzinom, računalo se sporo pokreće, a ponekad se i samo isključi. Trebamo vratiti BIOS na originalne postavke i provjeriti sve što je bitno za normalan rad. Što se dogodilo s računalom? Zašto se tako ponaša?',
    symptoms: [
      'Računalo se sporo pokreće - što je uzrok?',
      'BIOS postavke su promijenjene - tko je dirao to?',
      'Greške pri pokretanju sustava - što znače te greške?',
      'Hardware se ne prepoznaje ispravno - zašto ne vidi komponente?',
      'Ventilatori rade punom brzinom - hoće li se pregrijati?',
    ],
    requiredActions: ['open_bios', 'reset_bios_settings', 'find_bios_version', 'configure_bios_power', 'save_bios_settings', 'open_terminal'],
    hints: [
      'Otvorite BIOS postavke i pronađite opciju za reset na tvorničke postavke.',
      'Provjerite verziju BIOS firmwarea da vidite što imate - kliknite na verziju u BIOS-u ili upišite find bios version / wmic bios get smbiosbiosversion u terminalu.',
      'Konfigurirajte power management opcije da ventilatori ne rade punom brzinom.',
      'Postavite da se računalo automatski gasi ako se pregrije.',
      'Provjerite da su sve postavke za CPU i memoriju ispravne.',
      'Spremite promjene i restartajte.',
      'U terminalu provjerite da li su promjene primijenjene.',
      'Testirajte da li se računalo sada normalno ponaša.',
    ],
    educationalFeedback: 'BIOS/UEFI sadrži kritične postavke za hardver. Pogrešne postavke mogu uzrokovati probleme s performansama ili stabilnošću. Reset na tvorničke postavke često rješava probleme, ali provjerite da su sve važne opcije ispravno postavljene.',
    maxTime: 360,
    initialState: {
      systemHealth: 35, cpuUsage: 80, ramUsage: 75, diskUsage: 98, networkUsage: 10,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses,
        { name: 'OneDrive.exe',   pid: 5001, cpu: 15, memory: 12, status: 'Pokrenut', isMalware: false, description: 'Microsoft OneDrive - sinkronizacija' },
        { name: 'Teams.exe',      pid: 5002, cpu: 20, memory: 18, status: 'Pokrenut', isMalware: false, description: 'Microsoft Teams' },
        { name: 'Spotify.exe',    pid: 5003, cpu: 10, memory: 8,  status: 'Pokrenut', isMalware: false, description: 'Spotify' },
        { name: 'Discord.exe',    pid: 5004, cpu: 8,  memory: 7,  status: 'Pokrenut', isMalware: false, description: 'Discord' },
        { name: 'Dropbox.exe',    pid: 5005, cpu: 12, memory: 10, status: 'Pokrenut', isMalware: false, description: 'Dropbox sinkronizacija' },
      ],
      eventLogs: [
        { id: 1, level: 'Upozorenje',  source: 'Disk',      eventId: 129, message: 'Disk C: ima samo 2% slobodnog prostora. Performanse mogu biti smanjene.', timestamp: '2024-03-28 09:00:00' },
        { id: 2, level: 'Upozorenje',  source: 'DiagTrack', eventId: 5,   message: 'Startup procesi prekoračuju preporučeno trajanje. 47 programa na startupu.', timestamp: '2024-03-28 09:01:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',  eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-28 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 12,
    title: 'WiFi ne radi',
    ticketNumber: 'ZAH-2024-012',
    client: 'Student',
    priority: 'Srednji',
    description: 'Laptop se ne može spojiti na WiFi. Ostali uređaji rade normalno na istoj mreži. Laptop pokazuje da nema dostupnih WiFi mreža, iako ih ima puno uokolo. Što ću sad? Zašto ne vidi WiFi mreže?',
    symptoms: [
      'WiFi adapter ne vidi mreže - zašto ne vidi WiFi?',
      'Ikona WiFi prikazuje X - što znači taj X?',
      'Ostali uređaji rade - zašto samo moj laptop ne radi?',
      'Adapter se ne može omogućiti - kako da ga uključim?',
      'Mrežne postavke pokazuju greške - što znače te greške?',
    ],
    requiredActions: ['open_resource', 'check_network_adapter', 'open_terminal', 'run_ipconfig', 'run_ipconfig_release', 'run_ipconfig_renew', 'run_ping'],
    hints: [
      'Otvorite Nadzor resursa i provjerite status mrežnog adaptera.',
      'Kliknite na WiFi adapter da vidite detalje.',
      'Pokrenite ipconfig za provjeru mrežne konfiguracije.',
      'Osvježite IP adresu s ipconfig /release i /renew.',
      'Provjerite da li adapter ima ispravnu IP adresu nakon renew.',
      'Testirajte ping prema gatewayu da provjerite vezu.',
      'Provjerite da li adapter ima ispravnu IP adresu.',
    ],
    educationalFeedback: 'WiFi problemi mogu biti uzrokovani onemogućenim adapterom, zastarjelim driverima ili softverskim problemom. ipconfig /release i /renew osvježavaju IP konfiguraciju i mogu riješiti mnoge mrežne probleme.',
    maxTime: 300,
    initialState: {
      systemHealth: 50, cpuUsage: 10, ramUsage: 25, diskUsage: 10, networkUsage: 0,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: true,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'WLAN-AutoConfig', eventId: 10001, message: 'Adapter WiFi Link 9560 nije uspio asocirati se s mrežom. Moguća softverska pogreška.', timestamp: '2024-03-29 10:00:00' },
        { id: 2, level: 'Pogreška',    source: 'NDIS',            eventId: 5023,  message: 'WiFi adapter nije odgovorio na inicijalizacijski zahtjev u predviđenom roku.', timestamp: '2024-03-29 10:00:05' },
        { id: 3, level: 'Upozorenje',  source: 'NetworkProfile',  eventId: 10000, message: 'Mrežni profil "WLAN_Office" nije pronađen. Adapter možda nije pokrenut.', timestamp: '2024-03-29 10:00:10' },
        { id: 4, level: 'Informacija', source: 'EventLog',        eventId: 6005,  message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-29 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 13,
    title: 'Lažni sigurnosni alat',
    ticketNumber: 'ZAH-2024-013',
    client: 'Privatan korisnik',
    priority: 'Visok',
    description: 'Korisnik je preuzeo alat za zaštitu računala s neprovjerene web-stranice. Nakon pokretanja, sustav se steže i pojavljuju se upozorenja o prijetnjama.',
    symptoms: [
      'Nedavno preuzet nepoznat sigurnosni alat',
      'Antivirus prijavljuje prijetnje nakon pokretanja',
      'Novi nepoznati procesi aktivni',
    ],
    requiredActions: ['open_fakebrowser', 'run_antivirus_scan', 'remove_threats'],
    hints: [
      'Otvorite preglednik i pogledajte stranicu s koje je alat preuzet.',
      'Pokrenite antivirusni sken odmah.',
    ],
    educationalFeedback: 'Lažni alati za dešifriranje ransomwarea najčešće su sami malware. Uvijek preuzimajte softver samo s provjerenih, legitimnih izvora. Provjerlite SHA256 hash preuzete datoteke.',
    maxTime: 300,
    initialState: {
      systemHealth: 30, cpuUsage: 60, ramUsage: 50, diskUsage: 40, networkUsage: 10,
      hasBSOD: false, bsodCode: '',
      hasMalware: true, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses,
        { name: 'fake_decryptor.exe', pid: 9100, cpu: 25, memory: 12, status: 'Pokrenut', isMalware: true, description: 'Lažni alat za dešifriranje - malware' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Windows Defender', eventId: 1116, message: 'Otkrivena prijetnja: Trojan:Win32/FakeDecryptor. Datoteka: C:\\Users\\Admin\\Downloads\\decrypt_tool.exe', timestamp: '2024-03-30 11:00:00' },
        { id: 2, level: 'Upozorenje',  source: 'Security',         eventId: 4688, message: 'fake_decryptor.exe pokušava modificirati sistemske datoteke bez administratorskih prava.', timestamp: '2024-03-30 11:01:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',         eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-30 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 14,
    title: 'DHCP - nema IP adrese',
    ticketNumber: 'ZAH-2024-014',
    client: 'Učionica B',
    priority: 'Visok',
    description: 'Nijedno računalo u učionici ne može dobiti IP adresu! Sva prikazuju APIPA adrese (169.254.x.x). DHCP server nije dostupan.',
    symptoms: [
      'Računala dobivaju 169.254.x.x adrese',
      '"Identificiranje mreže..." poruka',
      'Nema interneta ni mrežnih resursa',
    ],
    requiredActions: ['open_terminal', 'run_ipconfig', 'run_ipconfig_release', 'run_ipconfig_renew', 'run_ping', 'run_systeminfo'],
    hints: [
      'Pokrenite ipconfig - 169.254.x.x znači da DHCP ne radi.',
      'Očistite trenutnu IP konfiguraciju s ipconfig /release i zatražite novu s ipconfig /renew.',
      'Pokrenite ping prema gatewayu.',
    ],
    educationalFeedback: 'APIPA (169.254.x.x) adrese automatski se dodjeljuju kad DHCP server nije dostupan. ipconfig /release i /renew forsiraju novi zahtjev za IP adresom.',
    maxTime: 300,
    initialState: {
      systemHealth: 55, cpuUsage: 10, ramUsage: 35, diskUsage: 25, networkUsage: 90,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Dhcp-Client',     eventId: 1002,  message: 'DHCP klijent nije uspio dobiti IP adresu. Nijedan DHCP poslužitelj nije dostupan.', timestamp: '2024-03-31 09:30:00' },
        { id: 2, level: 'Upozorenje',  source: 'NetworkProfile',  eventId: 10000, message: 'Dodijeljena APIPA adresa: 169.254.15.42. DHCP server nije pronađen.', timestamp: '2024-03-31 09:30:05' },
        { id: 3, level: 'Informacija', source: 'EventLog',        eventId: 6005,  message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-03-31 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 15,
    title: 'Oštećeni korisnički profil',
    ticketNumber: 'ZAH-2024-015',
    client: 'Direktor',
    priority: 'Kritičan',
    description: 'Direktor se prijavljuje s privremenim profilom! Sve postavke, dokumenti na desktopu i favoriti su nestali. Hitno trebamo povratiti profil.',
    symptoms: [
      'Prijava s privremenim profilom',
      'Desktop je prazan',
      'Svi korisnički podaci nedostupni',
    ],
    requiredActions: ['open_eventviewer', 'view_system_log', 'open_registry', 'fix_registry_keys'],
    hints: [
      'Provjerite sistemske dnevnike za grešku User Profile Service.',
      'U registru provjerite ProfileList ključ - postoji .bak unos.',
      'Popravite ProfileList ključ u registru.',
    ],
    educationalFeedback: 'Oštećenje korisničkog profila dogodi se kad Windows ne može pravilno učitati korisničke podatke. Rješava se uređivanjem ProfileList ključa u registru - uklanjanjem .bak ekstenzije i resetiranjem State vrijednosti.',
    maxTime: 420,
    initialState: {
      systemHealth: 35, cpuUsage: 20, ramUsage: 45, diskUsage: 50, networkUsage: 15,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: true, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'User Profile Service', eventId: 1511, message: 'Windows nije mogao pronaći lokalni profil DOMENA\\direktor. Prijavljen s privremenim profilom.', timestamp: '2024-04-01 09:15:00' },
        { id: 2, level: 'Pogreška',    source: 'User Profile Service', eventId: 1515, message: 'Privremeni profil stvoren za DOMENA\\direktor. Registar pokazuje C:\\Users\\direktor.bak.', timestamp: '2024-04-01 09:14:55' },
        { id: 3, level: 'Upozorenje',  source: 'Winlogon',             eventId: 6000, message: 'Korisnički profil nije mogao biti učitan. Provjerite ProfileList u registru.', timestamp: '2024-04-01 09:14:50' },
        { id: 4, level: 'Informacija', source: 'EventLog',             eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-04-01 08:00:00' },
      ],
      registryKeys: [
        { id: 'prof1', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\S-1-5-21-xxx-1001.bak', name: 'ProfileImagePath', value: 'C:\\Users\\direktor.bak', type: 'REG_SZ', isCorrupted: true, correctValue: 'C:\\Users\\direktor' },
        { id: 'prof2', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\S-1-5-21-xxx-1001.bak', name: 'State', value: '0x80000000', type: 'REG_DWORD', isCorrupted: true, correctValue: '0x00000000' },
        { id: 'prof3', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\S-1-5-21-xxx-1001.bak', name: 'RefCount', value: '0x00000005', type: 'REG_DWORD', isCorrupted: true, correctValue: '0x00000000' },
        { id: 'prof4', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList', name: 'ProfilesDirectory', value: 'C:\\Users', type: 'REG_SZ', isCorrupted: false, correctValue: 'C:\\Users' },
      ],
    },
  },
  {
    id: 16,
    title: 'DNS problemi - web stranice ne rade',
    ticketNumber: 'ZAH-2024-016',
    client: 'Marketing odjel',
    priority: 'Srednji',
    description: 'Ne možemo pristupiti web stranicama! Browser pokazuje "DNS_PROBE_FINISHED_NXDOMAIN" grešku. Internet radi (ping radi), ali se stranice ne učitavaju. Trebamo hitno pristupiti klijentskim stranicama. Što ću sad? Zašto se stranice ne učitavaju?',
    symptoms: [
      'Web stranice se ne učitavaju - što se događa?',
      'DNS greške u browseru - što je DNS?',
      'Ping radi normalno - zašto ping radi a stranice ne?',
      'Email radi - zašto samo web ne radi?',
      'Samo HTTP/HTTPS ne radi - što je uzrok tome?',
    ],
    requiredActions: ['open_terminal', 'run_ipconfig', 'run_ipconfig_flushdns', 'run_ping', 'run_systeminfo'],
    hints: [
      'Otvorite terminal i provjerite mrežnu konfiguraciju.',
      'Pokrenite ipconfig /all da vidite DNS poslužitelje.',
      'Očistite DNS predmemoriju s ipconfig /flushdns.',
      'Testirajte ping prema domeni.',
      'Provjerite systeminfo za mrežne detalje.',
    ],
    educationalFeedback: 'DNS (Domain Name System) pretvara imena domena u IP adrese. Kada DNS ne radi, browseri ne mogu pronaći web stranice. ipconfig /flushdns čisti predmemoriju, a /renew osvježava IP konfiguraciju.',
    maxTime: 360,
    initialState: {
      systemHealth: 40, cpuUsage: 25, ramUsage: 45, diskUsage: 35, networkUsage: 20,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses.filter(p => p.name !== 'svchost.exe'),
        { name: 'svchost.exe', pid: 892, cpu: 0, memory: 0.1, status: 'Ne reagira', isMalware: false, description: 'Host proces (RPCSS) - ne reagira' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Service Control Manager', eventId: 7001, message: 'Print Spooler ovisi o Remote Procedure Call koji nije uspio pokrenuti.', timestamp: '2024-04-02 10:30:00' },
        { id: 2, level: 'Pogreška',    source: 'Service Control Manager', eventId: 7001, message: 'Windows Audio ovisi o Windows Audio Endpoint Builder koji nije uspio.', timestamp: '2024-04-02 10:29:45' },
        { id: 3, level: 'Pogreška',    source: 'Service Control Manager', eventId: 7000, message: 'Remote Procedure Call nije uspio: Sistem ne može pronaći navedenu datoteku.', timestamp: '2024-04-02 10:29:00' },
        { id: 4, level: 'Upozorenje',  source: 'WER',                     eventId: 1001, message: 'Windows Resource Protection pronašao oštećene datoteke u rpcss.dll.', timestamp: '2024-04-02 10:28:00' },
        { id: 5, level: 'Informacija', source: 'EventLog',                eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-04-02 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 17,
    title: 'Mrežna sigurnost - firewall',
    ticketNumber: 'ZAH-2024-017',
    client: 'IT odjel',
    priority: 'Visok',
    description: 'Otkriveno je neovlašteno skeniranje mreže iz unutarnje mreže. Firewall dnevnici pokazuju sumnjiv promet prema vanjskim IP adresama.',
    symptoms: [
      'Sumnjiv mrežni promet prema van',
      'Firewall alarmi',
      'Neovlašteno skeniranje portova',
    ],
    requiredActions: ['open_taskmanager', 'open_terminal', 'run_netstat', 'run_antivirus_scan', 'remove_threats'],
    hints: [
      'Pokrenite netstat za popis aktivnih mrežnih veza.',
      'Potražite veze prema nepoznatim IP adresama.',
      'Identificirajte proces koji šalje promet.',
    ],
    educationalFeedback: 'Neovlašteni mrežni promet može biti znak botneta ili spywarea. netstat -ano pokazuje sve aktivne veze s PID-ovima procesa koji ih drže otvorenima.',
    maxTime: 360,
    initialState: {
      systemHealth: 45, cpuUsage: 35, ramUsage: 50, diskUsage: 30, networkUsage: 85,
      hasBSOD: false, bsodCode: '',
      hasMalware: true, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses,
        { name: 'portscanner.exe', pid: 9901, cpu: 15, memory: 8, status: 'Pokrenut', isMalware: true, description: 'Botnet port scanner' },
        { name: 'data_exfil.exe',  pid: 9902, cpu: 10, memory: 6, status: 'Pokrenut', isMalware: true, description: 'Podaci se šalju prema van' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'Windows Firewall', eventId: 2009, message: 'Otkriveno masovno skeniranje portova prema 192.168.1.x iz localnog procesa portscanner.exe.', timestamp: '2024-04-03 14:00:00' },
        { id: 2, level: 'Upozorenje',  source: 'IDS',              eventId: 100,  message: 'Sumnjiv promet prema 185.220.101.x:443 od data_exfil.exe. Moguća eksfiltracija podataka.', timestamp: '2024-04-03 14:01:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',         eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-04-03 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 18,
    title: 'Disk čišćenje i defragmentacija',
    ticketNumber: 'ZAH-2024-018',
    client: 'Ured uprave',
    priority: 'Nizak',
    description: 'Sustav je spor pri pokretanju programa. Disk je fragmentiran, puno privremenih datoteka. Korisnik želi optimizirati sustav.',
    symptoms: [
      'Programi se sporo učitavaju',
      'Puno privremenih datoteka',
      'Fragmentirani disk',
    ],
    requiredActions: ['open_terminal', 'run_disk_cleanup', 'open_resource', 'run_chkdsk'],
    hints: [
      'Pokrenite čišćenje diska za brisanje privremenih datoteka.',
      'Provjerlite stanje diska s chkdsk.',
    ],
    educationalFeedback: 'Redovito čišćenje diska i defragmentacija (za HDD) poboljšavaju performanse. SSD diskovi ne trebaju defragmentaciju ali se mogu optimizirati TRIM naredbom.',
    maxTime: 300,
    initialState: {
      systemHealth: 50, cpuUsage: 30, ramUsage: 55, diskUsage: 88, networkUsage: 5,
      hasBSOD: false, bsodCode: '',
      hasMalware: false, hasRegistryCorruption: false, hasDriverConflict: false,
      processes: [...baseProcesses],
      eventLogs: [
        { id: 1, level: 'Upozorenje',  source: 'Disk',      eventId: 129, message: 'Disk C: ima samo 12% slobodnog prostora. Performanse mogu biti smanjene.', timestamp: '2024-04-04 09:00:00' },
        { id: 2, level: 'Informacija', source: 'Defrag',    eventId: 258, message: 'Zadnja defragmentacija: 45 dana. Fragmentiranost: 34%. Preporuča se defragmentacija.', timestamp: '2024-04-04 09:01:00' },
        { id: 3, level: 'Informacija', source: 'EventLog',  eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-04-04 08:00:00' },
      ],
      registryKeys: [],
    },
  },
  {
    id: 19,
    title: 'Kompleksni napad - višestruke prijetnje',
    ticketNumber: 'ZAH-2024-019',
    client: 'Upravljački odbor',
    priority: 'Kritičan',
    description: 'Sustav prijavljuje višestruke pogreške prilikom pokretanja: BSOD, oštećenje registra i sumnjivi procesi. Potrebna je hitna analiza i popravak.',
    symptoms: [
      'BSOD tijekom pokretanja',
      'Sumnjivi procesi aktivni',
      'Registar oštećen',
      'Pokretanje sistema nije stabilno',
    ],    requiredActions: ['open_eventviewer', 'view_system_log', 'open_taskmanager', 'kill_malware_process', 'run_antivirus_scan', 'remove_threats', 'open_registry', 'fix_registry_keys', 'run_sfc_scannow'],
    hints: [
      'Pristupite sustavski - počnite s Preglednikom događaja za razumijevanje situacije.',
      'Paralelno rješavajte probleme - malware, registar i sistemske datoteke.',
    ],
    educationalFeedback: 'Složeni napadi zahtijevaju sustavski pristup: 1) Dijagnoza (Event Viewer), 2) Zaustavljanje prijetnji (Task Manager), 3) Čišćenje (Antivirus), 4) Popravak (Registry/SFC). Dokumentirajte svaki korak!',
    maxTime: 600,
    initialState: {
      systemHealth: 5, cpuUsage: 95, ramUsage: 90, diskUsage: 85, networkUsage: 70,
      hasBSOD: true, bsodCode: 'KERNEL_SECURITY_CHECK_FAILURE (0x00000139)',
      hasMalware: true, hasRegistryCorruption: true, hasDriverConflict: false,
      processes: [...baseProcesses,
        { name: 'combo_malware.exe', pid: 9999, cpu: 40, memory: 25, status: 'Pokrenut', isMalware: true, description: 'Kombinirani napad - malware' },
        { name: 'rootkit_srv.exe',   pid: 9998, cpu: 30, memory: 20, status: 'Pokrenut', isMalware: true, description: 'Rootkit usluga' },
      ],
      eventLogs: [
        { id: 1, level: 'Pogreška',    source: 'BugCheck',               eventId: 1001, message: 'BSOD: KERNEL_SECURITY_CHECK_FAILURE (0x00000139). Rootkit detektiran u kernel memoriji.', timestamp: '2024-04-05 07:30:00' },
        { id: 2, level: 'Pogreška',    source: 'Security',               eventId: 4688, message: 'Kritični procesi: combo_malware.exe i rootkit_srv.exe zaobišli UAC.', timestamp: '2024-04-05 07:30:05' },
        { id: 3, level: 'Pogreška',    source: 'Application Error',      eventId: 1000, message: 'Ključ registra HKLM\\SYSTEM oštećen od strane zlonamjernog softvera.', timestamp: '2024-04-05 07:30:10' },
        { id: 4, level: 'Upozorenje',  source: 'Windows Defender',       eventId: 1116, message: 'Otkriveno: Trojan:Win32/Rootkit, Ransomware:Win32/ComboAttack. Automatska zaštita zaobiđena.', timestamp: '2024-04-05 07:30:15' },
        { id: 5, level: 'Informacija', source: 'EventLog',               eventId: 6005, message: 'Usluga dnevnika događaja pokrenuta.', timestamp: '2024-04-05 07:00:00' },
      ],
      registryKeys: [
        { id: 'mal1', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\combo_malware', name: 'Start', value: '0x00000002', type: 'REG_DWORD', isCorrupted: true, correctValue: 'UKLONJEN' },
        { id: 'mal2', path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon', name: 'Shell', value: 'explorer.exe,combo_malware.exe', type: 'REG_SZ', isCorrupted: true, correctValue: 'explorer.exe' },
        { id: 'mal3', path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\WinDefend', name: 'Start', value: '0x00000004', type: 'REG_DWORD', isCorrupted: true, correctValue: '0x00000002' },
      ],
    },
  },
];

export const popupMessages = [
  { title: '!!! VAŠE DATOTEKE SU ŠIFRIRANE!!!', message: 'Svi vaši dokumenti, slike i datoteke su šifrirani!\n\nDa biste ih vratili, platite 500$ u Bitcoin na adresu:\n1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\n\nImate 72 sata da platite, inače će fajlovi biti trajno izgubljeni!\n\nNe pokušavajte resetirati računalo ili gasiti programe - to će uništiti vaše fajlove!' },
];
