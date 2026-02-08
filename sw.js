const CACHE_NAME = 'arena-vitale-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg',
  './logo2.png'
];

// Instalação do Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Resposta às requisições (Cache first, then network)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Se encontrar no cache, retorna. Se não, busca na rede.
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Atualização do Service Worker
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});