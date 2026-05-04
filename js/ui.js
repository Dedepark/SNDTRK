// ════════════════════════════════════════════
//  js/ui.js — UI Rendering Module
//  DOM updates, list rendering, view switching
// ════════════════════════════════════════════

// ── DOM References ────────────────────────────
const $ = id => document.getElementById(id);

export const DOM = {
  app:         $('app'),
  playerView:  $('view-player'),
  libView:     $('view-lib'),
  eqView:      $('view-eq'),

  artWrap:     $('art-wrap'),
  artPh:       $('art-ph'),
  albumArt:    $('album-art'),
  ambientImg:  $('ambient-img'),
  canvas:      $('vis-canvas'),

  pTitle:      $('p-title'),
  pArtist:     $('p-artist'),
  progBar:     $('prog-bar'),
  progFill:    $('prog-fill'),
  tCur:        $('t-cur'),
  tTot:        $('t-tot'),
  icPlay:      $('ic-play'),
  icPause:     $('ic-pause'),

  miniPlayer:  $('mini-player'),
  miniArt:     $('mini-art'),
  miniTitle:   $('mini-title'),
  miniArtist:  $('mini-artist'),
  miniFill:    $('mini-fill'),
  miniPlay:    $('mini-play'),
  miniNext:    $('mini-next'),
  miniIcPlay:  $('mini-ic-play'),
  miniIcPause: $('mini-ic-pause'),

  songList:    $('song-list'),
  emptyEl:     $('empty'),
  libCount:    $('lib-count'),
  toastEl:     $('toast'),

  eqB:         $('eq-b'),
  eqT:         $('eq-t'),
  vol:         $('vol'),
  vb:          $('vb'),
  vt:          $('vt'),
  volVal:      $('vol-val'),
  eqBFill:     $('eq-b-fill'),
  eqTFill:     $('eq-t-fill'),
  volFill:     $('vol-fill'),

  navBtns:     document.querySelectorAll('.nav-btn'),
};

// ── Toast ─────────────────────────────────────
let toastTimer = null;
export function toast(msg) {
  DOM.toastEl.textContent = msg;
  DOM.toastEl.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toastEl.classList.remove('show'), 2600);
}

// ── View Switcher ─────────────────────────────
let currentView = 'view-player';
export function showView(id) {
  currentView = id;
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === id);
  });
  DOM.navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === id);
  });
}
export function getCurrentView() { return currentView; }

// ── Player UI ─────────────────────────────────
export function updatePlayUI(playing, curIdx) {
  DOM.icPlay.style.display    = playing ? 'none'  : 'block';
  DOM.icPause.style.display   = playing ? 'block' : 'none';
  DOM.miniIcPlay.style.display  = playing ? 'none'  : 'block';
  DOM.miniIcPause.style.display = playing ? 'block' : 'none';
  DOM.artWrap.classList.toggle('playing', playing);

  // Sync list items
  document.querySelectorAll('.s-item').forEach((el, i) => {
    el.classList.toggle('now', i === curIdx);
    const bars = el.querySelector('.bars');
    if (bars) bars.style.display = (i === curIdx && playing) ? 'flex' : 'none';
  });
}

