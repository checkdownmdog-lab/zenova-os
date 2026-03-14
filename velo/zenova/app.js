/* ═══════════════ ZENOVA OS — APPLICATION LOGIC ═══════════════ */

// ── State ──
const state = {
    locked: true,
    windows: {},
    windowOrder: [],
    focusedWindow: null,
    windowIdCounter: 0,
    dockApps: new Set(),
    settings: {
        accent: '#7c3aed',
        darkMode: true,
        animations: true,
        animSpeed: 0.3,
        dockMagnify: true,
        dockPosition: 'bottom',
        wallpaper: 'default',
        blur: true,
        fontSize: 14,
    },
    installedApps: new Set(['brave','steam','discord','terminal','files','settings','store']),
    terminalHistory: [],
    terminalHistoryIdx: -1,
};

// ── Constants ──
const WALLPAPERS = [
    { id: 'default', name: 'Zenova Default', bg: "url('wallpaper.png') center/cover no-repeat, linear-gradient(135deg, #0a0a12, #1a1040, #0a2030)" },
    { id: 'nebula', name: 'Nebula', bg: 'linear-gradient(135deg, #0a0a12 0%, #2d1b69 30%, #1e3a5f 60%, #0a0a12 100%)' },
    { id: 'aurora', name: 'Aurora', bg: 'linear-gradient(135deg, #0a0a12 0%, #064e3b 40%, #1e1b4b 70%, #0a0a12 100%)' },
    { id: 'sunset', name: 'Sunset', bg: 'linear-gradient(135deg, #0a0a12 0%, #7f1d1d 35%, #4a044e 65%, #0a0a12 100%)' },
    { id: 'ocean', name: 'Ocean', bg: 'linear-gradient(135deg, #0a0a12 0%, #0c4a6e 40%, #164e63 70%, #0a0a12 100%)' },
    { id: 'midnight', name: 'Midnight', bg: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' },
];

const ACCENT_COLORS = [
    { id: 'purple', color: '#7c3aed', name: 'Violet' },
    { id: 'blue', color: '#2563eb', name: 'Blue' },
    { id: 'cyan', color: '#0891b2', name: 'Cyan' },
    { id: 'green', color: '#059669', name: 'Emerald' },
    { id: 'orange', color: '#ea580c', name: 'Orange' },
    { id: 'pink', color: '#db2777', name: 'Pink' },
    { id: 'red', color: '#dc2626', name: 'Red' },
    { id: 'teal', color: '#0d9488', name: 'Teal' },
];

const STORE_APPS = [
    { name: 'Lutris', desc: 'Open gaming platform for Linux', icon: '🎮', cat: 'gaming', color: '#f97316' },
    { name: 'Heroic Launcher', desc: 'Epic Games & GOG launcher', icon: '⚔️', cat: 'gaming', color: '#7c3aed' },
    { name: 'ProtonUp-Qt', desc: 'Manage Proton/Wine versions', icon: '🔧', cat: 'gaming', color: '#2563eb' },
    { name: 'CoreCtrl', desc: 'GPU overclocking & fan curves', icon: '🎛️', cat: 'gaming', color: '#dc2626' },
    { name: 'OBS Studio', desc: 'Streaming & recording software', icon: '📹', cat: 'media', color: '#1e1e2e' },
    { name: 'VLC', desc: 'Universal media player', icon: '🎬', cat: 'media', color: '#f97316' },
    { name: 'Spotify', desc: 'Music streaming service', icon: '🎵', cat: 'media', color: '#16a34a' },
    { name: 'Telegram', desc: 'Cloud-based messaging app', icon: '✈️', cat: 'social', color: '#0ea5e9' },
    { name: 'Slack', desc: 'Team communication platform', icon: '💬', cat: 'social', color: '#611f69' },
    { name: 'Element', desc: 'Matrix-based secure messaging', icon: '🔒', cat: 'social', color: '#0dbd8b' },
    { name: 'VS Code', desc: 'Powerful code editor by Microsoft', icon: '💻', cat: 'productivity', color: '#2563eb' },
    { name: 'LibreOffice', desc: 'Full office productivity suite', icon: '📄', cat: 'productivity', color: '#16a34a' },
    { name: 'GIMP', desc: 'Advanced image editor', icon: '🎨', cat: 'productivity', color: '#92400e' },
    { name: 'Blender', desc: '3D creation & animation suite', icon: '🧊', cat: 'productivity', color: '#ea580c' },
    { name: 'Firefox', desc: 'Open-source web browser', icon: '🦊', cat: 'browsers', color: '#ea580c' },
    { name: 'Chromium', desc: 'Open-source Chromium browser', icon: '🌐', cat: 'browsers', color: '#2563eb' },
    { name: 'Timeshift', desc: 'System backup & restore tool', icon: '⏰', cat: 'system', color: '#0891b2' },
    { name: 'GParted', desc: 'Partition editor', icon: '💾', cat: 'system', color: '#7c3aed' },
    { name: 'Flatseal', desc: 'Manage Flatpak permissions', icon: '🛡️', cat: 'system', color: '#4f46e5' },
    { name: 'Bottles', desc: 'Run Windows apps & games', icon: '🍾', cat: 'gaming', color: '#2563eb' },
    { name: 'Kdenlive', desc: 'Video editing software', icon: '🎞️', cat: 'media', color: '#1d4ed8' },
    { name: 'Audacity', desc: 'Audio recording & editing', icon: '🎤', cat: 'media', color: '#0369a1' },
    { name: 'qBittorrent', desc: 'Lightweight torrent client', icon: '📥', cat: 'system', color: '#2563eb' },
];

const ALL_APPS = [
    { name: 'Brave', icon: '🦁', color: '#ea580c', app: 'brave' },
    { name: 'Steam', icon: '🎮', color: '#1b2838', app: 'steam' },
    { name: 'Discord', icon: '💬', color: '#5865f2', app: 'discord' },
    { name: 'Terminal', icon: '⌨️', color: '#1a1a2e', app: 'terminal' },
    { name: 'Files', icon: '📁', color: '#2563eb', app: 'files' },
    { name: 'Settings', icon: '⚙️', color: '#404060', app: 'settings' },
    { name: 'Store', icon: '🛒', color: '#7c3aed', app: 'store' },
];

// ── Initialization ──
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupLockScreen();
    setupClock();
    setupDock();
    setupDesktopIcons();
    setupContextMenu();
    setupActivities();
    createLockParticles();
}

