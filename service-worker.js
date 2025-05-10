// service-worker.js
// Version: 1.1

const CACHE_NAME = 'habit-tracker-cache-v6';
// Use relative paths for better compatibility
const urlsToCache = [
    './', // Cache the root (relative to SW scope)
    'index.html',
    'styles.css',
    'main.js', // Added main.js
    'ui.js',
    'db.js', // Added db.js
    'config.js', // Added config.js
    'manifest.json',
    'icons/favicon.ico', // Added icons
    'icons/apple-touch-icon.png',
    'icons/favicon-32x32.png',
    'icons/favicon-16x16.png',
    'icons/android-chrome-192x192.png',
    'icons/android-chrome-512x512.png'
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
