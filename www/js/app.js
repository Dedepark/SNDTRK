// ════════════════════════════════════════════
//  js/app.js — Main Entry Point
//  State management, event wiring, bootstrap
// ════════════════════════════════════════════

import { openDB, dbAdd, dbAll, dbDel } from './db.js';
import {
  init as initAudio, initCtx, loadAndPlay, togglePlay, stopPlayback,
  setCurIdx, setPlaying, bindMediaSessionHandlers,
  getCurAudio, playing, curIdx, analyser, gainNode, bassF, trebleF, audioCtx
} from './audio.js';
import { setupVisualizer, startVis, stopVis, resizeCanvas, resumeVis, updateAnalyser } from './visualizer.js';
import {
  DOM, toast, showView, updatePlayUI, setTrackMeta, clearTrackMeta,
  updateProgress, renderList, updateEqDisplay, stripExt, fmt
} from './ui.js';
import { initSettings } from './settings.js';

// Fungsi Izin dan Background Mode
async function requestPermissions() {
  if (window.Capacitor) {
    // 1. Izin Notifikasi
    const notification = window.Capacitor.Plugins.LocalNotifications;
    if (notification) {
      await notification.requestPermissions();
    }

    // 2. Aktifkan Background Mode (Cara Cordova)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.backgroundMode) {
      const bg = window.cordova.plugins.backgroundMode;
      bg.enable();
      
      bg.on('activate', () => {
         bg.disableWebViewOptimizations(); 
         bg.disableBatteryOptimizations();
      });

      bg.setDefaults({
        title: 'SNDTRK is Playing',
        text: 'Music continues in background',
        icon: 'ic_launcher', 
        color: '1db954',
        resume: true,
        hidden: false
      });
      
      console.log("Background Mode Configured");
    }
  }
}

// Pantau visibilitas untuk resume audio
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  requestPermissions();
});

// ══ App State ════════════════════════════════
let songs      = [];
let _curIdx    = -1;
let _playing   = false;
let shuffle    = false;
let repeatMode = 0;     // 0=off 1=all 2=one
let dragging   = false;

// ══ Sync helpers ═════════════════════════════
function syncPlaying(val) { _playing = val; setPlaying(val); }
function syncIdx(idx)     { _curIdx  = idx; setCurIdx(idx); }

// ══ Callbacks wired into audio.js ═══════════
function onTick(audio) {
  if (!audio || dragging) return;
  updateProgress(audio);
}

function onEnded() {
  if (repeatMode === 2) {
    const a = getCurAudio();
    if (a) { a.currentTime = 0; a.play(); }
  } else {
    skipNext(true);
  }
}

function onPlayUI() {
  _playing = playing;
  _curIdx  = curIdx;
  updatePlayUI(_playing, _curIdx);
}

// ══ Playback Controls ════════════════════════
async function playSong(idx) {
  if (idx < 0 || idx >= songs.length) return;
  const s = songs[idx];

  setTrackMeta(s);
  syncIdx(idx);

  try {
    const audio = await loadAndPlay(s, idx);
    syncPlaying(true);

    const { analyser: freshAnalyser } = await import('./audio.js');
    updateAnalyser(freshAnalyser);
    setupVisualizer(DOM.canvas, DOM.artWrap, freshAnalyser);

    audio.addEventListener('loadedmetadata', () => {
      DOM.tTot.textContent = fmt(audio.duration);
    }, { once: true });

    startVis();
    updatePlayUI(true, idx);
    renderSongList();
  } catch (err) {
    console.error('playback error:', err);
    toast('Error loading track');
    syncPlaying(false);
    updatePlayUI(false, idx);
    stopVis();
  }
}

function handleTogglePlay() {
  initCtx(); // Pastikan context aktif
  if (!getCurAudio()) {
    if (songs.length) playSong(0);
    return;
  }
  const nowPlaying = togglePlay();
  syncPlaying(nowPlaying);
  if (nowPlaying) startVis(); else stopVis();
  updatePlayUI(_playing, _curIdx);
}

