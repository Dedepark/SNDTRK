// ════════════════════════════════════════════
//  js/settings.js — Settings Module
//  Themes, Install PWA, Advanced config
// ════════════════════════════════════════════

// ── Theme Definitions ─────────────────────────
const THEMES = {
  darkmorphism: {
    label: 'Darkmorphism',
    desc: 'Matte carbon · Hairline borders · Technical precision',
    vars: {
      '--bg':          '#080808',
      '--surface':     '#101010',
      '--surface2':    '#161616',
      '--surface3':    '#1c1c1c',
      '--border':      '#1a1a1a',
      '--border2':     '#262626',
      '--accent':      '#1db954',
      '--accent-dim':  'rgba(29,185,84,.12)',
      '--accent-glo':  'rgba(29,185,84,.30)',
      '--accent-glo2': 'rgba(29,185,84,.15)',
      '--text':        '#efefef',
      '--text-dim':    '#6e6e6e',
      '--text-mute':   '#2e2e2e',
      '--r':           '4px',
      '--nav-bg':      'rgba(8,8,8,.96)',
      '--card-shadow': '0 8px 32px rgba(0,0,0,.6)',
      '--vis-color':   '29,185,84',
      '--vis-cap':     '160,255,185',
    },
    preview: ['#080808', '#1db954', '#101010'],
  },
  glassmorphism: {
    label: 'Glassmorphism',
    desc: 'Frosted glass · Backdrop blur · Floating layers',
    vars: {
      '--bg':          '#0d1117',
      '--surface':     'rgba(255,255,255,0.07)',
      '--surface2':    'rgba(255,255,255,0.10)',
      '--surface3':    'rgba(255,255,255,0.05)',
      '--border':      'rgba(255,255,255,0.08)',
      '--border2':     'rgba(255,255,255,0.14)',
      '--accent':      '#7dd3fc',
      '--accent-dim':  'rgba(125,211,252,.12)',
      '--accent-glo':  'rgba(125,211,252,.35)',
      '--accent-glo2': 'rgba(125,211,252,.18)',
      '--text':        '#f0f9ff',
      '--text-dim':    '#94a3b8',
      '--text-mute':   '#334155',
      '--r':           '24px',
      '--nav-bg':      'rgba(13,17,23,0.75)',
      '--card-shadow': '0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      '--vis-color':   '125,211,252',
      '--vis-cap':     '186,230,253',
    },
    preview: ['#0d1117', '#7dd3fc', 'rgba(255,255,255,0.07)'],
  },
  neumorphism: {
    label: 'Neumorphism',
    desc: 'Extruded clay · Dual shadow depth · Soft UI',
    vars: {
      '--bg':          '#e0e5ec',
      '--surface':     '#e0e5ec',
      '--surface2':    '#d1d9e6',
      '--surface3':    '#c8d0e7',
      '--border':      '#d1d9e6',
      '--border2':     '#c8d0e7',
      '--accent':      '#6c63ff',
      '--accent-dim':  'rgba(108,99,255,.12)',
      '--accent-glo':  'rgba(108,99,255,.30)',
      '--accent-glo2': 'rgba(108,99,255,.15)',
      '--text':        '#2d3748',
      '--text-dim':    '#718096',
      '--text-mute':   '#a0aec0',
      '--r':           '16px',
      '--nav-bg':      '#e0e5ec',
      '--card-shadow': '6px 6px 14px #b8bec7, -6px -6px 14px #ffffff',
      '--vis-color':   '108,99,255',
      '--vis-cap':     '167,163,255',
    },
    preview: ['#e0e5ec', '#6c63ff', '#d1d9e6'],
  },
  skeuomorphism: {
    label: 'Skeuomorphism',
    desc: 'Dark walnut · Brushed gold · Beveled leather',
    vars: {
      '--bg':          '#2c2416',
      '--surface':     '#3a2f1e',
      '--surface2':    '#4a3d28',
      '--surface3':    '#5a4d38',
      '--border':      '#6b5940',
      '--border2':     '#7d6b4e',
      '--accent':      '#d4a017',
      '--accent-dim':  'rgba(212,160,23,.15)',
      '--accent-glo':  'rgba(212,160,23,.35)',
      '--accent-glo2': 'rgba(212,160,23,.18)',
      '--text':        '#f5e6c8',
      '--text-dim':    '#b89a6e',
      '--text-mute':   '#6b5940',
      '--r':           '10px',
      '--nav-bg':      '#2c2416',
      '--card-shadow': '0 4px 8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,220,120,0.15)',
      '--vis-color':   '212,160,23',
      '--vis-cap':     '255,220,120',
    },
    preview: ['#2c2416', '#d4a017', '#3a2f1e'],
  },
  claymorphism: {
    label: 'Claymorphism',
    desc: 'Puffy 3D clay · Thick press shadows · Toy-like pop',
    vars: {
      '--bg':          '#f0e6ff',
      '--surface':     '#ffffff',
      '--surface2':    '#faf0ff',
      '--surface3':    '#f5e8ff',
      '--border':      '#e8d5ff',
      '--border2':     '#d5b8ff',
      '--accent':      '#a855f7',
      '--accent-dim':  'rgba(168,85,247,.12)',
      '--accent-glo':  'rgba(168,85,247,.35)',
      '--accent-glo2': 'rgba(168,85,247,.18)',
      '--text':        '#3b0764',
      '--text-dim':    '#7c3aed',
      '--text-mute':   '#c4b5fd',
      '--r':           '24px',
      '--nav-bg':      '#f0e6ff',
      '--card-shadow': '0 10px 30px rgba(168,85,247,.25), inset 0 2px 0 rgba(255,255,255,0.8)',
      '--vis-color':   '168,85,247',
      '--vis-cap':     '216,180,254',
    },
    preview: ['#f0e6ff', '#a855f7', '#ffffff'],
  },
  gradientmorphism: {
    label: 'Gradientmorphism',
    desc: 'Plasma neon borders · Synthwave gradients · Electric glow',
    vars: {
      '--bg':          '#0f0c29',
      '--surface':     '#1a1545',
      '--surface2':    '#231d5e',
      '--surface3':    '#2d2678',
      '--border':      '#3730a3',
      '--border2':     '#4338ca',
      '--accent':      '#f472b6',
      '--accent-dim':  'rgba(244,114,182,.12)',
      '--accent-glo':  'rgba(244,114,182,.40)',
      '--accent-glo2': 'rgba(244,114,182,.20)',
      '--text':        '#fdf4ff',
      '--text-dim':    '#c4b5fd',
      '--text-mute':   '#4c1d95',
      '--r':           '18px',
      '--nav-bg':      'rgba(15,12,41,0.95)',
      '--card-shadow': '0 8px 32px rgba(244,114,182,.20)',
      '--vis-color':   '244,114,182',
      '--vis-cap':     '251,207,232',
    },
    preview: ['#0f0c29', '#f472b6', '#1a1545'],
  },
  fluidmorphism: {
    label: 'Fluidmorphism',
    desc: 'Morphing blobs · Bioluminescent ocean · Liquid motion',
    vars: {
      '--bg':          '#001219',
      '--surface':     '#00212b',
      '--surface2':    '#003140',
      '--surface3':    '#004150',
      '--border':      '#0a4f61',
      '--border2':     '#0e7490',
      '--accent':      '#06b6d4',
      '--accent-dim':  'rgba(6,182,212,.12)',
      '--accent-glo':  'rgba(6,182,212,.35)',
      '--accent-glo2': 'rgba(6,182,212,.18)',
      '--text':        '#ecfeff',
      '--text-dim':    '#67e8f9',
      '--text-mute':   '#164e63',
      '--r':           '28px',
      '--nav-bg':      'rgba(0,18,25,0.92)',
      '--card-shadow': '0 8px 32px rgba(6,182,212,.20), 0 0 60px rgba(6,182,212,.08)',
      '--vis-color':   '6,182,212',
      '--vis-cap':     '103,232,249',
    },
    preview: ['#001219', '#06b6d4', '#00212b'],
  },
};