// ── Registration & Lock Screen ──
function setupLockScreen() {
    const regScreen = document.getElementById('registration-screen');
    const regForm = document.getElementById('reg-form');
    const lockScreen = document.getElementById('lock-screen');
    
    if (regScreen && regForm) {
        // Phone verification simulation
        const sendCodeBtn = document.getElementById('reg-send-code');
        const phoneInput = document.getElementById('reg-phone');
        const codeWrap = document.getElementById('reg-code-wrap');

        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', () => {
                if (phoneInput.value.trim().length > 5) {
                    sendCodeBtn.innerText = 'Sent!';
                    sendCodeBtn.style.background = 'rgba(34,197,94,0.2)';
                    sendCodeBtn.style.borderColor = 'var(--green)';
                    sendCodeBtn.style.color = 'var(--green)';
                    codeWrap.style.display = 'flex';
                }
            });
        }

        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const pcname = document.getElementById('reg-pcname')?.value || 'zenova';
            
            const lockUsername = document.querySelector('.lock-username');
            if (lockUsername) lockUsername.innerText = username;
            
            // Update terminal prompt to reflect new username and pc name
            const newPrompt = `<span style="color:#a78bfa">${username}</span>@<span style="color:#06b6d4">${pcname}</span>:~$ `;
            document.querySelectorAll('.terminal-input-line .prompt').forEach(p => p.innerHTML = newPrompt);
            
            // Hide reg screen, go straight to desktop & wizard immediately
            regScreen.style.opacity = '0';
            regScreen.style.pointerEvents = 'none';
            setTimeout(() => {
                regScreen.classList.add('hidden');
                document.getElementById('desktop').classList.remove('hidden');
                
                // Show wizard directly
                setTimeout(() => {
                    const wizard = document.getElementById('welcome-wizard');
                    if (wizard) wizard.classList.remove('hidden');
                }, 400);
            }, 600);
        });
    }

    const input = document.getElementById('lock-input');
    const submit = document.getElementById('lock-submit');
    if (input && submit) {
        input.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
        submit.addEventListener('click', unlock);
    }
}

function unlock() {
    const ls = document.getElementById('lock-screen');
    if (ls) {
        ls.classList.add('unlocking');
        setTimeout(() => {
            ls.classList.add('hidden');
            document.getElementById('desktop').classList.remove('hidden');
            showNotification('Welcome to Zenova OS', 'check_circle');
            
            // Show the Welcome Wizard after unlock (for demo purposes)
            setTimeout(() => {
                const wizard = document.getElementById('welcome-wizard');
                if (wizard) wizard.classList.remove('hidden');
            }, 500);
        }, 600);
    }
}

function createLockParticles() {
    const container = document.getElementById('lock-particles');
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'lock-particle';
        p.style.width = p.style.height = Math.random() * 6 + 2 + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = Math.random() * 4 + 6 + 's';
        container.appendChild(p);
    }
}

// ── Clock ──
function setupClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const lt = document.getElementById('lock-time');
    const ld = document.getElementById('lock-date');
    const pc = document.getElementById('panel-clock');
    if (lt) lt.textContent = `${h}:${m}`;
    if (ld) ld.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    if (pc) pc.textContent = `${days[now.getDay()].slice(0,3)} ${h}:${m}`;
}

// ── Dock ──
function setupDock() {
    document.querySelectorAll('.dock-item[data-app]').forEach(item => {
        item.addEventListener('click', () => openApp(item.dataset.app));
    });
}

function updateDockIndicator(appName, active) {
    const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
    if (dockItem) dockItem.classList.toggle('active', active);
}

// ── Desktop Icons ──
function setupDesktopIcons() {
    document.querySelectorAll('.desktop-icon[data-app]').forEach(icon => {
        icon.addEventListener('dblclick', () => openApp(icon.dataset.app));
    });
}

// ── Context Menu ──
function setupContextMenu() {
    const menu = document.getElementById('context-menu');
    const wp = document.getElementById('desktop-wallpaper');
    if (wp) {
        wp.addEventListener('contextmenu', e => {
            e.preventDefault();
            menu.classList.remove('hidden');
            menu.style.left = Math.min(e.clientX, window.innerWidth - 220) + 'px';
            menu.style.top = Math.min(e.clientY, window.innerHeight - 200) + 'px';
        });
    }
    document.addEventListener('click', () => menu.classList.add('hidden'));
    menu.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'settings' || action === 'change-wallpaper') openApp('settings');
            else if (action === 'terminal') openApp('terminal');
            else if (action === 'about') openApp('about');
        });
    });
}

// ── Activities ──
function setupActivities() {
    const btn = document.getElementById('activities-btn');
    const overlay = document.getElementById('activities-overlay');
    const grid = document.getElementById('activities-grid');
    const searchInput = document.getElementById('activities-search-input');

    btn.addEventListener('click', () => toggleActivities());

    ALL_APPS.forEach(app => {
        const el = document.createElement('div');
        el.className = 'activities-app';
        el.dataset.name = app.name.toLowerCase();
        el.innerHTML = `<div class="activities-app-icon" style="background:${app.color}">${app.icon}</div><div class="activities-app-name">${app.name}</div>`;
        el.addEventListener('click', () => { toggleActivities(false); openApp(app.app); });
        grid.appendChild(el);
    });

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        grid.querySelectorAll('.activities-app').forEach(el => {
            el.style.display = el.dataset.name.includes(q) ? '' : 'none';
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) toggleActivities(false);
    });
}

