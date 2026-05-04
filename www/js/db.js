// ════════════════════════════════════════════
//  js/db.js — IndexedDB Module
//  SNDTRK — Local Music Player
// ════════════════════════════════════════════

const DB_NAME = 'sndtrk_v2';
const STORE   = 'songs';

let _db = null;

/** Open (or create) the IndexedDB database */
export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    req.onsuccess = e => {
      _db = e.target.result;
      resolve(_db);
    };

    req.onerror = e => reject(e.target.error);
  });
}

/** Get a transaction object store */
function store(mode = 'readonly') {
  return _db.transaction(STORE, mode).objectStore(STORE);
}

/** Add a new song record; resolves with the new id */
export function dbAdd(data) {
  return new Promise((resolve, reject) => {
    const req = store('readwrite').add(data);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

/** Get all songs (includes blobs) */
export function dbAll() {
  return new Promise((resolve, reject) => {
    const req = store('readonly').getAll();
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

/** Get one song by id (includes blob) */
export function dbGet(id) {
  return new Promise((resolve, reject) => {
    const req = store('readonly').get(id);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

/** Delete a song record */
export function dbDel(id) {
  return new Promise((resolve, reject) => {
    const req = store('readwrite').delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = e => reject(e.target.error);
  });
}