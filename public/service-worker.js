const CACHE_NAME = 'typing-practice-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/src/styles.css'
];
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      return resp || fetch(evt.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          try { cache.put(evt.request, response.clone()); } catch(e) {}
          return response;
        })
      }).catch(() => caches.match('/'));
    })
  );
});
