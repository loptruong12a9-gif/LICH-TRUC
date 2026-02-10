const CACHE_NAME = 'lich-truc-v4.7.0-elegant-headers';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './logo.jpg',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'
];

// Install Event: Cache files and skip waiting
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force activation of the new SW
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Immediately take control
    );
});

// Fetch Event: Network-First for HTML, Cache-First for others
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // For HTML files (root or index.html), try Network First
    if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        e.respondWith(
            fetch(e.request)
                .then((response) => {
                    // Update cache with the new version
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
                    return response;
                })
                .catch(() => caches.match(e.request)) // Fallback to cache if offline
        );
    } else {
        // For other assets (CSS, JS, Images), try Cache First
        e.respondWith(
            caches.match(e.request).then((response) => {
                return response || fetch(e.request);
            })
        );
    }
});
