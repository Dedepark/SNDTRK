// ════════════════════════════════════════════
//  js/visualizer.js — Canvas Visualizer Module
//  FFT bar visualization inside the album art card
// ════════════════════════════════════════════

let canvas   = null;
let ctx2d    = null;
let artWrap  = null;
let analyser = null;
let rafId    = null;
let _isActive = false; // track whether we *want* to be running

/** Connect the visualizer to its DOM elements and the Web Audio analyser */
export function setupVisualizer(canvasEl, artWrapEl, analyserNode) {
  canvas   = canvasEl;
  ctx2d    = canvas.getContext('2d');
  artWrap  = artWrapEl;
  if (analyserNode) analyser = analyserNode;
}

/** Update only the analyser node (called after new audio context / new track) */
export function updateAnalyser(analyserNode) {
  analyser = analyserNode;
  // If we're supposed to be active but weren't drawing due to missing analyser, restart
  if (_isActive && !rafId) {
    resizeCanvas();
    drawVis();
  }
}

export function resizeCanvas() {
  if (!canvas || !artWrap) return;
  const r = artWrap.getBoundingClientRect();
  // Only resize if artWrap is visible (non-zero dimensions)
  if (r.width > 0 && r.height > 0) {
    canvas.width  = r.width;
    canvas.height = r.height;
  }
}

export function startVis() {
  _isActive = true;
  if (rafId) return; // already running
  resizeCanvas();
  drawVis();
}

export function stopVis() {
  _isActive = false;
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  if (ctx2d && canvas) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
}

/** Called when returning to the player view while music is playing */
export function resumeVis() {
  if (!_isActive) return;
  // Cancel existing loop (may be drawing on stale dimensions)
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  resizeCanvas();
  drawVis();
}

function drawVis() {
  rafId = requestAnimationFrame(drawVis);
  if (!analyser || !ctx2d) return;

  const W    = canvas.width;
  const H    = canvas.height;
  if (W === 0 || H === 0) {
    // Canvas not visible yet — keep loop alive but don't draw
    return;
  }
  const bins = analyser.frequencyBinCount; // 256
  const data = new Uint8Array(bins);
  analyser.getByteFrequencyData(data);

  ctx2d.clearRect(0, 0, W, H);

  // Darken art overlay when art is showing
  const artImg = document.getElementById('album-art');
  if (artImg && artImg.classList.contains('loaded')) {
    ctx2d.fillStyle = 'rgba(0,0,0,0.28)';
    ctx2d.fillRect(0, 0, W, H);
  }

  const N    = 72;
  const step = Math.floor(bins / N);
  const bW   = (W / N) * 0.62;
  const gap  = (W / N) * 0.38;

  for (let i = 0; i < N; i++) {
    const raw = data[i * step] / 255;
    const val = raw * raw;          // square for punchier response
    const bH  = val * H * 0.80;
    const x   = i * (bW + gap);
    const y   = H - bH;

    if (bH < 1) continue;

    // Gradient bar — use CSS accent var if available, fallback to green
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vis-color').trim() || '29,185,84';

    const g = ctx2d.createLinearGradient(0, y, 0, H);
    g.addColorStop(0,   `rgba(${accentColor},${Math.min(0.9, val * 1.3 + 0.1)})`);
    g.addColorStop(0.6, `rgba(${accentColor},${val * 0.4})`);
    g.addColorStop(1,   `rgba(${accentColor},0)`);
    ctx2d.fillStyle = g;
    ctx2d.fillRect(x, y, bW, bH);

    // Bright cap
    if (val > 0.07) {
      const capColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--vis-cap').trim() || '160,255,185';
      ctx2d.fillStyle = `rgba(${capColor},${val * 0.85})`;
      ctx2d.fillRect(x, y, bW, 1.5);
    }
  }

  // Subtle reflection
  ctx2d.save();
  ctx2d.translate(0, H);
  ctx2d.scale(1, -1);
  ctx2d.globalAlpha = 0.07;
  for (let i = 0; i < N; i++) {
    const val = (data[i * step] / 255) ** 2;
    const bH  = val * H * 0.22;
    const x   = i * (bW + gap);
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vis-color').trim() || '29,185,84';
    ctx2d.fillStyle = `rgba(${accentColor},${val})`;
    ctx2d.fillRect(x, 0, bW, bH);
  }
  ctx2d.restore();
}