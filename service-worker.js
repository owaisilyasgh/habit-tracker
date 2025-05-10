// service-worker.js

const CACHE_NAME = 'habit-tracker-cache-v5';
const urlsToCache = [
    '/habit-tracker/',
    '/habit-tracker/index.html',
    '/habit-tracker/styles.css',
    '/habit-tracker/app.js',
    '/habit-tracker/manifest.json'
];

// Install the Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate the Service Worker
self.addEventListener('activate', event => {
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