function toggleActivities(show) {
    const overlay = document.getElementById('activities-overlay');
    const isHidden = overlay.classList.contains('hidden');
    const shouldShow = show !== undefined ? show : isHidden;
    overlay.classList.toggle('hidden', !shouldShow);
    if (shouldShow) {
        document.getElementById('activities-search-input').value = '';
        document.getElementById('activities-search-input').focus();
        document.querySelectorAll('.activities-app').forEach(el => el.style.display = '');
    }
}

// ── Window System ──
function createWindow(appName, title, width, height, contentHTML) {
    const id = 'win-' + (++state.windowIdCounter);
    const x = 100 + (state.windowIdCounter % 5) * 40;
    const y = 60 + (state.windowIdCounter % 5) * 30;

    const win = document.createElement('div');
    win.className = 'app-window focused';
    win.id = id;
    win.dataset.app = appName;
    win.style.cssText = `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;

    win.innerHTML = `
        <div class="window-titlebar">
            <div class="window-controls">
                <button class="win-btn win-close" data-action="close"></button>
                <button class="win-btn win-minimize" data-action="minimize"></button>
                <button class="win-btn win-maximize" data-action="maximize"></button>
            </div>
            <div class="window-title">${title}</div>
            <div class="window-title-spacer"></div>
        </div>
        <div class="window-body">${contentHTML}</div>`;

    document.getElementById('windows-container').appendChild(win);

    // Focus management
    win.addEventListener('mousedown', () => focusWindow(id));
    focusWindow(id);

    // Titlebar buttons
    win.querySelectorAll('.win-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'close') closeWindow(id);
            else if (action === 'minimize') minimizeWindow(id);
            else if (action === 'maximize') maximizeWindow(id);
        });
    });

    // Dragging
    setupDrag(win);

    state.windows[id] = { appName, title };
    state.windowOrder.push(id);
    updateDockIndicator(appName, true);
    return id;
}

function focusWindow(id) {
    document.querySelectorAll('.app-window').forEach(w => w.classList.remove('focused'));
    const win = document.getElementById(id);
    if (win) { win.classList.add('focused'); state.focusedWindow = id; }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const info = state.windows[id];
    win.classList.add('closing');
    setTimeout(() => {
        win.remove();
        delete state.windows[id];
        state.windowOrder = state.windowOrder.filter(w => w !== id);
        // Check if any other window has the same app
        const hasOther = Object.values(state.windows).some(w => w.appName === info.appName);
        if (!hasOther) updateDockIndicator(info.appName, false);
    }, 200);
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('minimizing');
    setTimeout(() => { win.style.display = 'none'; win.classList.remove('minimizing'); }, 300);
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
    } else {
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevTop = win.style.top;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.classList.add('maximized');
        win.style.left = '0'; win.style.top = '32px';
        win.style.width = '100%'; win.style.height = 'calc(100% - 32px)';
    }
}

function setupDrag(win) {
    const tb = win.querySelector('.window-titlebar');
    let dragging = false, ox, oy;
    tb.addEventListener('mousedown', e => {
        if (e.target.closest('.win-btn')) return;
        dragging = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
        win.style.transition = 'none';
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        win.style.left = (e.clientX - ox) + 'px'; win.style.top = (e.clientY - oy) + 'px';
        if (win.classList.contains('maximized')) {
            win.classList.remove('maximized');
            win.style.width = win.dataset.prevWidth || '700px';
            win.style.height = win.dataset.prevHeight || '500px';
        }
    });
    document.addEventListener('mouseup', () => { dragging = false; win.style.transition = ''; });
}

// ── App Launcher ──
function openApp(appName) {
    // Check if already open — focus it
    for (const [id, info] of Object.entries(state.windows)) {
        if (info.appName === appName) {
            const win = document.getElementById(id);
            if (win) { win.style.display = ''; focusWindow(id); return; }
        }
    }

    switch (appName) {
        case 'terminal': openTerminal(); break;
        case 'settings': openSettings(); break;
        case 'store': openStore(); break;
        case 'steam': openSteam(); break;
        case 'discord': openDiscord(); break;
        case 'brave': openBrave(); break;
        case 'files': openFiles(); break;
        case 'about': openAbout(); break;
    }
}

// ── Terminal App ──
function openTerminal() {
    const content = `<div class="terminal-body"><div class="terminal-output" id="term-output"><span class="result">Welcome to <b style="color:#a78bfa">Zenova OS</b> Terminal v1.0\nType 'help' for available commands.\n\n</span></div><div class="terminal-input-line"><span class="prompt">gamer@zenova:~$ </span><input class="terminal-input" id="term-input" autofocus spellcheck="false"></div></div>`;
    const id = createWindow('terminal', 'Terminal', 650, 420, content);
    const input = document.querySelector(`#${id} .terminal-input`);
    const output = document.querySelector(`#${id} .terminal-output`);
    if (input) {
        input.focus();
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                output.innerHTML += `<span class="prompt">gamer@zenova:~$ </span><span class="cmd">${escapeHTML(cmd)}</span>\n`;
                if (cmd) { state.terminalHistory.push(cmd); state.terminalHistoryIdx = state.terminalHistory.length; }
                const result = processCommand(cmd);
                if (result) output.innerHTML += `<span class="result">${result}</span>\n`;
                output.innerHTML += '\n';
                output.scrollTop = output.scrollHeight;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (state.terminalHistoryIdx > 0) { state.terminalHistoryIdx--; input.value = state.terminalHistory[state.terminalHistoryIdx]; }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (state.terminalHistoryIdx < state.terminalHistory.length - 1) { state.terminalHistoryIdx++; input.value = state.terminalHistory[state.terminalHistoryIdx]; }
                else { state.terminalHistoryIdx = state.terminalHistory.length; input.value = ''; }
            }
        });
    }
}