function skipNext(auto = false) {
  if (!songs.length) return;
  let next;
  if (shuffle) {
    next = Math.floor(Math.random() * songs.length);
  } else {
    next = _curIdx + 1;
    if (next >= songs.length) {
      if (repeatMode === 0 && auto) {
        syncPlaying(false);
        updatePlayUI(false, _curIdx);
        stopVis();
        return;
      }
      next = 0;
    }
  }
  playSong(next);
}

function skipPrev() {
  const a = getCurAudio();
  if (a && a.currentTime > 3) { a.currentTime = 0; return; }
  if (!songs.length) return;
  const prev = shuffle
    ? Math.floor(Math.random() * songs.length)
    : (_curIdx - 1 + songs.length) % songs.length;
  playSong(prev);
}

// ══ File Import ══════════════════════════════
async function importFiles(files) {
  let added = 0;
  for (const f of files) {
    if (!f.type.startsWith('audio/')) continue;
    toast(`Importing ${f.name}…`);
    const [meta, dur] = await Promise.all([readID3(f), getAudioDuration(f)]);
    const id = await dbAdd({
      title: meta.title, artist: meta.artist,
      artUrl: meta.artUrl, duration: dur, blob: f
    });
    songs.push({ id, title: meta.title, artist: meta.artist, artUrl: meta.artUrl, duration: dur });
    added++;
  }
  renderSongList();
  if (added) toast(`${added} track${added > 1 ? 's' : ''} added ✓`);
}

async function removeSong(id, idx) {
  await dbDel(id);
  songs.splice(idx, 1);

  if (_curIdx === idx) {
    stopPlayback();
    syncPlaying(false);
    syncIdx(-1);
    clearTrackMeta();
    stopVis();
    updatePlayUI(false, -1);
  } else if (_curIdx > idx) {
    syncIdx(_curIdx - 1);
  }

  renderSongList();
  toast('Removed');
}

function renderSongList() {
  renderList(songs, _curIdx, _playing,
    (i) => { playSong(i); showView('view-player'); },
    (id, i) => removeSong(id, i)
  );
}

// ══ Seek / Progress ══════════════════════════
function seekTo(clientX) {
  const a = getCurAudio();
  if (!a?.duration) return;
  const r   = DOM.progBar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  a.currentTime = pct * a.duration;
  updateProgress(a);
}

// ══ ID3 Tags ═════════════════════════════════
function readID3(file) {
  return new Promise(resolve => {
    if (typeof jsmediatags === 'undefined')
      return resolve({ title: stripExt(file.name), artist: '', artUrl: null });

    jsmediatags.read(file, {
      onSuccess: tag => {
        const t = tag.tags;
        let artUrl = null;
        if (t.picture) {
          const bytes = new Uint8Array(t.picture.data);
          artUrl = URL.createObjectURL(new Blob([bytes], { type: t.picture.format }));
        }
        resolve({ title: t.title || stripExt(file.name), artist: t.artist || '', artUrl });
      },
      onError: () => resolve({ title: stripExt(file.name), artist: '', artUrl: null })
    });
  });
}

function getAudioDuration(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const a   = new Audio(); a.src = url;
    a.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(a.duration); };
    a.onerror          = () => { URL.revokeObjectURL(url); resolve(0); };
  });
}

