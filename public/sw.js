// ExpenseIQ Production-Grade Service Worker
// Cache strategy: Safe App-Shell & Static Assets ONLY.
// Sensitive financial data and API responses are strictly excluded.

const CACHE_NAME = 'expenseiq-static-v1';

// App shell assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
];

// Determine if a request should bypass cache completely (Network-Only)
function isBypassedRequest(request) {
  // Non-GET requests (POST, PUT, DELETE, PATCH) must never be cached
  if (request.method !== 'GET') {
    return true;
  }

  const url = new URL(request.url);

  // Exclude API requests (local or backend port 4000 or paths containing /api/)
  if (
    url.pathname.startsWith('/api/') ||
    url.port === '4000' ||
    url.hostname.includes('api.')
  ) {
    return true;
  }

  // Exclude authorization / session endpoints
  if (
    url.pathname.includes('/auth/') ||
    request.headers.has('Authorization')
  ) {
    return true;
  }

  // Exclude Next.js data calls or JSON API responses for financial routes
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return true;
  }

  return false;
}

// Service Worker Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        // Log precache failure gracefully without breaking SW installation
        console.warn('[ExpenseIQ SW] Precache partial error:', err);
      });
    })
  );
});

// Service Worker Activation & Old Cache Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Handler
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Bypass cache completely for API, auth, non-GET, or financial requests
  if (isBypassedRequest(request)) {
    return;
  }

  const url = new URL(request.url);

  // Strategy 1: Cache-First for static build assets (Next.js _next/static, icons, images, fonts)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 2: Network-First with Cache Fallback for HTML Page Navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to app shell root
          return caches.match('/');
        })
    );
  }
});
