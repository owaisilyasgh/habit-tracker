// service-worker.js
// Version: 2.0

const CACHE_NAME = 'habit-tracker-cache-v6';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/ui.js',
    '/manifest.json'
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

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch and respond with cached resources or fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Listen for message from client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