export function setTrackMeta(song) {
  DOM.pTitle.textContent  = song.title  || 'Unknown Title';
  DOM.pArtist.textContent = song.artist || 'Unknown Artist';

  // Album art
  if (song.artUrl) {
    DOM.albumArt.src = song.artUrl;
    DOM.albumArt.onload = () => DOM.albumArt.classList.add('loaded');
    DOM.artPh.style.display = 'none';

    // Ambient background
    DOM.ambientImg.src = song.artUrl;
    DOM.ambientImg.onload = () => DOM.ambientImg.classList.add('loaded');
  } else {
    DOM.albumArt.classList.remove('loaded');
    DOM.albumArt.src = '';
    DOM.artPh.style.display = 'flex';
    DOM.ambientImg.classList.remove('loaded');
    DOM.ambientImg.src = '';
  }

  // Mini player info
  DOM.miniTitle.textContent  = song.title  || 'Unknown';
  DOM.miniArtist.textContent = song.artist || '—';

  // Mini art
  DOM.miniArt.innerHTML = '';
  if (song.artUrl) {
    const img = document.createElement('img');
    img.src = song.artUrl; img.alt = '';
    DOM.miniArt.appendChild(img);
  } else {
    DOM.miniArt.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="7" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="17"/><line x1="7" y1="12" x2="2" y2="12"/>
      <line x1="22" y1="12" x2="17" y2="12"/>
    </svg>`;
  }
}

export function clearTrackMeta() {
  DOM.pTitle.textContent  = 'No Track Selected';
  DOM.pArtist.textContent = '— — —';
  DOM.albumArt.classList.remove('loaded');
  DOM.albumArt.src = '';
  DOM.artPh.style.display = 'flex';
  DOM.ambientImg.classList.remove('loaded');
  DOM.ambientImg.src = '';
  DOM.progFill.style.width = '0%';
  DOM.tCur.textContent = '0:00';
  DOM.tTot.textContent = '0:00';
  DOM.miniTitle.textContent  = 'No track';
  DOM.miniArtist.textContent = '—';
  DOM.miniFill.style.width   = '0%';
}

export function updateProgress(curAudio) {
  if (!curAudio || !curAudio.duration) return;
  const pct = (curAudio.currentTime / curAudio.duration) * 100;
  DOM.progFill.style.width = pct + '%';
  DOM.miniFill.style.width = pct + '%';
  DOM.tCur.textContent = fmt(curAudio.currentTime);
  DOM.tTot.textContent = fmt(curAudio.duration);
}

// ── Song List ─────────────────────────────────
export function renderList(songs, curIdx, playing, onPlay, onDelete) {
  DOM.songList.innerHTML = '';
  const count = songs.length;

  DOM.libCount.textContent = count ? `${count} track${count !== 1 ? 's' : ''}` : '0 tracks';

  if (!count) {
    DOM.emptyEl.style.display = 'flex';
    return;
  }
  DOM.emptyEl.style.display = 'none';

  const frag = document.createDocumentFragment();

  songs.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 's-item' + (i === curIdx ? ' now' : '');

    const thumb = s.artUrl
      ? `<img src="${esc(s.artUrl)}" alt="">`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5">
           <circle cx="12" cy="12" r="5"/>
           <line x1="12" y1="7" x2="12" y2="2"/>
           <line x1="12" y1="22" x2="12" y2="17"/>
           <line x1="7" y1="12" x2="2" y2="12"/>
           <line x1="22" y1="12" x2="17" y2="12"/>
         </svg>`;

    el.innerHTML = `
      <div class="s-ic">${thumb}</div>
      <div class="s-info">
        <div class="s-title">${esc(s.title || 'Unknown')}</div>
        <div class="s-art">${esc(s.artist || '—')}</div>
      </div>
      <div class="bars" style="display:${(i === curIdx && playing) ? 'flex' : 'none'}">
        <div class="bar"></div><div class="bar"></div><div class="bar"></div>
      </div>
      <div class="s-dur">${fmt(s.duration || 0)}</div>
      <button class="s-del" data-id="${s.id}" aria-label="Remove">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
        </svg>
      </button>`;

    el.addEventListener('click', e => {
      if (e.target.closest('.s-del')) return;
      onPlay(i);
    });

    el.querySelector('.s-del').addEventListener('click', e => {
      e.stopPropagation();
      onDelete(s.id, i);
    });

    frag.appendChild(el);
  });

  DOM.songList.appendChild(frag);
}

// ── EQ display ────────────────────────────────
export function updateEqDisplay(bassVal, trebleVal, volVal) {
  DOM.vb.textContent = bassVal > 0 ? `+${bassVal}` : bassVal;
  DOM.vt.textContent = trebleVal > 0 ? `+${trebleVal}` : trebleVal;
  DOM.volVal.textContent = Math.round(volVal * 100);
  // Fill bars: range is -10..+10 → map to 0..100%
  DOM.eqBFill.style.width  = ((bassVal   + 10) / 20 * 100) + '%';
  DOM.eqTFill.style.width  = ((trebleVal + 10) / 20 * 100) + '%';
  DOM.volFill.style.width  = (volVal * 100) + '%';
}

// ── Helpers ───────────────────────────────────
export function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export function stripExt(name) {
  return name.replace(/\.[^/.]+$/, '');
}