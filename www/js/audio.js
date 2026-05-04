// ════════════════════════════════════════════
//  js/audio.js — Audio Engine Module
//  Graph: src → bass → treble → analyser → gain → out
// ════════════════════════════════════════════

import { dbGet } from './db.js';

// ── Audio Context & Nodes ─────────────────────
export let audioCtx  = null;
export let analyser  = null;
export let bassF     = null;
export let trebleF   = null;
export let gainNode  = null;

let srcNode  = null;
let curAudio = null;
let blobUrl  = null;

// ── Playback State (shared with app.js) ──────
export let playing    = false;
export let curIdx     = -1;

// ── Callbacks injected by app.js ─────────────
let _onTick     = null;
let _onEnded    = null;
let _onPlayUI   = null;
let _songs      = null;   // ref to the songs array

export function init({ onTick, onEnded, onPlayUI, songs }) {
  _onTick   = onTick;
  _onEnded  = onEnded;
  _onPlayUI = onPlayUI;
  _songs    = songs;
}

/** Create AudioContext + DSP chain (call on first user gesture) */
export function initCtx() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  bassF = audioCtx.createBiquadFilter();
  bassF.type = 'lowshelf';
  bassF.frequency.value = 200;
  bassF.gain.value = 0;

  trebleF = audioCtx.createBiquadFilter();
  trebleF.type = 'highshelf';
  trebleF.frequency.value = 3000;
  trebleF.gain.value = 0;

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.8;

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  // Wire the graph
  bassF.connect(trebleF);
  trebleF.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

/** Load a song from DB and begin playback */
export async function loadAndPlay(song, idx) {
  initCtx();
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  // Teardown previous
  if (curAudio) { curAudio.pause(); curAudio.src = ''; }
  if (srcNode)  { try { srcNode.disconnect(); } catch (_) {} srcNode = null; }
  if (blobUrl)  { URL.revokeObjectURL(blobUrl); blobUrl = null; }

  const rec = await dbGet(song.id);
  if (!rec?.blob) throw new Error('Audio blob missing for: ' + song.title);

  curIdx = idx;
  blobUrl  = URL.createObjectURL(rec.blob);
  curAudio = new Audio();
  curAudio.src = blobUrl;
  curAudio.preload = 'auto';

  srcNode = audioCtx.createMediaElementSource(curAudio);
  srcNode.connect(bassF);

  curAudio.addEventListener('timeupdate',     () => _onTick?.(curAudio));
  curAudio.addEventListener('ended',          () => _onEnded?.());
  curAudio.addEventListener('loadedmetadata', () => {});

  await curAudio.play();
  playing = true;
  _onPlayUI?.();
  setMediaSession(song);

  return curAudio;
}

export function getCurAudio() { return curAudio; }

/** Toggle play / pause */
export function togglePlay() {
  if (!curAudio) return false;
  initCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (playing) {
    curAudio.pause(); playing = false;
  } else {
    curAudio.play(); playing = true;
  }
  _onPlayUI?.();
  return playing;
}

/** Force stop; called when a track is removed */
export function stopPlayback() {
  if (curAudio) { curAudio.pause(); curAudio.src = ''; }
  playing = false;
  curIdx  = -1;
  _onPlayUI?.();
}

/** Set the idx externally (after list mutation) */
export function setCurIdx(idx) { curIdx = idx; }

/** Set playing state externally */
export function setPlaying(val) { playing = val; }

// ── Media Session API ─────────────────────────
function setMediaSession(song) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title:  song.title  || 'Unknown',
    artist: song.artist || 'Unknown',
    album:  'SNDTRK',
    artwork: song.artUrl
      ? [{ src: song.artUrl, sizes: '512x512', type: 'image/jpeg' }]
      : []
  });
}

export function bindMediaSessionHandlers({ onPlay, onPause, onNext, onPrev }) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.setActionHandler('play',          onPlay);
  navigator.mediaSession.setActionHandler('pause',         onPause);
  navigator.mediaSession.setActionHandler('nexttrack',     onNext);
  navigator.mediaSession.setActionHandler('previoustrack', onPrev);
}