// ── State ─────────────────────────────────────
let currentTheme = localStorage.getItem('sndtrk-theme') || 'darkmorphism';
let deferredInstallPrompt = null;
let crossfadeEnabled = localStorage.getItem('sndtrk-crossfade') === 'true';
let crossfadeDuration = parseInt(localStorage.getItem('sndtrk-crossfade-dur') || '3');
let normalizationEnabled = localStorage.getItem('sndtrk-normalize') === 'true';
let gaplessEnabled = localStorage.getItem('sndtrk-gapless') === 'true';
let visualizerStyle = localStorage.getItem('sndtrk-vis-style') || 'bars';
let accentColor = localStorage.getItem('sndtrk-accent') || '';

// ── Apply Theme ───────────────────────────────
export function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;
  const root = document.documentElement;

  // Apply CSS custom properties
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  // Set data-theme for structural CSS overrides (shape/material/texture per theme)
  root.setAttribute('data-theme', themeName);
  document.body.setAttribute('data-theme', themeName);
  const appEl = document.getElementById('app');
  if (appEl) appEl.setAttribute('data-theme', themeName);

  // Special body styles for light themes
  const lightThemes = ['neumorphism', 'claymorphism'];
  if (lightThemes.includes(themeName)) {
    document.body.style.setProperty('color-scheme', 'light');
  } else {
    document.body.style.setProperty('color-scheme', 'dark');
  }

  // Apply card-shadow CSS variable
  root.style.setProperty('--active-card-shadow', theme.vars['--card-shadow']);

  // Let CSS [data-theme] rules handle nav background (clear inline style)
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.background = '';

  currentTheme = themeName;
  localStorage.setItem('sndtrk-theme', themeName);
}

