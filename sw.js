// ════════════════════════════════════════════
//  sw.js — SNDTRK Service Worker
//  Cache-first strategy → full offline support
// ════════════════════════════════════════════

const CACHE   = 'sndtrk-v2';
const ASSETS  = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/audio.js',
  '/js/db.js',
  '/js/ui.js',
  '/js/visualizer.js',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js'
];

// Install: pre-cache all shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network + dynamic cache
self.addEventListener('fetch', e => {
  // Skip non-GET and chrome-extension requests
  if (e.request.method !== 'GET') return;
  if (e.request.url.startsWith('chrome-extension://')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(resp => {
        // Dynamically cache font / CDN responses
        const url = e.request.url;
        if (url.includes('googleapis') || url.includes('cdnjs') || url.includes('gstatic')) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      });
    }).catch(() => new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    }))
  );
});