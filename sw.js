// ==========================
// SERVICE WORKER PARA PWA
// ==========================

const CACHE_NAME = 'zona-vida-cache-v1';

// Archivos a cachear
const urlsToCache = [
  '/zona-vida-ADOOKIA/',
  '/zona-vida-ADOOKIA/index.html',
  '/zona-vida-ADOOKIA/style.css',
  '/zona-vida-ADOOKIA/script.js',
  '/zona-vida-ADOOKIA/favicon.ico',
  '/zona-vida-ADOOKIA/manifest.json',
  '/zona-vida-ADOOKIA/img/logo.png',
  // Puedes agregar más imágenes, iconos u otros recursos estáticos aquí
];

// ========== INSTALACIÓN DEL SERVICE WORKER ==========
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ========== ACTIVACIÓN DEL SERVICE WORKER ==========
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      // Elimina caches antiguos si existen
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ========== INTERCEPCIÓN DE PETICIONES ==========
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devuelve cache, si no, fetch normal
        return response || fetch(event.request);
      })
  );
});