// ══ Event Wiring ═════════════════════════════
function wireEvents() {
  DOM.progBar.addEventListener('mousedown', e => {
    dragging = true; DOM.progBar.classList.add('dragging'); seekTo(e.clientX);
  });
  DOM.progBar.addEventListener('touchstart', e => {
    dragging = true; DOM.progBar.classList.add('dragging'); seekTo(e.touches[0].clientX); e.preventDefault();
  }, { passive: false });
  document.addEventListener('mousemove', e => { if (dragging) seekTo(e.clientX); });
  document.addEventListener('touchmove', e => { if (dragging) seekTo(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup',   () => { dragging = false; DOM.progBar.classList.remove('dragging'); });
  document.addEventListener('touchend',  () => { dragging = false; DOM.progBar.classList.remove('dragging'); });

  document.getElementById('btn-play').addEventListener('click', handleTogglePlay);
  document.getElementById('btn-prev').addEventListener('click', skipPrev);
  document.getElementById('btn-next').addEventListener('click', () => skipNext());

  document.getElementById('btn-shuf').addEventListener('click', () => {
    shuffle = !shuffle;
    document.getElementById('btn-shuf').classList.toggle('lit', shuffle);
  });

  document.getElementById('btn-rep').addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const btn = document.getElementById('btn-rep');
    btn.classList.toggle('lit',     repeatMode > 0);
    btn.classList.toggle('rep-one', repeatMode === 2);
    btn.title = ['Repeat: Off', 'Repeat: All', 'Repeat: One'][repeatMode];
  });

  DOM.miniPlay.addEventListener('click', e => { e.stopPropagation(); handleTogglePlay(); });
  DOM.miniNext.addEventListener('click', e => { e.stopPropagation(); skipNext(); });
  DOM.miniPlayer.addEventListener('click', () => showView('view-player'));

  document.getElementById('btn-add').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', e => {
    const files = Array.from(e.target.files);
    if (files.length) { importFiles(files); e.target.value = ''; }
  });

  DOM.navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      showView(target);
      if (target === 'view-player') {
        requestAnimationFrame(() => {
          resumeVis();
        });
      }
    });
  });

  DOM.eqB.addEventListener('input', () => {
    const v = parseFloat(DOM.eqB.value);
    if (bassF) bassF.gain.value = v;
    updateEqDisplay(v, parseFloat(DOM.eqT.value), parseFloat(DOM.vol.value));
  });
  DOM.eqT.addEventListener('input', () => {
    const v = parseFloat(DOM.eqT.value);
    if (trebleF) trebleF.gain.value = v;
    updateEqDisplay(parseFloat(DOM.eqB.value), v, parseFloat(DOM.vol.value));
  });
  DOM.vol.addEventListener('input', () => {
    const v = parseFloat(DOM.vol.value);
    if (gainNode) gainNode.gain.value = v;
    updateEqDisplay(parseFloat(DOM.eqB.value), parseFloat(DOM.eqT.value), v);
  });

  document.getElementById('btn-eq-reset').addEventListener('click', () => {
    DOM.eqB.value = 0; DOM.eqT.value = 0; DOM.vol.value = 1;
    if (bassF)   bassF.gain.value   = 0;
    if (trebleF) trebleF.gain.value = 0;
    if (gainNode) gainNode.gain.value = 1;
    updateEqDisplay(0, 0, 1);
    toast('EQ reset ✓');
  });

  window.addEventListener('resize', () => {
    if (playing) {
      requestAnimationFrame(() => resumeVis());
    } else {
      resizeCanvas();
    }
  });

  bindMediaSessionHandlers({
    onPlay:  () => { if (!playing) handleTogglePlay(); },
    onPause: () => { if (playing)  handleTogglePlay(); },
    onNext:  () => skipNext(),
    onPrev:  () => skipPrev(),
  });
}

// ══ Bootstrap ════════════════════════════════
async function init() {
  await openDB();

  initAudio({ onTick, onEnded, onPlayUI });
  setupVisualizer(DOM.canvas, DOM.artWrap, null);

  const all = await dbAll();
  songs = all.map(r => ({
    id: r.id, title: r.title, artist: r.artist,
    artUrl: r.artUrl, duration: r.duration
  }));

  renderSongList();
  updateEqDisplay(0, 0, 1);

  if (songs.length) setTrackMeta(songs[0]);
  initSettings();
  wireEvents();
}

document.addEventListener('click', function hookAnalyser() {
  setTimeout(() => {
    if (analyser) {
      setupVisualizer(DOM.canvas, DOM.artWrap, analyser);
      updateAnalyser(analyser);
      document.removeEventListener('click', hookAnalyser);
    }
  }, 100);
}, { capture: true });

init().catch(console.error);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}