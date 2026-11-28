// Cambia el número de versión cada vez que subas cambios, para forzar la actualización
const VERSION = 'alba-v3';
const ARCHIVOS = [
  './', './index.html', './manifest.json',
  './apps/english.html', './apps/deutsch.html', './apps/kasus.html', './apps/deutsch-ka2.html',
  './apps/bruch-trainer.html', './apps/dezimal.html', './apps/bio.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c =>
    Promise.all(ARCHIVOS.map(f => c.add(f).catch(() => null)))
  ));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Primero internet (para tener lo último); si no hay conexión, usa la copia guardada
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
