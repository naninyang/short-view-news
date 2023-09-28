const CACHE_NAME = 'news-cache-v1';

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/shorts')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      }),
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});
