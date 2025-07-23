const CACHE_NAME = 'devtools-gh-1753232773';
const STATIC_ASSETS = [
    './',
    './css/critical.css',
    './js/core/ModuleLoader.js',
    './js/core/Router.js',
    './js/app.js',
    './images/logo.png',
    './images/favicon/favicon-32x32.png',
    './images/favicon/favicon-16x16.png'
];

const COMPONENT_CACHE = 'devtools-components-v1';

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== COMPONENT_CACHE)
                    .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event with caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Handle different types of requests
    if (url.pathname.startsWith('./components/')) {
        // Components: Cache First strategy
        event.respondWith(cacheFirst(request, COMPONENT_CACHE));
    } else if (url.pathname.startsWith('./css/') || url.pathname.startsWith('./js/')) {
        // CSS/JS: Cache First strategy
        event.respondWith(cacheFirst(request, CACHE_NAME));
    } else if (url.pathname.startsWith('./images/')) {
        // Images: Cache First strategy
        event.respondWith(cacheFirst(request, CACHE_NAME));
    } else if (url.pathname === './' || url.pathname.endsWith('.html')) {
        // HTML: Network First strategy
        event.respondWith(networkFirst(request));
    } else {
        // Other resources: Network First strategy
        event.respondWith(networkFirst(request));
    }
});

// Cache First Strategy
async function cacheFirst(request, cacheName = CACHE_NAME) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network request failed:', error);
        // Return offline fallback if available
        return caches.match('/offline.html') || new Response('Offline');
    }
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network request failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        return cachedResponse || caches.match('./offline.html') || new Response('Offline');
    }
}

// Background sync for analytics or error reporting
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Implement background sync logic here
    // For example, send analytics data or error reports
    console.log('Background sync triggered');
}