function processCommand(cmd) {
    const parts = cmd.split(/\s+/);
    const c = parts[0]?.toLowerCase();
    const commands = {
        'help': () => `<span style="color:#a78bfa">Available commands:</span>\n  help         Show this help\n  neofetch     System information\n  ls           List files\n  pwd          Print working directory\n  whoami       Current user\n  uname        System info\n  date         Current date/time\n  uptime       System uptime\n  clear        Clear terminal\n  echo [text]  Print text\n  cat [file]   Read file\n  top          Process list\n  free         Memory info\n  df           Disk usage\n  ip           Network info`,
        'neofetch': () => `<span style="color:#a78bfa">        ▄▄▄▄▄▄▄        </span>  <span style="color:#a78bfa">gamer</span>@<span style="color:#06b6d4">zenova</span>\n<span style="color:#a78bfa">      ▄█████████▄      </span>  ──────────────\n<span style="color:#a78bfa">    ▄███████████████▄    </span>  <span style="color:#a78bfa">OS:</span> Zenova OS 1.0 (Bazzite-based)\n<span style="color:#a78bfa">   █████████████████   </span>  <span style="color:#a78bfa">Kernel:</span> Linux 6.12.8-zen\n<span style="color:#a78bfa">  ████████████████████  </span>  <span style="color:#a78bfa">DE:</span> Zenova Shell\n<span style="color:#a78bfa">  ████████████████████  </span>  <span style="color:#a78bfa">WM:</span> Mutter (Wayland)\n<span style="color:#a78bfa">   █████████████████   </span>  <span style="color:#a78bfa">Theme:</span> Zenova Dark\n<span style="color:#a78bfa">    ▀███████████████▀    </span>  <span style="color:#a78bfa">Icons:</span> Papirus-Dark\n<span style="color:#a78bfa">      ▀█████████▀      </span>  <span style="color:#a78bfa">Terminal:</span> Zenova Terminal\n<span style="color:#a78bfa">        ▀▀▀▀▀▀▀        </span>  <span style="color:#a78bfa">CPU:</span> AMD Ryzen 9 7950X\n                         <span style="color:#a78bfa">GPU:</span> NVIDIA RTX 4090\n                         <span style="color:#a78bfa">Memory:</span> 8.2 GiB / 32.0 GiB`,
        'ls': () => 'Desktop  Documents  Downloads  Games  Music  Pictures  Videos  .config  .local',
        'pwd': () => '/home/gamer',
        'whoami': () => 'gamer',
        'uname': () => 'Linux zenova 6.12.8-zen #1 ZEN SMP PREEMPT x86_64 GNU/Linux',
        'date': () => new Date().toString(),
        'uptime': () => ' 20:05:44 up 3:42, 1 user, load average: 0.42, 0.38, 0.35',
        'clear': () => { const out = document.getElementById('term-output'); if (out) out.innerHTML = ''; return ''; },
        'echo': () => parts.slice(1).join(' '),
        'cat': () => parts[1] ? `cat: ${parts[1]}: No such file or directory` : 'cat: missing operand',
        'top': () => `  PID USER      PR  NI    VIRT    RES  COMMAND\n  892 gamer     20   0  4.2g   180m  steam\n 1024 gamer     20   0  1.8g   120m  brave\n 1201 gamer     20   0  980m    85m  discord\n 1350 gamer     20   0  420m    32m  zenova-shell\n 1402 gamer     20   0  180m    18m  pipewire`,
        'free': () => `              total        used        free      shared  buff/cache   available\nMem:       32768000    8400000   18200000      420000    6168000   23800000\nSwap:       8388608          0    8388608`,
        'df': () => `Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  1.0T  245G  755G  25% /\n/dev/nvme0n1p1  512M   42M  470M   9% /boot/efi`,
        'ip': () => 'inet 192.168.1.42/24 brd 192.168.1.255 scope global dynamic enp5s0',
    };
    if (!c) return '';
    if (commands[c]) return commands[c]();
    return `<span class="error">bash: ${escapeHTML(c)}: command not found</span>`;
}

// ── Settings App ──
function openSettings() {
    const navItems = [
        { id: 'appearance', icon: 'palette', label: 'Appearance' },
        { id: 'wallpaper', icon: 'wallpaper', label: 'Wallpaper' },
        { id: 'dock', icon: 'dock_to_bottom', label: 'Dock' },
        { id: 'gaming', icon: 'sports_esports', label: 'Gaming' },
        { id: 'display', icon: 'monitor', label: 'Display' },
        { id: 'sound', icon: 'volume_up', label: 'Sound' },
        { id: 'about-sys', icon: 'info', label: 'About' },
    ];

    const nav = navItems.map(n => `<button class="settings-nav-item${n.id==='appearance'?' active':''}" data-section="${n.id}"><span class="material-symbols-rounded">${n.icon}</span>${n.label}</button>`).join('');

    const content = `<div class="settings-layout"><div class="settings-sidebar">${nav}</div><div class="settings-content" id="settings-panel-content">${renderSettingsSection('appearance')}</div></div>`;
    const id = createWindow('settings', 'Settings', 780, 520, content);
    const win = document.getElementById(id);

    win.querySelectorAll('.settings-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            win.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            win.querySelector('#settings-panel-content').innerHTML = renderSettingsSection(btn.dataset.section);
            bindSettingsEvents(win);
        });
    });
    bindSettingsEvents(win);
}

