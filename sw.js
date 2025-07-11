const CACHE_NAME = 'zona-vida-cache-v1';
const urlsToCache = [
  '/zona-vida-ADOOKIA/',
  '/zona-vida-ADOOKIA/index.html',
  '/zona-vida-ADOOKIA/style.css',
  '/zona-vida-ADOOKIA/script.js',
  '/zona-vida-ADOOKIA/favicon.ico',
  '/zona-vida-ADOOKIA/manifest.json',
  '/zona-vida-ADOOKIA/img/logo.png',
  // Agrega otros recursos estáticos necesarios aquí
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
