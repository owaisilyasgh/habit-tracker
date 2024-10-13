
// Install the Service Worker
self.addEventListener('install', event => {
    console.info('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.info('Caching resources:', urlsToCache);
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate the Service Worker
self.addEventListener('activate', event => {
    console.info('Service Worker activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch and respond with cached resources or fetch from network
self.addEventListener('fetch', event => {
    console.debug('Fetch request for:', event.request.url);
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/habit-tracker/index.html').then(response => {
                return response || fetch('/habit-tracker/index.html');
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