function renderSettingsSection(section) {
    switch (section) {
        case 'appearance': return `
            <h3 class="settings-section-title">Appearance</h3>
            <div class="settings-group">
                <div class="settings-group-title">Accent Color</div>
                <div class="color-swatches" id="accent-swatches">
                    ${ACCENT_COLORS.map(c => `<div class="color-swatch${state.settings.accent===c.color?' active':''}" style="background:${c.color}" data-color="${c.color}" title="${c.name}"></div>`).join('')}
                </div>
            </div>
            <div class="settings-group">
                <div class="settings-group-title">Interface</div>
                <div class="settings-row"><div><div class="settings-row-label">Dark Mode</div><div class="settings-row-desc">Use dark theme across the system</div></div><label class="toggle"><input type="checkbox" checked data-setting="darkMode"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div><div class="settings-row-label">Enable Animations</div><div class="settings-row-desc">Smooth transitions and effects</div></div><label class="toggle"><input type="checkbox" ${state.settings.animations?'checked':''} data-setting="animations"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div><div class="settings-row-label">Blur Effects</div><div class="settings-row-desc">Glassmorphism backdrop blur</div></div><label class="toggle"><input type="checkbox" ${state.settings.blur?'checked':''} data-setting="blur"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div class="settings-row-label">Animation Speed</div><input type="range" class="settings-slider" min="0.1" max="0.8" step="0.1" value="${state.settings.animSpeed}" data-setting="animSpeed"></div>
            </div>`;

        case 'wallpaper': return `
            <h3 class="settings-section-title">Wallpaper</h3>
            <div class="wallpaper-grid" id="wallpaper-grid">
                ${WALLPAPERS.map(w => `<div class="wallpaper-thumb${state.settings.wallpaper===w.id?' active':''}" data-wp="${w.id}" style="background:${w.bg}" title="${w.name}"></div>`).join('')}
            </div>`;

        case 'dock': return `
            <h3 class="settings-section-title">Dock</h3>
            <div class="settings-group">
                <div class="settings-row"><div><div class="settings-row-label">Dock Magnification</div><div class="settings-row-desc">Enlarge icons on hover</div></div><label class="toggle"><input type="checkbox" ${state.settings.dockMagnify?'checked':''} data-setting="dockMagnify"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div class="settings-row-label">Icon Size</div><input type="range" class="settings-slider" min="40" max="72" step="4" value="${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-size'))}" data-setting="dockSize"></div>
            </div>`;

        case 'gaming': return `
            <h3 class="settings-section-title">Gaming</h3>
            <div class="settings-group">
                <div class="settings-group-title">Performance</div>
                <div class="settings-row"><div><div class="settings-row-label">Maximum Performance Mode</div><div class="settings-row-desc">Optimize OS scheduler and disable power limits</div></div><label class="toggle"><input type="checkbox" checked data-setting="maxperf"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div><div class="settings-row-label">Low Latency Audio</div><div class="settings-row-desc">Enforce sub-3ms buffer for competitive gaming</div></div><label class="toggle"><input type="checkbox" data-setting="lowlatency" checked><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div><div class="settings-row-label">Steam Proton (Latest)</div><div class="settings-row-desc">Use Proton Experimental for Windows games</div></div><label class="toggle"><input type="checkbox" checked data-setting="proton"><span class="toggle-slider"></span></label></div>
            </div>
            <div class="settings-group">
                <div class="settings-group-title">GPU</div>
                <div class="settings-row"><div><div class="settings-row-label">Performance Profile</div><div class="settings-row-desc">GPU power management mode</div></div><select style="background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:13px;"><option>Balanced</option><option>Performance</option><option>Power Save</option></select></div>
            </div>`;

        case 'display': return `
            <h3 class="settings-section-title">Display</h3>
            <div class="settings-group">
                <div class="settings-row"><div class="settings-row-label">Resolution</div><span style="color:var(--text-secondary);font-size:13px">${window.screen.width} × ${window.screen.height}</span></div>
                <div class="settings-row"><div class="settings-row-label">Refresh Rate</div><span style="color:var(--text-secondary);font-size:13px">165 Hz</span></div>
                <div class="settings-row"><div><div class="settings-row-label">Night Light</div><div class="settings-row-desc">Reduce blue light at night</div></div><label class="toggle"><input type="checkbox" data-setting="nightlight"><span class="toggle-slider"></span></label></div>
                <div class="settings-row"><div class="settings-row-label">UI Scale</div><input type="range" class="settings-slider" min="80" max="150" step="10" value="100" data-setting="uiScale"></div>
            </div>`;

        case 'sound': return `
            <h3 class="settings-section-title">Sound</h3>
            <div class="settings-group">
                <div class="settings-row"><div class="settings-row-label">Output Volume</div><input type="range" class="settings-slider" min="0" max="100" value="80" data-setting="volume"></div>
                <div class="settings-row"><div class="settings-row-label">Output Device</div><span style="color:var(--text-secondary);font-size:13px">Built-in Audio (PipeWire)</span></div>
                <div class="settings-row"><div><div class="settings-row-label">System Sounds</div></div><label class="toggle"><input type="checkbox" checked data-setting="sysSounds"><span class="toggle-slider"></span></label></div>
            </div>`;

        case 'about-sys': return `
            <div class="about-content">
                <div class="about-logo">ZENOVA</div>
                <div class="about-version">Version 1.0.0 — "Ignition"</div>
                <div class="about-desc">A premium gaming Linux distribution based on Bazzite, built for gamers who demand performance and style. Powered by Fedora Atomic with Steam, Proton, and ultra-low latency kernel optimizations pre-configured out of the box.</div>
                <div class="about-based">Based on Bazzite • Fedora Atomic • Wayland • PipeWire</div>
                <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;justify-content:center;">
                    <div style="text-align:center;padding:12px 20px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid var(--border)"><div style="font-size:18px;font-weight:700;color:var(--accent-light)">6.12.8</div><div style="font-size:11px;color:var(--text-muted)">Kernel</div></div>
                    <div style="text-align:center;padding:12px 20px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid var(--border)"><div style="font-size:18px;font-weight:700;color:var(--accent-light)">GNOME 47</div><div style="font-size:11px;color:var(--text-muted)">Desktop</div></div>
                    <div style="text-align:center;padding:12px 20px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid var(--border)"><div style="font-size:18px;font-weight:700;color:var(--accent-light)">Wayland</div><div style="font-size:11px;color:var(--text-muted)">Display</div></div>
                </div>
            </div>`;

        default: return '<div style="padding:30px;color:var(--text-secondary)">Section coming soon...</div>';
    }
}

