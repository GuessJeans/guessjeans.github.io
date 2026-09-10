const CACHE_NAME = 'p5js-pwa-cache-v1';
const ASSETS = [
  'index.html',
  'sketch.js',
  'style.css',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'https://cdn.jsdelivr.net/npm/p5@2.3.2/lib/p5.js',
  'https://cdn.jsdelivr.net/npm/p5.sound@0.4.1/dist/p5.sound.min.js'
];

// Install the Service Worker and save files to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