// Apply custom accent color override
function applyAccent(hex) {
  if (!hex) return;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-dim', `rgba(${r},${g},${b},.12)`);
  root.style.setProperty('--accent-glo', `rgba(${r},${g},${b},.35)`);
  root.style.setProperty('--accent-glo2', `rgba(${r},${g},${b},.18)`);
  root.style.setProperty('--vis-color', `${r},${g},${b}`);
}

// ── Settings Init ─────────────────────────────
export function initSettings() {
  // Apply saved theme on boot
  applyTheme(currentTheme);
  if (accentColor) applyAccent(accentColor);

  // Capture PWA install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    // Update install button if settings view is open
    const btn = document.getElementById('btn-install-pwa');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Install App';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('btn-install-pwa');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '✓ Already Installed';
    }
  });

  renderSettingsView();
  wireSettingsEvents();
}

// ── Render Settings HTML ──────────────────────
function renderSettingsView() {
  const view = document.getElementById('view-settings');
  if (!view) return;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone;

  view.innerHTML = `
    <!-- Mini player bar (same as library) -->
    <div class="mini-player" id="mini-player-settings">
      <div class="mini-art" id="mini-art-s"></div>
      <div class="mini-info">
        <div class="mini-title" id="mini-title-s">No track</div>
        <div class="mini-artist" id="mini-artist-s">—</div>
      </div>
      <div class="mini-progress-bar">
        <div class="mini-progress-fill" id="mini-fill-s" style="width:0%"></div>
      </div>
      <button class="mini-btn" id="mini-play-s">
        <svg id="mini-ic-play-s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <svg id="mini-ic-pause-s" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none">
          <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
      </button>
    </div>

    <div class="settings-scroll">
      <!-- Header -->
      <div class="settings-header">
        <div class="settings-wordmark">SETTINGS</div>
        <div class="settings-sub">Customize SNDTRK</div>
      </div>

      <!-- PWA Install -->
      <div class="settings-section">
        <div class="settings-section-label">APPLICATION</div>
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Install App</div>
              <div class="settings-row-desc">Add SNDTRK to your home screen for offline use</div>
            </div>
            <button class="settings-action-btn" id="btn-install-pwa"
              ${isStandalone ? 'disabled' : ''}>
              ${isStandalone ? '✓ Installed' : 'Install'}
            </button>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">App Version</div>
              <div class="settings-row-desc">SNDTRK v2.0 · Built with Web Audio API</div>
            </div>
            <div class="settings-row-badge">v2.0</div>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Clear Library</div>
              <div class="settings-row-desc">Remove all tracks from local storage</div>
            </div>
            <button class="settings-action-btn danger" id="btn-clear-lib">Clear</button>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="settings-section">
        <div class="settings-section-label">VISUAL THEME</div>
        <div class="theme-grid" id="theme-grid">
          ${Object.entries(THEMES).map(([key, t]) => `
            <button class="theme-card ${currentTheme === key ? 'active' : ''}" data-theme="${key}">
              <div class="theme-preview">
                <div class="theme-swatch" style="background:${t.preview[0]}">
                  <div class="theme-swatch-accent" style="background:${t.preview[1]}"></div>
                  <div class="theme-swatch-surface" style="background:${t.preview[2]}"></div>
                </div>
              </div>
              <div class="theme-name">${t.label}</div>
              <div class="theme-desc">${t.desc}</div>
              ${currentTheme === key ? '<div class="theme-check">✓</div>' : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Accent Color -->
      <div class="settings-section">
        <div class="settings-section-label">ACCENT COLOR</div>
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Custom Accent</div>
              <div class="settings-row-desc">Override theme accent color</div>
            </div>
            <div class="accent-controls">
              <input type="color" id="accent-picker" value="${accentColor || '#1db954'}" class="color-picker">
              <button class="settings-action-btn" id="btn-accent-reset">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Playback -->
      <div class="settings-section">
        <div class="settings-section-label">PLAYBACK</div>
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Crossfade</div>
              <div class="settings-row-desc">Smooth transition between tracks</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-crossfade" ${crossfadeEnabled ? 'checked' : ''}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row crossfade-dur-row ${crossfadeEnabled ? '' : 'disabled'}">
            <div class="settings-row-info">
              <div class="settings-row-title">Crossfade Duration</div>
              <div class="settings-row-desc"><span id="crossfade-dur-val">${crossfadeDuration}</span>s</div>
            </div>
            <input type="range" id="crossfade-dur" min="1" max="10" value="${crossfadeDuration}"
              class="inline-range" ${crossfadeEnabled ? '' : 'disabled'}>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Volume Normalization</div>
              <div class="settings-row-desc">Equalizes loudness across tracks</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-normalize" ${normalizationEnabled ? 'checked' : ''}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Gapless Playback</div>
              <div class="settings-row-desc">Remove silence between tracks</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-gapless" ${gaplessEnabled ? 'checked' : ''}>
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Visualizer -->
      <div class="settings-section">
        <div class="settings-section-label">VISUALIZER</div>
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Visualizer Style</div>
              <div class="settings-row-desc">Choose animation style</div>
            </div>
          </div>
          <div class="vis-style-grid">
            ${[
              { id: 'bars', label: 'Bars', icon: '▋▊▉' },
              { id: 'wave', label: 'Wave', icon: '∿∿∿' },
              { id: 'circle', label: 'Circle', icon: '◎' },
              { id: 'dots', label: 'Dots', icon: '···' },
            ].map(s => `
              <button class="vis-style-btn ${visualizerStyle === s.id ? 'active' : ''}"
                data-vis="${s.id}">
                <div class="vis-style-icon">${s.icon}</div>
                <div class="vis-style-label">${s.label}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="settings-section">
        <div class="settings-section-label">ABOUT</div>
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">SNDTRK</div>
              <div class="settings-row-desc">Local music player · No cloud · No tracking</div>
            </div>
          </div>
          <div class="settings-divider"></div>
          <div class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-title">Storage Used</div>
              <div class="settings-row-desc" id="storage-info">Calculating…</div>
            </div>
          </div>
        </div>
      </div>

      <div style="height: 20px;"></div>
    </div>
  `;

  // Calculate storage
  calcStorage();
}

async function calcStorage() {
  const el = document.getElementById('storage-info');
  if (!el) return;
  try {
    if (navigator.storage?.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      const usedMB = (usage / 1024 / 1024).toFixed(1);
      const totalMB = (quota / 1024 / 1024).toFixed(0);
      el.textContent = `${usedMB} MB used of ${totalMB} MB`;
    } else {
      el.textContent = 'Not available in this browser';
    }
  } catch {
    el.textContent = 'Unable to calculate';
  }
}

// ── Wire Settings Events ──────────────────────
function wireSettingsEvents() {
  document.addEventListener('click', e => {
    // Theme cards
    const themeCard = e.target.closest('.theme-card');
    if (themeCard) {
      const theme = themeCard.dataset.theme;
      applyTheme(theme);
      // If custom accent was set, reapply it
      if (accentColor) applyAccent(accentColor);
      // Re-render grid to update active state
      document.querySelectorAll('.theme-card').forEach(c => {
        c.classList.toggle('active', c.dataset.theme === theme);
        const check = c.querySelector('.theme-check');
        if (c.dataset.theme === theme) {
          if (!check) {
            const d = document.createElement('div');
            d.className = 'theme-check'; d.textContent = '✓';
            c.appendChild(d);
          }
        } else {
          if (check) check.remove();
        }
      });
    }

    // Visualizer style buttons
    const visBtn = e.target.closest('.vis-style-btn');
    if (visBtn) {
      visualizerStyle = visBtn.dataset.vis;
      localStorage.setItem('sndtrk-vis-style', visualizerStyle);
      document.querySelectorAll('.vis-style-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.vis === visualizerStyle);
      });
    }

    // Install PWA
    if (e.target.id === 'btn-install-pwa') {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(result => {
          if (result.outcome === 'accepted') {
            deferredInstallPrompt = null;
          }
        });
      } else {
        // Show install instructions toast
        import('./ui.js').then(({ toast }) => {
          toast('Use browser menu → "Add to Home Screen"');
        });
      }
    }

    // Clear library
    if (e.target.id === 'btn-clear-lib') {
      if (confirm('Remove all tracks from library? This cannot be undone.')) {
        indexedDB.deleteDatabase('sndtrk_v2');
        location.reload();
      }
    }

    // Accent reset
    if (e.target.id === 'btn-accent-reset') {
      accentColor = '';
      localStorage.removeItem('sndtrk-accent');
      applyTheme(currentTheme);
      const picker = document.getElementById('accent-picker');
      if (picker) picker.value = THEMES[currentTheme]?.vars['--accent'] || '#1db954';
      import('./ui.js').then(({ toast }) => toast('Accent color reset ✓'));
    }
  });

  // Accent color picker
  document.addEventListener('input', e => {
    if (e.target.id === 'accent-picker') {
      accentColor = e.target.value;
      localStorage.setItem('sndtrk-accent', accentColor);
      applyAccent(accentColor);
    }

    if (e.target.id === 'crossfade-dur') {
      crossfadeDuration = parseInt(e.target.value);
      localStorage.setItem('sndtrk-crossfade-dur', crossfadeDuration);
      const el = document.getElementById('crossfade-dur-val');
      if (el) el.textContent = crossfadeDuration;
    }
  });

  // Toggle switches
  document.addEventListener('change', e => {
    if (e.target.id === 'toggle-crossfade') {
      crossfadeEnabled = e.target.checked;
      localStorage.setItem('sndtrk-crossfade', crossfadeEnabled);
      const row = document.querySelector('.crossfade-dur-row');
      const range = document.getElementById('crossfade-dur');
      if (row) row.classList.toggle('disabled', !crossfadeEnabled);
      if (range) range.disabled = !crossfadeEnabled;
    }
    if (e.target.id === 'toggle-normalize') {
      normalizationEnabled = e.target.checked;
      localStorage.setItem('sndtrk-normalize', normalizationEnabled);
    }
    if (e.target.id === 'toggle-gapless') {
      gaplessEnabled = e.target.checked;
      localStorage.setItem('sndtrk-gapless', gaplessEnabled);
    }
  });
}