function bindSettingsEvents(win) {
    // Accent swatches
    win.querySelectorAll('.color-swatch[data-color]').forEach(s => {
        s.addEventListener('click', () => {
            state.settings.accent = s.dataset.color;
            document.documentElement.style.setProperty('--accent', s.dataset.color);
            const hsl = hexToHSL(s.dataset.color);
            document.documentElement.style.setProperty('--accent-light', `hsl(${hsl.h}, ${Math.min(hsl.s+10,100)}%, ${Math.min(hsl.l+20,85)}%)`);
            document.documentElement.style.setProperty('--accent-dark', `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l-15,15)}%)`);
            document.documentElement.style.setProperty('--accent-glow', `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.4)`);
            win.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
            s.classList.add('active');
            showNotification(`Accent color changed to ${s.title || 'custom'}`, 'palette');
        });
    });

    // Wallpapers
    win.querySelectorAll('.wallpaper-thumb[data-wp]').forEach(t => {
        t.addEventListener('click', () => {
            const wp = WALLPAPERS.find(w => w.id === t.dataset.wp);
            if (wp) {
                state.settings.wallpaper = wp.id;
                document.getElementById('desktop-wallpaper').style.background = wp.bg;
                win.querySelectorAll('.wallpaper-thumb').forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                showNotification(`Wallpaper changed to ${wp.name}`, 'wallpaper');
            }
        });
    });

    // Toggles
    win.querySelectorAll('input[data-setting]').forEach(inp => {
        inp.addEventListener('change', () => {
            const key = inp.dataset.setting;
            if (inp.type === 'checkbox') state.settings[key] = inp.checked;
            if (key === 'animations') document.documentElement.style.setProperty('--anim', inp.checked ? '0.3s' : '0s');
        });
    });

    // Sliders
    win.querySelectorAll('.settings-slider[data-setting]').forEach(sl => {
        sl.addEventListener('input', () => {
            if (sl.dataset.setting === 'animSpeed') {
                state.settings.animSpeed = sl.value;
                document.documentElement.style.setProperty('--anim', sl.value + 's');
            } else if (sl.dataset.setting === 'dockSize') {
                document.documentElement.style.setProperty('--dock-size', sl.value + 'px');
            }
        });
    });
}

// ── Store App ──
function openStore() {
    const cats = ['All', 'Gaming', 'Media', 'Social', 'Productivity', 'Browsers', 'System'];
    const catBtns = cats.map(c => `<button class="store-cat-btn${c==='All'?' active':''}" data-cat="${c.toLowerCase()}">${c}</button>`).join('');

    const content = `<div class="store-layout">
        <div class="store-header"><h2>Zenova Store</h2><p>Discover and install the best Linux apps</p>
        <div class="store-search"><span class="material-symbols-rounded">search</span><input placeholder="Search apps..." id="store-search-input"></div></div>
        <div class="store-categories">${catBtns}</div>
        <div class="store-grid" id="store-grid">${renderStoreApps('all')}</div></div>`;

    const id = createWindow('store', 'Zenova Store', 780, 560, content);
    const win = document.getElementById(id);

    win.querySelectorAll('.store-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            win.querySelectorAll('.store-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            win.querySelector('#store-grid').innerHTML = renderStoreApps(btn.dataset.cat);
            bindStoreInstall(win);
        });
    });

    const searchInput = win.querySelector('#store-search-input');
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        win.querySelectorAll('.store-app-card').forEach(card => {
            card.style.display = card.dataset.name.includes(q) ? '' : 'none';
        });
    });

    bindStoreInstall(win);
}

function renderStoreApps(cat) {
    return STORE_APPS.filter(a => cat === 'all' || a.cat === cat).map(a => `
        <div class="store-app-card" data-name="${a.name.toLowerCase()}">
            <div class="store-app-icon-wrap" style="background:${a.color}">${a.icon}</div>
            <div class="store-app-name">${a.name}</div>
            <div class="store-app-desc">${a.desc}</div>
            <button class="store-install-btn" data-install="${a.name}">Install</button>
        </div>`).join('');
}

function bindStoreInstall(win) {
    win.querySelectorAll('.store-install-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('installed')) return;
            btn.textContent = 'Installing...';
            btn.style.opacity = '0.6';
            setTimeout(() => {
                btn.textContent = 'Installed';
                btn.classList.add('installed');
                btn.style.opacity = '1';
                showNotification(`${btn.dataset.install} installed successfully`, 'download_done');
            }, 1500);
        });
    });
}

