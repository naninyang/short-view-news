const CACHE_NAME = 'news-data';

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/api/pages') ||
    event.request.url.includes('/api/sheetsNews') ||
    event.request.url.includes('/api/sheetsPlaylist') ||
    event.request.url.includes('/api/articlesNews') ||
    event.request.url.includes('/api/articlesEntertainment') ||
    event.request.url.includes('/api/periodtOmt') ||
    event.request.url.includes('/api/periodtTimeline') ||
    event.request.url.includes('/api/historyNaver') ||
    event.request.url.includes('/api/historyYouTube') ||
    event.request.url.includes('/api/twt')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      }),
    );
  }
});