// ── Steam App ──
function openSteam() {
    const games = [
        { name: 'Counter-Strike 2', installed: true, color: '#1a1a2e', hero: 'linear-gradient(135deg, #1a1a2e, #d97706)' },
        { name: 'Cyberpunk 2077', installed: true, color: '#7c2d12', hero: 'linear-gradient(135deg, #fbbf24, #dc2626)' },
        { name: 'Elden Ring', installed: true, color: '#1e3a5f', hero: 'linear-gradient(135deg, #1e3a5f, #854d0e)' },
        { name: 'Baldur\'s Gate 3', installed: true, color: '#2d1b69', hero: 'linear-gradient(135deg, #4c1d95, #b91c1c)' },
        { name: 'Palworld', installed: false, color: '#065f46', hero: 'linear-gradient(135deg, #065f46, #3b82f6)' },
        { name: 'Helldivers 2', installed: false, color: '#1e293b', hero: 'linear-gradient(135deg, #1e293b, #b45309)' },
    ];

    const sidebar = games.map((g,i) => `<div class="steam-game-item${i===0?' active':''}" data-idx="${i}"><span class="steam-game-dot ${g.installed?'installed':'not-installed'}"></span>${g.name}</div>`).join('');

    const content = `<div class="steam-layout">
        <div class="steam-sidebar"><div class="steam-sidebar-title">Library</div>${sidebar}</div>
        <div class="steam-content" id="steam-game-view">${renderSteamGame(games[0])}</div></div>`;

    const id = createWindow('steam', 'Steam', 800, 500, content);
    const win = document.getElementById(id);

    win.querySelectorAll('.steam-game-item').forEach(item => {
        item.addEventListener('click', () => {
            win.querySelectorAll('.steam-game-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            win.querySelector('#steam-game-view').innerHTML = renderSteamGame(games[item.dataset.idx]);
        });
    });
}

function renderSteamGame(game) {
    return `<div class="steam-hero" style="background:${game.hero}"><div class="steam-hero-overlay"><div><div class="steam-hero-title">${game.name}</div><div class="steam-hero-subtitle">${game.installed ? 'Installed • Ready to play' : 'Not installed'}</div></div></div></div>
    <div class="steam-details"><button class="steam-play-btn">${game.installed ? '▶ PLAY' : '⬇ INSTALL'}</button>
    <div style="margin-top:16px;display:flex;gap:20px"><div style="font-size:12px;color:var(--text-muted)"><div style="font-weight:600;color:var(--text-secondary);margin-bottom:2px">Last Played</div>${game.installed?'Today':'Never'}</div><div style="font-size:12px;color:var(--text-muted)"><div style="font-weight:600;color:var(--text-secondary);margin-bottom:2px">Play Time</div>${game.installed?Math.floor(Math.random()*200+10)+' hrs':'0 hrs'}</div><div style="font-size:12px;color:var(--text-muted)"><div style="font-weight:600;color:var(--text-secondary);margin-bottom:2px">Proton</div>Experimental</div></div></div>`;
}

// ── Discord App ──
function openDiscord() {
    const content = `<div class="discord-layout">
        <div class="discord-servers">
            <div class="discord-server-icon" style="background:#5865f2">🏠</div>
            <div style="width:32px;height:2px;background:var(--border);border-radius:1px"></div>
            <div class="discord-server-icon">G</div>
            <div class="discord-server-icon" style="background:#ea580c">R</div>
            <div class="discord-server-icon" style="background:#16a34a">M</div>
            <div class="discord-server-icon" style="background:#7c3aed">Z</div>
        </div>
        <div class="discord-channels">
            <div class="discord-channel-header">Gaming Squad</div>
            <div class="discord-channel-cat">Text Channels</div>
            <div class="discord-channel active"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">tag</span> general</div>
            <div class="discord-channel"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">tag</span> gaming</div>
            <div class="discord-channel"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">tag</span> memes</div>
            <div class="discord-channel"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">tag</span> tech-talk</div>
            <div class="discord-channel-cat">Voice Channels</div>
            <div class="discord-channel"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">volume_up</span> Lobby</div>
            <div class="discord-channel"><span class="material-symbols-rounded" style="font-size:18px;color:var(--text-muted)">volume_up</span> Gaming</div>
        </div>
        <div class="discord-chat">
            <div class="discord-chat-header"># general</div>
            <div class="discord-messages">
                <div class="discord-msg"><div class="discord-msg-avatar" style="background:#ea580c">A</div><div class="discord-msg-body"><div class="discord-msg-name">Alex <span>Today at 7:42 PM</span></div><div class="discord-msg-text">Anyone down for some CS2 tonight? 🎮</div></div></div>
                <div class="discord-msg"><div class="discord-msg-avatar" style="background:#16a34a">M</div><div class="discord-msg-body"><div class="discord-msg-name">Mike <span>Today at 7:43 PM</span></div><div class="discord-msg-text">Yeah I'm in! Just updated my drivers on Zenova, everything runs smooth 🔥</div></div></div>
                <div class="discord-msg"><div class="discord-msg-avatar" style="background:#7c3aed">S</div><div class="discord-msg-body"><div class="discord-msg-name">Sarah <span>Today at 7:45 PM</span></div><div class="discord-msg-text">Count me in too! The Proton compatibility is insane, every game just works</div></div></div>
                <div class="discord-msg"><div class="discord-msg-avatar" style="background:#0ea5e9">J</div><div class="discord-msg-body"><div class="discord-msg-name">Jake <span>Today at 7:48 PM</span></div><div class="discord-msg-text">Nice, I'll hop on in 10. Frame counter is showing stable 144fps btw 📊</div></div></div>
                <div class="discord-msg"><div class="discord-msg-avatar" style="background:#ea580c">A</div><div class="discord-msg-body"><div class="discord-msg-name">Alex <span>Today at 7:50 PM</span></div><div class="discord-msg-text">Perfect, see you all in the Gaming voice channel! 🎧</div></div></div>
            </div>
            <div class="discord-chat-input-wrap"><input class="discord-chat-input" placeholder="Message #general"></div>
        </div></div>`;
    createWindow('discord', 'Discord', 850, 520, content);
}

// ── Brave App ──
function openBrave() {
    const content = `<div class="brave-layout">
        <div class="brave-toolbar">
            <button class="brave-nav-btn"><span class="material-symbols-rounded">arrow_back</span></button>
            <button class="brave-nav-btn"><span class="material-symbols-rounded">arrow_forward</span></button>
            <button class="brave-nav-btn"><span class="material-symbols-rounded">refresh</span></button>
            <div class="brave-url-bar"><span class="material-symbols-rounded">lock</span>brave://newtab</div>
            <button class="brave-nav-btn"><span class="material-symbols-rounded">more_vert</span></button>
        </div>
        <div class="brave-content">
            <div class="brave-ntp-logo">Brave</div>
            <div class="brave-ntp-search"><span class="material-symbols-rounded">search</span><input placeholder="Search the web privately..."></div>
            <div class="brave-shortcuts">
                <div class="brave-shortcut"><div class="brave-shortcut-icon" style="color:#dc2626">▶</div><div class="brave-shortcut-label">YouTube</div></div>
                <div class="brave-shortcut"><div class="brave-shortcut-icon" style="color:#1d9bf0">𝕏</div><div class="brave-shortcut-label">X / Twitter</div></div>
                <div class="brave-shortcut"><div class="brave-shortcut-icon" style="color:#ff4500">R</div><div class="brave-shortcut-label">Reddit</div></div>
                <div class="brave-shortcut"><div class="brave-shortcut-icon" style="color:#7c3aed">G</div><div class="brave-shortcut-label">GitHub</div></div>
                <div class="brave-shortcut"><div class="brave-shortcut-icon" style="color:#0ea5e9">W</div><div class="brave-shortcut-label">Wikipedia</div></div>
            </div>
        </div></div>`;
    createWindow('brave', 'Brave Browser', 900, 550, content);
}

// ── Files App ──
function openFiles() {
    const items = [
        { name: 'Desktop', icon: 'desktop_windows', color: '#3b82f6' },
        { name: 'Documents', icon: 'description', color: '#8b5cf6' },
        { name: 'Downloads', icon: 'download', color: '#06b6d4' },
        { name: 'Games', icon: 'sports_esports', color: '#22c55e' },
        { name: 'Music', icon: 'music_note', color: '#f43f5e' },
        { name: 'Pictures', icon: 'image', color: '#f97316' },
        { name: 'Videos', icon: 'videocam', color: '#ef4444' },
        { name: '.config', icon: 'settings', color: '#6b7280' },
    ];

    const fileGrid = items.map(f => `<div class="files-item"><span class="material-symbols-rounded" style="color:${f.color}">${f.icon}</span><div class="files-item-name">${f.name}</div></div>`).join('');

    const content = `<div class="files-layout">
        <div class="files-sidebar">
            <div class="files-nav-title">Places</div>
            <div class="files-nav-item active"><span class="material-symbols-rounded">home</span>Home</div>
            <div class="files-nav-item"><span class="material-symbols-rounded">desktop_windows</span>Desktop</div>
            <div class="files-nav-item"><span class="material-symbols-rounded">download</span>Downloads</div>
            <div class="files-nav-item"><span class="material-symbols-rounded">description</span>Documents</div>
            <div class="files-nav-title" style="margin-top:16px">Devices</div>
            <div class="files-nav-item"><span class="material-symbols-rounded">hard_drive</span>NVMe 1TB</div>
        </div>
        <div class="files-content"><div class="files-path">📁 /home/gamer</div><div class="files-grid">${fileGrid}</div></div></div>`;
    createWindow('files', 'Files', 700, 460, content);
}

// ── About Dialog ──
function openAbout() {
    const content = `<div class="about-content">
        <div class="about-logo">ZENOVA</div>
        <div class="about-version">Version 1.0.0 — "Ignition"</div>
        <div class="about-desc">A premium gaming Linux distribution built for performance, style, and the ultimate gaming experience. Based on Bazzite with Fedora Atomic underneath.</div>
        <div class="about-based">Kernel 6.12.8-zen • GNOME 47 • Wayland • PipeWire • Mesa 24.3</div>
    </div>`;
    createWindow('about', 'About Zenova', 420, 340, content);
}

// ── Notifications ──
function showNotification(text, icon = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<span class="material-symbols-rounded">${icon}</span><span class="notification-text">${text}</span>`;
    container.appendChild(notif);
    setTimeout(() => { notif.classList.add('out'); setTimeout(() => notif.remove(), 300); }, 3500);
}

// ── Utilities ──
function escapeHTML(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2;
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        if (max === r) h = ((g-b)/d + (g<b?6:0))/6;
        else if (max === g) h = ((b-r)/d+2)/6;
        else h = ((r-g)/d+4)/6;
    }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

// ── Welcome Wizard Logic ──
const wizardOverlay = document.getElementById('welcome-wizard');
if (wizardOverlay) {
    const wizardNext = document.getElementById('wizard-next');
    const wizardClose = document.getElementById('wizard-close');
    const wDots = document.querySelectorAll('.w-dot');
    let currentWizardStep = 1;

    function updateWizardStep() {
        document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
        
        let stepId = 'wizard-step-' + currentWizardStep;
        if (currentWizardStep === 4) stepId = 'wizard-step-m'; // GPU logic step
        if (currentWizardStep === 5) stepId = 'wizard-step-4';
        
        document.getElementById(stepId).classList.remove('hidden');
        setTimeout(() => document.getElementById(stepId).classList.add('active'), 10);
        
        wDots.forEach((dot, index) => {
            dot.className = 'w-dot';
            if (index === Math.min(currentWizardStep - 1, 3)) dot.classList.add('active');
        });
        
        if (currentWizardStep === 5) wizardNext.innerText = "Finish & Start Gaming";
        else wizardNext.innerText = currentWizardStep === 1 ? "Let's Go" : "Continue";
    }

    wizardNext.addEventListener('click', () => {
        if (currentWizardStep < 5) {
            currentWizardStep++;
            updateWizardStep();
        } else {
            wizardOverlay.classList.add('hidden');
            showNotification("Setup Complete", "Zenova OS is ready to use!");
        }
    });

    wizardClose.addEventListener('click', () => wizardOverlay.classList.add('hidden'));

    // Hook up accent colors in wizard
    document.querySelectorAll('.w-colors .color-swatch').forEach(s => {
        s.addEventListener('click', () => {
            document.querySelectorAll('.w-colors .color-swatch').forEach(x => x.classList.remove('active'));
            s.classList.add('active');
            
            // Apply it globally exactly like the settings app
            state.settings.accent = s.dataset.color;
            document.documentElement.style.setProperty('--accent', s.dataset.color);
            const hsl = hexToHSL(s.dataset.color);
            document.documentElement.style.setProperty('--accent-light', `hsl(${hsl.h}, ${Math.min(hsl.s+10,100)}%, ${Math.min(hsl.l+20,85)}%)`);
            document.documentElement.style.setProperty('--accent-dark', `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l-15,15)}%)`);
            document.documentElement.style.setProperty('--accent-glow', `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.4)`);
        });
    });
}
